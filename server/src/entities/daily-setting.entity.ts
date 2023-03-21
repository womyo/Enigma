import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("daily_setting")
export class DailySetting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  plugboard: string;

  @Column("longtext")
  rotor: string;

  @Column("longtext")
  reflector: string;
}
