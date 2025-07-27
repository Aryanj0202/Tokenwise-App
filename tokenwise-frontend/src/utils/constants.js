export const SOLANA_CONSTANTS = {
  NETWORK: {
    MAINNET: 'mainnet-beta',
    TESTNET: 'testnet',
    DEVNET: 'devnet'
  },
  
  RPC_ENDPOINTS: {
    MAINNET: 'https://api.mainnet-beta.solana.com',
    TESTNET: 'https://api.testnet.solana.com',
    DEVNET: 'https://api.devnet.solana.com'
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

  PROTOCOL_COLORS: {
    Jupiter: '#fdb462',
    Raydium: '#80b3ff',
    Orca: '#ff8080',
    Serum: '#b3b3ff',
    Saber: '#ffb366'
  },

  TIME_RANGES: {
    ONE_HOUR: '1h',
    TWENTY_FOUR_HOURS: '24h',
    SEVEN_DAYS: '7d',
    THIRTY_DAYS: '30d'
  },

  WEBSOCKET_EVENTS: {
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    MESSAGE: 'message',
    ERROR: 'error',
    RECONNECTING: 'reconnecting',
    TRANSACTION: 'transaction',
    WALLET_UPDATE: 'wallet_update'
  },

  API_ENDPOINTS: {
    TOKEN_INFO: '/tokens/{address}',
    TOP_WALLETS: '/tokens/{address}/holders',
    TRANSACTIONS: '/tokens/{address}/transactions',
    WALLET_TRANSACTIONS: '/wallets/{address}/transactions',
    PROTOCOL_STATS: '/tokens/{address}/protocol-stats',
    MARKET_DATA: '/tokens/{address}/market-data',
    HISTORICAL_DATA: '/tokens/{address}/historical',
    EXPORT: '/tokens/{address}/export'
  },

  PAGINATION: {
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100
  },

  WALLET_LIMITS: {
    TOP_WALLETS: 60,
    DISPLAY_WALLETS: 20
  },

  CHART_COLORS: {
    PRIMARY: '#3b82f6',
    SECONDARY: '#8b5cf6',
    SUCCESS: '#10b981',
    WARNING: '#f59e0b',
    DANGER: '#ef4444',
    INFO: '#06b6d4',
    GRAY: '#6b7280'
  },

  DECIMAL_PLACES: {
    TOKEN_AMOUNT: 6,
    PERCENTAGE: 2,
    PRICE: 8
  }
};

export const UI_CONSTANTS = {
  THEME: {
    LIGHT: 'light',
    DARK: 'dark'
  },

  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    XXL: 1536
  },

  ANIMATION_DURATIONS: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500
  },

  Z_INDEX: {
    DROPDOWN: 1000,
    STICKY: 1020,
    FIXED: 1030,
    MODAL_BACKDROP: 1040,
    MODAL: 1050,
    POPOVER: 1060,
    TOOLTIP: 1070,
    TOAST: 1080
  }
};

export const VALIDATION_RULES = {
  WALLET_ADDRESS: {
    MIN_LENGTH: 32,
    MAX_LENGTH: 44,
    PATTERN: /^[1-9A-HJ-NP-Za-km-z]+$/
  },
  
  TOKEN_ADDRESS: {
    MIN_LENGTH: 32,
    MAX_LENGTH: 44,
    PATTERN: /^[1-9A-HJ-NP-Za-km-z]+$/
  },

  SEARCH_QUERY: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 100
  }
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error occurred. Please try again.',
  INVALID_ADDRESS: 'Invalid wallet or token address.',
  NO_DATA: 'No data available for the selected time range.',
  WEBSOCKET_ERROR: 'Real-time connection failed. Retrying...',
  EXPORT_ERROR: 'Failed to export data. Please try again.'
};

export const SUCCESS_MESSAGES = {
  EXPORT_SUCCESS: 'Data exported successfully!',
  COPY_SUCCESS: 'Copied to clipboard!',
  CONNECTION_SUCCESS: 'Connected to real-time updates.'
};

export const DEFAULT_TOKEN = {
  ADDRESS: '9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump',
  SYMBOL: 'TOKEN',
  NAME: 'Token Name',
  DECIMALS: 9,
  SUPPLY: 1000000000
};

export const MOCK_DATA = {
  ENABLE_MOCK: process.env.NODE_ENV === 'development',
  TRANSACTION_INTERVAL: 2000, // ms
  WALLET_COUNT: 60,
  TRANSACTION_COUNT: 100
};

export default {
  SOLANA_CONSTANTS,
  UI_CONSTANTS,
  VALIDATION_RULES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  DEFAULT_TOKEN,
  MOCK_DATA
};
