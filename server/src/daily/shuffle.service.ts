import { Injectable, Logger } from "@nestjs/common";
import { CreateDailyDto } from "./dto/create-daily.dto";

@Injectable()
export class ShuffleService {
    constructor() {}

    shuffleArray(): string[] {
        let arr = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

        for (let i=arr.length-1; i>0; i--) {
            const j = Math.floor(Math.random() * (i+1));
            const tmp = arr[i];
            arr[i] = arr[j];
            arr[j] = tmp;
        }
        return arr;
    }
    shuffleMap() {
        const shuffledArray: string[] = this.shuffleArray();
        const half: number = Math.floor(shuffledArray.length/2);
        let reflect = new Map<string, string>([]);

        for (let i=0; i<half; i++) {
            reflect.set(shuffledArray[i], shuffledArray[i+half]);
            reflect.set(shuffledArray[i+half], shuffledArray[i]);
        }
        return reflect
    }
    settingDaily(): CreateDailyDto {
        const plugboard = JSON.stringify(this.shuffleArray());
        const reflector = JSON.stringify(Array.from(this.shuffleMap().entries()));
        let rotor: string | string[][] = [];

        for (let i=0; i<3; i++) {
            rotor.push(this.shuffleArray());
        }
        rotor = JSON.stringify(rotor);
        const createDaily: CreateDailyDto = {id: 1, plugboard: plugboard, rotor: rotor, reflector: reflector};

        return createDaily;
    }
}