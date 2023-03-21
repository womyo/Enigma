import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "local") {
  constructor(private authService: AuthService) {
    /**
     * passport-local strategy option을 전달
     * passport는 validate 메소드에 (username, password) parameter set을 가짐
     * 인증 절차를 username 대신 email을 통해 하기 위해 usernameField를 'email'로 바꿔줌
     */
    super({
      usernameField: "email",
    });
  }

  /**
   *
   * @param email
   * @param password
   * @returns validation이 성공하면 user를 리턴, 실패(유저가 존재하지 않음, 비밀번호가 불일치)시 에러
   */
  async validate(email: string, password: string) {
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException("Login failed");
    }
    return user;
  }
}
