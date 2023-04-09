import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RoomDto } from "src/dto/room.dto";
import { RoomEntity } from "src/entities/room.entity";
import { Repository } from "typeorm";

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private roomRepository: Repository<RoomEntity>
  ) {}

  async create(roomDto: RoomDto, user): Promise<void> {
    const { name } = roomDto;
    const room = this.roomRepository.create({
      name,
      participants: user.id,
    });
    await this.roomRepository.save(room);
  }

  async findAll(): Promise<RoomEntity[]> {
    return await this.roomRepository.find();
  }

  async findByName(name: string, user): Promise<RoomEntity[]> {
    return await this.roomRepository
      .createQueryBuilder("rooms")
      .where("rooms.participants LIKE :userId AND rooms.name LIKE :name", {
        userId: user.id,
        name: name,
      })
      .getMany();
  }

  async findById(id: number): Promise<RoomEntity> {
    return await this.roomRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async findByUser(user): Promise<RoomEntity[]> {
    return await this.roomRepository
      .createQueryBuilder("rooms")
      .where("rooms.participants LIKE : userId", { userId: user.id })
      .getMany();
  }

  async update(id: number, user): Promise<void> {
    const room = await this.roomRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!room) {
      throw new NotFoundException(`Room not found.`);
    }

    if (!room.participants.includes(user.id)) {
      room.participants += `, ${user.id}`;
    }

    await this.roomRepository.update(id, room);
  }

  async remove(id: number, user): Promise<void> {
    const room = await this.roomRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!room) {
      throw new NotFoundException(`Room not found.`);
    }

    if (!room.participants.includes(user.id)) {
      throw new UnauthorizedException();
    }
    await this.roomRepository.delete(id);
  }
}
