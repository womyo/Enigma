import { IsString, IsNumber } from "class-validator";

export class DailyDto {
  @IsNumber()
  id: number;

  @IsString()
  plugboard: string;

  @IsString()
  rotor: string;

  @IsString()
  reflector: string;
}
