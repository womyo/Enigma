import { Module } from "@nestjs/common";
import { DailyModule } from "../daily-setting/daily-setting.module";
import { EnigmaService } from "./enigma.service";
import { EventsGateway } from "./events.gateway";

@Module({
  imports: [DailyModule],
  controllers: [],
  providers: [EnigmaService, EventsGateway],
  exports: [EnigmaService],
})
export class EnigmaModule {}
