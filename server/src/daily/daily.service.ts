import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDailyDto } from './dto/create-daily.dto';
import { Daily } from './entities/daily.entity';

@Injectable()
export class DailyService {
    constructor(
        @InjectRepository(Daily)
        private dailyRepository: Repository<Daily>
    ) {}
    
    async create(createDailyDto: CreateDailyDto): Promise<void> {
        await this.dailyRepository.save(createDailyDto);
    }
    
    async delete(id: number): Promise<void> {
        const result = await this.dailyRepository.delete(id);
        
        console.log('delete success');
        if (result.affected === 0) {
            throw new NotFoundException({ success:false, message: 'ID not exits' });
        }
    }
}