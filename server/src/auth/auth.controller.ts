import {
  Body,
  Controller,
  Get,
  Post,
  Response,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserDto } from "src/dto/user.dto";
import { LocalAuthGuard } from "src/core/guards/local-auth.guard";
import { JwtRefreshGuard } from "src/core/guards/jwt-refresh.guard";
import { UserService } from "src/user/user.service";
import { User } from "src/common/decorators/user.decorator";
import * as Path from "path";

@Controller(Path.join("api", "v1", "auth"))
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Post("/signup")
  async signUp(@Body(ValidationPipe) userDto: UserDto) {
    return this.authService.signUp(userDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post("/login")
  async logIn(@User() user, @Response({ passthrough: true }) res) {
    const { accessToken, ...accessOption } =
      await this.authService.getAccessTokenOptions(user.id);

    const { refreshToken, ...refreshOption } =
      await this.authService.getRefreshTokenOption(user.id);

    await this.userService.setRefreshToken(user.id, refreshToken);

    res.cookie("Authentication", accessToken, accessOption);
    res.cookie("Refresh", refreshToken, refreshOption);

    return user;
  }

  @UseGuards(JwtRefreshGuard)
  @Post("/logout")
  async logOut(@User() user, @Response({ passthrough: true }) res) {
    const { accessOption, refreshOption } =
      await this.authService.getOptionsForLogOut();

    await this.userService.removeRefreshToken(user.id);

    res.cookie("Authentication", "", accessOption);
    res.cookie("Refresh", "", refreshOption);
  }

  @UseGuards(JwtRefreshGuard)
  @Get("/refresh")
  async refresh(@User() user, @Response({ passthrough: true }) res) {
    const { accessToken, ...accessOption } =
      await this.authService.getAccessTokenOptions(user.id);

    res.cookie("Authentication", accessToken, accessOption);
    return user;
  }
}
