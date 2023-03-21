import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request, Response } from "express";
import { authConfig } from "src/configs/auth.config";

@Injectable()
export class AuthTokenMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  public async use(req: Request, res: Response, next: () => void) {
    req.user = await this.verifyUser(req);
    return next();
  }

  private async verifyUser(req: Request): Promise<any> {
    let user = null;
    try {
      const token = req.cookies?.Authentication;
      const decoded = await this.validateToken(token);
      user = decoded;
    } catch (err) {}

    return user;
  }

  private async validateToken(token: string) {
    try {
      const verify = this.jwtService.verify(token, {
        secret: authConfig.ACCESS_TOKEN_SECRET_KEY,
      });

      return verify;
    } catch (err) {
      switch (err.message) {
        case "INVALID_TOKEN":
        case "TOKEN_IS_ARRAY":
        case "NO_USER":
          throw new HttpException(
            "Not Authorized Token",
            HttpStatus.UNAUTHORIZED
          );

        case "EXPIRED_TOKEN":
          throw new HttpException("Expired Token", HttpStatus.GONE);

        default:
          throw new HttpException(
            "Server Error",
            HttpStatus.INTERNAL_SERVER_ERROR
          );
      }
    }
  }
}
