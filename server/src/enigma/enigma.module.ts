import { Module } from "@nestjs/common";
import { DailyModule } from "../daily/daily.module";
import { EnigmaService } from "./enigma.service";

@Module({
  imports: [DailyModule],
  controllers: [],
  providers: [EnigmaService],
  exports: [EnigmaService],
})
export class EnigmaModule {}
