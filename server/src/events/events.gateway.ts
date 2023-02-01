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
import { Enigma } from 'src/enigma/enigma';

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
            let rotor: string[][] = [['B','D','F','H','J','L','N','P','R','T','V','X','Z','A','C','E','G','I','K','M','O','Q','S','U','W','Y'],
        ['E','J','O','T','Y','C','H','M','R','W','A','F','K','P','U','Z','D','I','N','S','X','B','G','L','Q','V'],
        ['G','N','U','A','H','O','V','B','I','P','W','C','J','Q','X','D','K','R','Y','E','L','S','Z','F','M','T']];
            const enigma = new Enigma(rotor);

            let ans: string = enigma.messageCipher(message);

            socket.broadcast.emit('message', { username: socket.id, message: ans}); // showing in others interface
            return { username: socket.id, message: message }; // showing in my interface
    }
}