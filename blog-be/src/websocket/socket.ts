import { Server } from 'socket.io';

export let io: Server;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    const userId = socket.handshake.auth.userId;

    if (userId) {
      socket.join(userId);
    }

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};