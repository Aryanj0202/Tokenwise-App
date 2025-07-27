const socketIo = require('socket.io');
const logger = require('../utils/logger');

class WebSocketService {
  constructor() {
    this.io = null;
    this.connections = new Map();
  }

  initialize(server) {
    this.io = socketIo(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    });

    this.setupEventHandlers();
    return this.io;
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      logger.info(`Client connected: ${socket.id}`);
      this.connections.set(socket.id, {
        socket: socket,
        connectedAt: new Date(),
        subscriptions: []
      });

      socket.on('disconnect', (reason) => {
        logger.info(`Client disconnected: ${socket.id}, reason: ${reason}`);
        this.connections.delete(socket.id);
      });

      socket.emit('connect_success', {
        message: 'Connected to TokenWise WebSocket',
        timestamp: new Date().toISOString()
      });
    });
  }

  broadcastTransaction(transaction) {
    if (this.io) {
      this.io.emit('transaction', transaction);
    }
  }
}

const websocketService = new WebSocketService();

module.exports = {
  websocketService,
  initializeWebSocket: (server) => {
    return websocketService.initialize(server);
  }
};
