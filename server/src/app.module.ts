import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { EventsModule } from "./events/events.module";
import { BatchModule } from "./batch/batch.module";
import { DailyModule } from "./daily/daily.module";
import { Daily } from "./daily/entities/daily.entity";

@Module({
  imports: [
    EventsModule,
    BatchModule,
    DailyModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: [".env"],
    }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Daily],
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
