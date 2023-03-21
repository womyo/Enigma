import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { DailyService } from "./daily.service";
import { CreateDailyDto } from "../dto/create-daily.dto";
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
    const createDaily: CreateDailyDto = this.shuffleService.settingDaily();
    this.dailyService.create(createDaily);
    this.logger.debug("Midnight");
  }
}
