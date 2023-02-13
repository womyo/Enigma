import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DailyService } from "./daily.service";
import { Daily } from "./entities/daily.entity";
import { ShuffleService } from "./shuffle.service";

@Module({
  imports: [TypeOrmModule.forFeature([Daily])],
  controllers: [],
  providers: [DailyService, ShuffleService],
  exports: [DailyService, ShuffleService],
})
export class DailyModule {}
