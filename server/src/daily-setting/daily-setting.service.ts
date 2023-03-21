import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { DailyDto } from "../dto/daily.dto";
import { DailySetting } from "../entities/daily-setting.entity";

@Injectable()
export class DailyService {
  constructor(
    @InjectRepository(DailySetting)
    private dailyRepository: Repository<DailySetting>
  ) {}

  async create(dailyDto: DailyDto): Promise<void> {
    await this.dailyRepository.save(dailyDto);
  }

  async findById(id: number): Promise<DailySetting> {
    const found = await this.dailyRepository.findOneBy({ id });

    if (!found) {
      throw new NotFoundException({
        success: false,
        message: `Can't found by ${id}`,
      });
    }

    return found;
  }

  async delete(id: number): Promise<void> {
    const result = await this.dailyRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException({
        success: false,
        message: `Can't found by ${id}`,
      });
    }
  }
}
