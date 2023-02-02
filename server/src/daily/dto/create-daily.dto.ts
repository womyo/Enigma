import { IsString, IsOptional, IsNumber } from "class-validator"

export class CreateDailyDto {
    @IsNumber()
    id: number;

    @IsString()
    plugboard: string;

    @IsString()
    rotor: string;

    @IsString()
    reflector: string;
}