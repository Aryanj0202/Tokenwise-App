module.exports = {
  SOLANA: {
    NETWORKS: {
      MAINNET: 'mainnet-beta',
      TESTNET: 'testnet',
      DEVNET: 'devnet'
    },
    RPC_ENDPOINTS: {
      MAINNET: 'https://api.mainnet-beta.solana.com',
      TESTNET: 'https://api.testnet.solana.com',
      DEVNET: 'https://api.devnet.solana.com'
    }
  },

  TRANSACTION_TYPES: {
    BUY: 'buy',
    SELL: 'sell',
    TRANSFER: 'transfer',
    SWAP: 'swap'
  },

  PROTOCOLS: {
    JUPITER: 'Jupiter',
    RAYDIUM: 'Raydium',
    ORCA: 'Orca',
    SERUM: 'Serum',
    SABER: 'Saber'
  },

  TIME_RANGES: {
    ONE_HOUR: '1h',
    TWENTY_FOUR_HOURS: '24h',
    SEVEN_DAYS: '7d',
    THIRTY_DAYS: '30d'
  },

  PAGINATION: {
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 1000
  },

  CACHE_TTL: {
    TOKEN_INFO: 300, // 5 minutes
    WALLET_DATA: 60, // 1 minute
    TRANSACTION_DATA: 30 // 30 seconds
  },

  WEBSOCKET_EVENTS: {
    TRANSACTION: 'transaction',
    WALLET_UPDATE: 'wallet_update',
    MARKET_UPDATE: 'market_update',
    ERROR: 'error'
  }
};
    