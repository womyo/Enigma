import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ScheduleModule } from "@nestjs/schedule";
import { DailyModule } from "./daily-setting/daily-setting.module";
import { typeORMConfig } from "./configs/typeorm.config";
import { AuthModule } from "./auth/auth.module";
import { AuthTokenMiddleware } from "./core/middleware/auth-token.middleware";

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    ScheduleModule.forRoot(),
    DailyModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // 모든 라우팅에 AuthTokenMiddleware가 지나가도록
    consumer
      .apply(AuthTokenMiddleware)
      .forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
