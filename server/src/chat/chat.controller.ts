import {
  Controller,
  Get,
  Res,
  UseGuards,
  Post,
  Body,
  Param,
} from "@nestjs/common";
import { User } from "src/common/decorators/user.decorator";
import { JwtAuthGuard } from "src/core/guards/jwt-auth.guard";
import { ChatService } from "./chat.service";
import { ChatDto } from "src/dto/chat.dto";
import * as Path from "path";

@Controller(Path.join("api", "v1", "chat"))
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async addChat(
    @Param() params: { roomId: string },
    @Body() chatDto: ChatDto,
    @User() user
  ) {
    return await this.chatService.createMessage(chatDto, user, params.roomId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async chat(@Res() res, @Param() params: { roomId: string }) {
    const messages = await this.chatService.getMessages(params.roomId);
    res.json(messages);
  }
}
