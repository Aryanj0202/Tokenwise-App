require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const { initializeDatabase } = require('./config/database');
const { initializeWebSocket } = require('./services/websocketService');
const { startTokenMonitoring } = require('./services/solanaService');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// Import routes
const tokenRoutes = require('./routes/tokens');
const walletRoutes = require('./routes/wallets');
const exportRoutes = require('./routes/export');

const app = express();
const server = http.createServer(app);

// Initialize WebSocket
const io = initializeWebSocket(server);

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Logging
app.use(morgan('combined', {
  stream: { write: message => logger.info(message.trim()) }
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/tokens', tokenRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/export', exportRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Error handling middleware
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

// Initialize and start server
async function startServer() {
  try {
    // Initialize database
    await initializeDatabase();
    logger.info('Database initialized successfully');

    // Start token monitoring
    await startTokenMonitoring(io);
    logger.info('Token monitoring started');

    // Start server
    const PORT = process.env.PORT || 3001;
    server.listen(PORT, () => {
      logger.info(`TokenWise Backend running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the application
startServer();

module.exports = app;
