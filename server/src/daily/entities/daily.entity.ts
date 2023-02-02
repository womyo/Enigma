import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity() 
export class Daily {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    plugboard: string;
    
    @Column('longtext')
    rotor: string;

    @Column('longtext') 
    reflector: string;
}