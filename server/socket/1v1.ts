import { Server } from 'socket.io';
import { QuoteLengthType, OneVersusOneStateType } from './types.ts';
import { generateCode, fetchQuote, startCountdown } from './helper.ts';

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


socket.on('join-room', (roomCode: string) => {
  if (!roomState.hasOwnProperty(roomCode)) {
    socket.emit('join-room-error');
    return;
  }

  clientRooms[socket.id] = roomCode;
  roomState[roomCode].players.player2 = {
    id: socket.id,
    wordIndex: 0,
    charIndex: 0,
  };
  socket.join(roomCode);
  socket.emit('has-joined-room', roomCode);

  fetchQuote(roomState[roomCode].quoteLength)
    .then((quote: string) => {
      roomState[roomCode].testText = quote;
      io1v1.to(roomCode).emit('test-text', quote);
    })
    .then(() => {
      startCountdown(roomCode, io1v1);
    });

  io1v1.to(roomCode).emit('room-state', roomState[roomCode]);
});

socket.on(
  'cursur-position-change',
  ({ wordIndex, charIndex }: { wordIndex: number; charIndex: number }) => {
    const roomCode = clientRooms[socket.id];

    if (!roomCode || !roomState[roomCode]) {
      return;
    }

    const player =
      roomState[roomCode].players.player1.id === socket.id
        ? 'player1'
        : 'player2';

    roomState[roomCode].players[player] = {
      id: roomState[roomCode].players[player]!.id,
      wordIndex,
      charIndex,
    };

    socket.broadcast
      .to(roomCode)
      .emit('cursur-position-change', { player, wordIndex, charIndex });
  }
);

socket.on('result', (result) => {
  const roomCode = clientRooms[socket.id];

  if (!roomCode || !roomState.hasOwnProperty(roomCode)) {
    console.error("room doesn't exist");
    return;
  }

  const player =
    roomState[roomCode].players.player1.id === socket.id ? 'player1' : 'player2';

  const opponentPlayer = player === 'player1' ? 'player2' : 'player1';

  if (roomState[roomCode].players[player]) {
    roomState[roomCode].players[player]!.result = result;

    const typedWords = roomState[roomCode].testText?.split(' ')!;
    io1v1.to(roomCode).emit('caret-position-change', {
      player,
      wordIndex: typedWords.length - 1,
      charIndex: typedWords[typedWords.length - 1].length,
    });
  }

  if (roomState[roomCode].players[opponentPlayer]?.result) {
    io1v1.to(roomCode).emit('players-state', roomState[roomCode].players);
  }
});

});
}