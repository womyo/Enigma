import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateDailyDto } from "./dto/create-daily.dto";
import { Daily } from "./entities/daily.entity";

@Injectable()
export class DailyService {
  constructor(
    @InjectRepository(Daily)
    private dailyRepository: Repository<Daily>
  ) {}

  async create(createDailyDto: CreateDailyDto): Promise<void> {
    await this.dailyRepository.save(createDailyDto);
  }

  async findById(id: number): Promise<Daily> {
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
