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
        @MessageBody() message: string,
        ) {
            socket.broadcast.emit('message', { username: socket.id, message });
            return { username: socket.id, message };
    }
}