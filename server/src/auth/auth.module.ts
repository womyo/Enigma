import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/entities/user.entity";
import { LocalStrategy } from "src/core/strategies/local.strategy";
import { UserModule } from "src/user/user.module";
import { authConfig } from "src/configs/auth.config";
import { JwtRefreshStrategy } from "src/core/strategies/jwt-refresh.strategy";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: authConfig.ACCESS_TOKEN_SECRET_KEY,
      signOptions: {
        expiresIn: `${authConfig.ACCESS_TOKEN_EXPIRATION_TIME}s`,
      },
    }),
    TypeOrmModule.forFeature([UserEntity]),
    UserModule,
  ],
  providers: [AuthService, LocalStrategy, JwtRefreshStrategy],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
