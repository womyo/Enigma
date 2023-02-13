import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UserService } from "./user.service";
import { UserCredentialDto } from "./dto/user-credential.dto";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/signup")
  signUp(@Body(ValidationPipe) userCredentialDto: UserCredentialDto) {
    return this.userService.signUp(userCredentialDto);
  }

  @Post("/signin")
  signIn(
    @Body(ValidationPipe) userCredentialDto: UserCredentialDto
  ): Promise<{ accessToken: string }> {
    return this.userService.signIn(userCredentialDto);
  }

  @Post("/test")
  @UseGuards(AuthGuard())
  test(@Req() req) {
    console.log("req: ", req);
  }
}
