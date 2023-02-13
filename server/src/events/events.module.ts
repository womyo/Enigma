import { Module } from "@nestjs/common";
import { EnigmaModule } from "src/enigma/enigma.module";
import { EventsGateway } from "./events.gateway";

@Module({
  imports: [EnigmaModule],
  providers: [EventsGateway],
})
export class EventsModule {}
