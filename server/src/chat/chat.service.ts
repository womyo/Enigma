import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChatEntity } from "src/entities/chat.entity";
import { ChatDto } from "src/dto/chat.dto";

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatEntity)
    private chatRepository: Repository<ChatEntity>
  ) {}

  async createMessage(chatDto: ChatDto, user, roomId): Promise<ChatEntity> {
    const { text } = chatDto;
    const chat = this.chatRepository.create({
      text,
      user,
      roomId,
    });
    return await this.chatRepository.save(chat);
  }

  async getMessages(roomId): Promise<ChatEntity[]> {
    return await this.chatRepository.find({
      where: {
        roomId: roomId,
      },
      relations: {
        user: true,
      },
    });
  }
}
