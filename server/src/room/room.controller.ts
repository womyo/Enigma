import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Param,
  Patch,
  Delete,
} from "@nestjs/common";
import * as Path from "path";
import { RoomService } from "./room.service";
import { JwtAuthGuard } from "src/core/guards/jwt-auth.guard";
import { User } from "src/common/decorators/user.decorator";
import { RoomDto } from "src/dto/room.dto";

@Controller(Path.join("api", "v1", "room"))
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createRoom(@Body() roomDto: RoomDto, @User() user) {
    return await this.roomService.create(roomDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async readRoomsIncludeUser(@User() user) {
    return await this.roomService.findByUser(user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async readRoomByName(@Param() params: { name: string }, @User() user) {
    return await this.roomService.findByName(params.name, user);
  }

  @Patch("/:id")
  @UseGuards(JwtAuthGuard)
  async updateRoom(@Param() params: { id: number }, @User() user) {
    return await this.roomService.update(params.id, user);
  }

  @Delete("/:id")
  @UseGuards(JwtAuthGuard)
  async deleteBoard(@Param() params: { id: number }, @User() user) {
    await this.roomService.remove(params.id, user);
  }
}
