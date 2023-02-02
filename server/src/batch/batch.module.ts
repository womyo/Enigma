import { Module } from '@nestjs/common';
import { DailyModule } from '../daily/daily.module';
import { BatchService } from './batch.service';

@Module({
    imports: [DailyModule],
    controllers: [],
    providers: [BatchService],
    exports: []
  })
  export class BatchModule {}