// backend/src/socket.js
import { Server } from 'socket.io';

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Join user room
    const userId = socket.handshake.query.userId;
    if (userId) {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    }

    // Handle typing events
    socket.on('typing', (data) => {
      const { receiverId, isTyping } = data;
      io.to(receiverId).emit('user_typing', {
        userId: userId,
        isTyping
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};