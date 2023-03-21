import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { DailyService } from "./daily-setting.service";
import { DailyDto } from "../dto/daily.dto";
import { ShuffleService } from "./shuffle.service";

@Injectable()
export class BatchService {
  private readonly logger = new Logger(BatchService.name);
  // JSON.parse
  constructor(
    private dailyService: DailyService,
    private shuffleService: ShuffleService
  ) {}

  @Cron("0 0 0 * * *")
  handleCron() {
    const dailyDto: DailyDto = this.shuffleService.settingDaily();
    this.dailyService.create(dailyDto);
    this.logger.debug("Midnight");
  }
}
