import { Logger } from '@nestjs/common';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {Namespace, Socket} from 'socket.io';

const firstRotor: string[] = ['B','D','F','H','J','L','N','P','R','T','V','X','Z','A','C','E','G','I','K','M','O','Q','S','U','W','Y'];
const secondRotor: string[] = ['E','J','O','T','Y','C','H','M','R','W','A','F','K','P','U','Z','D','I','N','S','X','B','G','L','Q','V'];
const thirdRotor: string[] = ['G','N','U','A','H','O','V','B','I','P','W','C','J','Q','X','D','K','R','Y','E','L','S','Z','F','M','T'];

const plugBoard: string[] = ['Z','P','H','N','Q','S','W','C','I','Y','T','M','E','D','O','B','L','R','F','K','U','V','G','X','J','A'];

const reflect = new Map<string, string>([['A', 'O'], ['B', 'K'], ['C', 'F'], ['D', 'P'], ['E', 'G'], ['F', 'C'], ['G', 'E'], ['H', 'X'], ['I', 'N'], ['J', 'Y'], ['K', 'B'], 
['L', 'Q'], ['M', 'Z'], ['N', 'I'], ['O', 'A'], ['P', 'D'], ['Q', 'L'], ['R', 'U'], ['S', 'V'], ['T', 'W'], ['U', 'R'], ['V', 'S'], ['W', 'T'], ['X', 'H'], ['Y', 'J'], ['Z', 'M']]);

// open socket in 8080 port
@WebSocketGateway({
    namespace: 'chat',
    cors: {
        origin: ['http://localhost:3000']
    },
})

export class EventsGateway 
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer() nsp: Namespace;

    afterInit() {
        this.nsp.adapter.on('create-room', (room) => {
            Logger.log(`"Room:${room}" is created`);
        });

        this.nsp.adapter.on('join-room', (room, id) => {
            Logger.log(`"Socket:${id}" joined the "Room:${room}"`);
        })

        this.nsp.adapter.on('leave-room', (room, id) => {
            Logger.log(`"Socket:${id}" left the "Room:${room}"`)
        })

        this.nsp.adapter.on('delete-room', (roomName) => {
            Logger.log(`"Room:${roomName}" is deleted`)
        })

        Logger.log('init');
    }

    handleConnection(@ConnectedSocket() socket: Socket) {
        Logger.log(`${socket.id} socket connected`);

        socket.broadcast.emit('message', {
            message: `${socket.id} joined room`,
        });
    }

    handleDisconnect(@ConnectedSocket() socket: Socket) {
        Logger.log(`${socket.id} socket disconnected`);
    }

    @SubscribeMessage('message')
    handleMessage(
        @ConnectedSocket() socket: Socket,
        @MessageBody() message: string, // what i typed

        ) {
            let spiltStr = [...message];

            let alp: string = spiltStr[0];
            console.log(alp);

            let idx: number = alp.charCodeAt(0) - 'A'.charCodeAt(0);
            console.log(plugBoard[idx]);

            let plugBoardAlp: string = plugBoard[idx];

            let rotorGoIdx: number = firstRotor.indexOf(plugBoardAlp);

            console.log(firstRotor[rotorGoIdx]);
            console.log(secondRotor[rotorGoIdx])
            console.log(thirdRotor[rotorGoIdx])

            let refle: string = reflect.get(thirdRotor[rotorGoIdx]);
            console.log(refle);

            let rotorBackIdx: number = thirdRotor.indexOf(refle);

            console.log(thirdRotor[rotorBackIdx])
            console.log(secondRotor[rotorBackIdx])
            console.log(firstRotor[rotorBackIdx])

            let iddx: number = plugBoard.indexOf(firstRotor[rotorBackIdx]);

            console.log(String.fromCharCode(iddx + 'A'.charCodeAt(0)));


            socket.broadcast.emit('message', { username: socket.id, message: message}); // showing in others interface
            return { username: socket.id, message: message }; // showing in my interface
    }
}