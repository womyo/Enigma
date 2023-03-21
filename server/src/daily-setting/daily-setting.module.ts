import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DailyService } from "./daily-setting.service";
import { DailySetting } from "../entities/daily-setting.entity";
import { ShuffleService } from "./shuffle.service";
import { BatchService } from "./batch.service";

@Module({
  imports: [TypeOrmModule.forFeature([DailySetting])],
  controllers: [],
  providers: [DailyService, ShuffleService, BatchService],
  exports: [DailyService, ShuffleService],
})
export class DailyModule {}
