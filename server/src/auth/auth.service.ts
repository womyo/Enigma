import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { UserEntity } from "src/entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { UserDto } from "src/dto/user.dto";
import { authConfig } from "src/configs/auth.config";
import * as bcrypt from "bcryptjs";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService
  ) {}

  /**
   *  유저 인증
   * @param email
   * @param password
   * @returns 유저 존재 여부와 비밀번호가 일치하는지 확인하여 유저 정보 리턴. Validate하지 않을 시 null 리턴
   */
  async validateUser(email: string, password: string): Promise<UserEntity> {
    const user = await this.userService.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  /**
   * 회원 가입
   * @param userDto
   */
  async signUp(userDto: UserDto): Promise<void> {
    const { password, ...userInfo } = userDto;
    // 비밀번호 암호화
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = { password: hashedPassword, ...userInfo };

    try {
      await this.userService.create(user);
    } catch (err) {
      // 이미 가입된 이메일로 가입 시도 시 Conflict error
      if (err.code === "ER_DUP_ENTRY") {
        throw new ConflictException("Email exist");
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  /**
   * AccessToken을 담은 쿠키를 생성하기 위한 정보 리턴
   * @param id
   * @returns AccessToken, AccessToken의 Option
   */
  getAccessTokenOptions(id: number) {
    const payload = { id };
    // 유효시간 1시간짜리 accessToken generate
    const accessToken = this.jwtService.sign(payload, {
      secret: authConfig.ACCESS_TOKEN_SECRET_KEY,
      expiresIn: `${authConfig.ACCESS_TOKEN_EXPIRATION_TIME}s`,
    });

    return {
      accessToken: accessToken,
      maxAge: authConfig.ACCESS_TOKEN_EXPIRATION_TIME * 1000,
    };
  }

  /**
   * RefreshToken을 담은 쿠키를 생성하기 위한 정보 리턴
   * @param id
   * @returns RefreshToken, RefreshToken의 Option
   */
  getRefreshTokenOption(id: number) {
    const payload = { id };
    // 유효시간 30일짜리 refreshToken generate
    const refreshToken = this.jwtService.sign(payload, {
      secret: authConfig.REFRESH_TOKEN_SECRET_KEY,
      expiresIn: `${authConfig.REFRESH_TOKEN_EXPIRATION_TIME}s`,
    });

    return {
      refreshToken: refreshToken,
      maxAge: authConfig.REFRESH_TOKEN_EXPIRATION_TIME * 1000,
    };
  }

  /**
   * 현재 쿠키에 빈 쿠키를 기입하기 위해 AccessToken, RefreshToken이 유지되는 시간이 0인 option들을 리턴
   */
  getOptionsForLogOut() {
    return {
      accessOption: {
        maxAge: 0,
      },
      refreshOption: {
        maxAge: 0,
      },
    };
  }
}
