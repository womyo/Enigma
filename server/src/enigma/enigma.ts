const plugBoard: string[] = ['Z','P','H','N','Q','S','W','C','I','Y','T','M','E','D','O','B','L','R','F','K','U','V','G','X','J','A'];

const reflect = new Map<string, string>([['A', 'O'], ['B', 'K'], ['C', 'F'], ['D', 'P'], ['E', 'G'], ['F', 'C'], ['G', 'E'], ['H', 'X'], ['I', 'N'], ['J', 'Y'], ['K', 'B'], 
['L', 'Q'], ['M', 'Z'], ['N', 'I'], ['O', 'A'], ['P', 'D'], ['Q', 'L'], ['R', 'U'], ['S', 'V'], ['T', 'W'], ['U', 'R'], ['V', 'S'], ['W', 'T'], ['X', 'H'], ['Y', 'J'], ['Z', 'M']]);

export class Enigma {
    rotor: string[][];
    constructor(rotor: string[][]) {
        this.rotor = rotor;
    }

    letterCipher(alphabet: string): string {
        let idx: number = alphabet.charCodeAt(0) - 'A'.charCodeAt(0);
        let plugBoardAlp: string = plugBoard[idx];
        // console.log(plugBoard[idx]);
        let rotorGoIdx: number = this.rotor[0].indexOf(plugBoardAlp);
        // console.log(rotor[0][rotorGoIdx]);
        // console.log(rotor[1][rotorGoIdx])
        // console.log(rotor[2][rotorGoIdx])

        let encrypting: string = this.rotor[2][rotorGoIdx];

        let refle: string = reflect.get(encrypting);
        // console.log(refle);
        let rotorBackIdx: number = this.rotor[2].indexOf(refle);
        // console.log(rotor[2][rotorBackIdx])
        // console.log(rotor[1][rotorBackIdx])
        // console.log(rotor[0][rotorBackIdx])
        encrypting = this.rotor[0][rotorBackIdx];

        let iddx: number = plugBoard.indexOf(encrypting);

        return String.fromCharCode(iddx + 'A'.charCodeAt(0))
    }
    shiftRotor(index: number) {
        let whichOne = Math.floor(index / 26) % 3

        let tmp: string = this.rotor[whichOne].pop();
        this.rotor[whichOne].unshift(tmp);
    }
    messageCipher(message: string) {
        let startIndex = 0, index, indices =[];
        while ((index = message.indexOf(' ', startIndex)) > -1) {
            indices.push(index);
            startIndex = index + 1;
        }
        let s = message.replace(/\s/g, "");
        let spiltStr = [...s];
        let ans: string = '';
        
        spiltStr.forEach((element, index) => {
            let c = this.letterCipher(element);
            ans += c;
            this.shiftRotor(index);
        });

        for (let i=0; i<indices.length; i++) {
            ans = ans.slice(0,indices[i]) + ' ' + ans.slice(indices[i]);
        }

        return ans;
    }
}