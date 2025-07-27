const logger = require('../utils/logger');

class SolanaService {
  constructor() {
    this.isMonitoring = false;
    this.io = null;
  }

  async monitorTransactions(tokenAddress, io) {
    try {
      this.io = io;
      this.isMonitoring = true;
      
      logger.info(`Starting transaction monitoring for token: ${tokenAddress}`);
      this.simulateTransactions(tokenAddress);
      
    } catch (error) {
      logger.error('Error starting transaction monitoring:', error);
      throw error;
    }
  }

  simulateTransactions(tokenAddress) {
    if (!this.isMonitoring) return;

    setInterval(() => {
      if (!this.isMonitoring || !this.io) return;

      const transaction = {
        id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        tokenAddress: tokenAddress,
        walletAddress: `wallet${Math.floor(Math.random() * 60) + 1}`,
        type: Math.random() > 0.5 ? 'buy' : 'sell',
        amount: Math.floor(Math.random() * 100000) + 1000,
        price: Math.random() * 0.1,
        protocol: 'Jupiter',
        signature: `sig_${Math.random().toString(36).substr(2, 16)}`,
        timestamp: new Date(),
        status: 'confirmed'
      };

      this.io.emit('transaction', transaction);
      
    }, 3000);
  }

  stopMonitoring() {
    this.isMonitoring = false;
    logger.info('Transaction monitoring stopped');
  }
}

const solanaService = new SolanaService();

module.exports = {
  solanaService,
  startTokenMonitoring: async (io) => {
    const targetToken = process.env.TARGET_TOKEN || '9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump';
    await solanaService.monitorTransactions(targetToken, io);
  }
};
