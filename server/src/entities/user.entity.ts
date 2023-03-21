import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";
import { Exclude } from "class-transformer";
import { ChatEntity } from "./chat.entity";

@Entity("user")
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  // 유저 객체 리턴 시 제외
  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  // 유저 객체 리턴 시 제외
  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  refreshToken: string;

  @OneToMany(() => ChatEntity, (chat) => chat.user)
  chat: ChatEntity[];
}
