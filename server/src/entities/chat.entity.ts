import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { UserEntity } from "./user.entity";

@Entity("chat")
export class ChatEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  text: string;

  @ManyToOne(() => UserEntity, (user) => user.chat)
  user: UserEntity;

  @Column()
  roomId: string;

  @CreateDateColumn()
  createdAt: Date;
}
