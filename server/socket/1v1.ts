import { Server } from 'socket.io';
import { QuoteLengthType, OneVersusOneStateType } from './types';

export function startSocketOneVersusOne(server: any) {

  const io = new Server(server);

  const clientRooms: { [key: string]: string } = {};
  const roomState: { [key: string]: OneVersusOneStateType } = {};

  const io1v1 = io.of('/1v1');

  io1v1.on('connection', (socket) => {
    console.log('New Connection: ', socket.id);

    socket.on('create-room', (quoteLength: QuoteLengthType) => {
      const roomCode = generateCode(6);

      clientRooms[socket.id] = roomCode;
      roomState[roomCode] = {
        players: { player1: { id: socket.id, wordIndex: 0, charIndex: 0 } },
        quoteLength: quoteLength,
      };

      socket.join(roomCode);
      socket.emit('has-joined-room', roomCode);
      io1v1.to(roomCode).emit('room-state', roomState[roomCode]);
    });
});
}