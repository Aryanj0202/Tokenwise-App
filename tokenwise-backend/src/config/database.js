const { Sequelize } = require('sequelize');
const path = require('path');
const logger = require('../utils/logger');

// Database configuration
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database/tokenwise.db'),
  logging: (msg) => logger.debug(msg),
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Import models
const Token = require('../models/Token');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');

// Initialize models
Token.init(sequelize);
Wallet.init(sequelize);
Transaction.init(sequelize);

// Define associations
Token.hasMany(Wallet, { foreignKey: 'tokenAddress', as: 'wallets' });
Token.hasMany(Transaction, { foreignKey: 'tokenAddress', as: 'transactions' });
Wallet.hasMany(Transaction, { foreignKey: 'walletAddress', as: 'transactions' });
Wallet.belongsTo(Token, { foreignKey: 'tokenAddress', as: 'token' });
Transaction.belongsTo(Token, { foreignKey: 'tokenAddress', as: 'token' });
Transaction.belongsTo(Wallet, { foreignKey: 'walletAddress', as: 'wallet' });

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully');
    
    // Sync models (create tables if they don't exist)
    await sequelize.sync({ alter: true });
    logger.info('Database models synchronized');
    
    return sequelize;
  } catch (error) {
    logger.error('Unable to connect to database:', error);
    throw error;
  }
}

module.exports = {
  sequelize,
  initializeDatabase,
  models: {
    Token,
    Wallet,
    Transaction
  }
};
