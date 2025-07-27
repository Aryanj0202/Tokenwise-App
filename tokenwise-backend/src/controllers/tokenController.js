const { models } = require('../config/database');
const logger = require('../utils/logger');

class TokenController {
  async getTokenInfo(req, res) {
    try {
      const { address } = req.params;
      
      // Create demo token info
      const tokenInfo = {
        address: address,
        symbol: 'TOKEN',
        name: 'Demo Token',
        decimals: 9,
        supply: '1000000000000000000',
        uiAmount: 1000000000,
        isActive: true,
        lastUpdated: new Date()
      };
      
      res.json({
        success: true,
        data: tokenInfo
      });
      
    } catch (error) {
      logger.error('Error getting token info:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch token information'
      });
    }
  }

  async getTopWallets(req, res) {
    try {
      const { address } = req.params;
      const { limit = 60 } = req.query;
      
      // Generate mock wallet data
      const mockWallets = Array.from({ length: parseInt(limit) }, (_, i) => ({
        id: i + 1,
        address: `wallet${i + 1}_${Math.random().toString(36).substr(2, 8)}`,
        tokenAddress: address,
        balance: Math.floor(Math.random() * 1000000) + 10000,
        uiAmount: Math.floor(Math.random() * 1000000) + 10000,
        percentage: Math.random() * 10,
        rank: i + 1,
        transactionCount: Math.floor(Math.random() * 100),
        lastActivity: new Date()
      }));
      
      res.json({
        success: true,
        data: mockWallets,
        count: mockWallets.length
      });
      
    } catch (error) {
      logger.error('Error getting top wallets:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch top wallets'
      });
    }
  }

  async getTransactions(req, res) {
    try {
      const { address } = req.params;
      const { limit = 100, offset = 0 } = req.query;
      
      // Generate mock transaction data
      const mockTransactions = Array.from({ length: 20 }, (_, i) => ({
        id: `tx_${Date.now()}_${i}`,
        tokenAddress: address,
        walletAddress: `wallet${Math.floor(Math.random() * 60) + 1}`,
        type: Math.random() > 0.5 ? 'buy' : 'sell',
        amount: Math.floor(Math.random() * 100000) + 1000,
        price: Math.random() * 0.1,
        protocol: ['Jupiter', 'Raydium', 'Orca'][Math.floor(Math.random() * 3)],
        signature: `sig_${Math.random().toString(36).substr(2, 16)}`,
        timestamp: new Date(Date.now() - Math.random() * 86400000),
        status: 'confirmed'
      }));
      
      res.json({
        success: true,
        data: mockTransactions,
        count: mockTransactions.length
      });
      
    } catch (error) {
      logger.error('Error getting transactions:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch transactions'
      });
    }
  }

  async getProtocolStats(req, res) {
    try {
      const mockStats = {
        Jupiter: { count: 45, volume: 2500000, avgAmount: 55555 },
        Raydium: { count: 32, volume: 1800000, avgAmount: 56250 },
        Orca: { count: 23, volume: 1200000, avgAmount: 52174 }
      };
      
      res.json({
        success: true,
        data: mockStats,
        timeRange: req.query.timeRange || '24h'
      });
      
    } catch (error) {
      logger.error('Error getting protocol stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch protocol statistics'
      });
    }
  }

  async getHistoricalData(req, res) {
    try {
      // Generate mock historical data
      const mockData = Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000),
        buyCount: Math.floor(Math.random() * 20),
        sellCount: Math.floor(Math.random() * 15),
        totalVolume: Math.floor(Math.random() * 500000),
        avgPrice: Math.random() * 0.1
      }));
      
      res.json({
        success: true,
        data: mockData,
        timeRange: req.query.timeRange || '24h'
      });
      
    } catch (error) {
      logger.error('Error getting historical data:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch historical data'
      });
    }
  }
}

const tokenController = new TokenController();
module.exports = { tokenController };
