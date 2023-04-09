import { Module } from "@nestjs/common";
import { RoomService } from "./room.service";
import { RoomController } from "./room.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoomEntity } from "src/entities/room.entity";

@Module({
  imports: [TypeOrmModule.forFeature([RoomEntity])],
  providers: [RoomService],
  controllers: [RoomController],
})
export class RoomModule {}
