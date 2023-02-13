import { Injectable, Logger } from "@nestjs/common";
import { DailyService } from "../daily/daily.service";
import { serialize } from "class-transformer";
const plugBoard: string[] = [
  "Z",
  "P",
  "H",
  "N",
  "Q",
  "S",
  "W",
  "C",
  "I",
  "Y",
  "T",
  "M",
  "E",
  "D",
  "O",
  "B",
  "L",
  "R",
  "F",
  "K",
  "U",
  "V",
  "G",
  "X",
  "J",
  "A",
];

const reflect = new Map<string, string>([
  ["A", "O"],
  ["B", "K"],
  ["C", "F"],
  ["D", "P"],
  ["E", "G"],
  ["F", "C"],
  ["G", "E"],
  ["H", "X"],
  ["I", "N"],
  ["J", "Y"],
  ["K", "B"],
  ["L", "Q"],
  ["M", "Z"],
  ["N", "I"],
  ["O", "A"],
  ["P", "D"],
  ["Q", "L"],
  ["R", "U"],
  ["S", "V"],
  ["T", "W"],
  ["U", "R"],
  ["V", "S"],
  ["W", "T"],
  ["X", "H"],
  ["Y", "J"],
  ["Z", "M"],
]);
let rotor: string[][] = [
  [
    "B",
    "D",
    "F",
    "H",
    "J",
    "L",
    "N",
    "P",
    "R",
    "T",
    "V",
    "X",
    "Z",
    "A",
    "C",
    "E",
    "G",
    "I",
    "K",
    "M",
    "O",
    "Q",
    "S",
    "U",
    "W",
    "Y",
  ],
  [
    "E",
    "J",
    "O",
    "T",
    "Y",
    "C",
    "H",
    "M",
    "R",
    "W",
    "A",
    "F",
    "K",
    "P",
    "U",
    "Z",
    "D",
    "I",
    "N",
    "S",
    "X",
    "B",
    "G",
    "L",
    "Q",
    "V",
  ],
  [
    "G",
    "N",
    "U",
    "A",
    "H",
    "O",
    "V",
    "B",
    "I",
    "P",
    "W",
    "C",
    "J",
    "Q",
    "X",
    "D",
    "K",
    "R",
    "Y",
    "E",
    "L",
    "S",
    "Z",
    "F",
    "M",
    "T",
  ],
];
@Injectable()
export class EnigmaService {
  constructor(private dailyService: DailyService) {}

  today = this.dailyService.findById(1);

  letterCipher(alphabet: string): string {
    console.log(serialize(this.today));
    let idx: number = alphabet.charCodeAt(0) - "A".charCodeAt(0);
    let plugBoardAlp: string = plugBoard[idx];
    let rotorGoIdx: number = rotor[0].indexOf(plugBoardAlp);
    let encryptedAlp: string = rotor[2][rotorGoIdx];
    let reflectedAlp: string = reflect.get(encryptedAlp);
    let rotorBackIdx: number = rotor[2].indexOf(reflectedAlp);

    encryptedAlp = rotor[0][rotorBackIdx];
    idx = plugBoard.indexOf(encryptedAlp);

    return String.fromCharCode(idx + "A".charCodeAt(0));
  }
  shiftRotor(index: number) {
    const whichRotor = Math.floor(index / 26) % 3;

    rotor[whichRotor].unshift(rotor[whichRotor].pop());
  }
  messageCipher(message: string) {
    let startIdx = 0,
      idx,
      indices = [];
    while ((idx = message.indexOf(" ", startIdx)) > -1) {
      indices.push(idx);
      startIdx = idx + 1;
    }
    let s = message.replace(/\s/g, "");
    let spiltStr = [...s];
    let ans: string = "";

    spiltStr.forEach((element, index) => {
      let c = this.letterCipher(element);
      ans += c;
      this.shiftRotor(index);
    });

    for (let i = 0; i < indices.length; i++) {
      ans = ans.slice(0, indices[i]) + " " + ans.slice(indices[i]);
    }

    return ans;
  }
}
