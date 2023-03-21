import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { authConfig } from "src/configs/auth.config";
import { UserService } from "src/user/user.service";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh-token"
) {
  constructor(private readonly userService: UserService) {
    /**
     * 쿠키에 있는 Refresh Token 값 확인
     * verify callback(validate)에 request를 pass
     */
    super({
      secretOrKey: authConfig.REFRESH_TOKEN_SECRET_KEY,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.cookies?.Refresh;
        },
      ]),
      passReqToCallback: true,
    });
  }

  /**
   * Refresh Token이 유효한지 확인
   * @param req
   * @param payload
   */
  async validate(req, payload) {
    const refreshToken = req.cookies?.Refresh;
    return this.userService.getUser(payload.id, refreshToken);
  }
}
