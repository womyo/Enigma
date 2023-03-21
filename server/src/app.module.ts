import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ScheduleModule } from "@nestjs/schedule";
import { DailyModule } from "./daily-setting/daily-setting.module";
import { typeORMConfig } from "./configs/typeorm.config";
import { AuthModule } from "./auth/auth.module";

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
export class AppModule {}
