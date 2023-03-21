import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DailyService } from "./daily.service";
import { Daily } from "../entities/daily.entity";
import { ShuffleService } from "./shuffle.service";
import { BatchService } from "./batch.service";

@Module({
  imports: [TypeOrmModule.forFeature([Daily])],
  controllers: [],
  providers: [DailyService, ShuffleService, BatchService],
  exports: [DailyService, ShuffleService],
})
export class DailyModule {}
