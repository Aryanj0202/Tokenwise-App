export const formatters = {
  formatNumber: (num) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B';
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  },

  formatCurrency: (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(amount);
  },

  formatTokenAmount: (amount, decimals = 9) => {
    const divisor = Math.pow(10, decimals);
    const normalized = amount / divisor;
    
    if (normalized >= 1000000) {
      return (normalized / 1000000).toFixed(2) + 'M';
    } else if (normalized >= 1000) {
      return (normalized / 1000).toFixed(2) + 'K';
    } else if (normalized >= 1) {
      return normalized.toFixed(2);
    } else {
      return normalized.toFixed(6);
    }
  },

  formatPercentage: (value, decimals = 2) => {
    return `${value.toFixed(decimals)}%`;
  },

  formatAddress: (address, startChars = 4, endChars = 4) => {
    if (!address) return '';
    if (address.length <= startChars + endChars) return address;
    
    return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
  },

  formatTimeAgo: (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMs = now - time;
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) {
      return `${diffInSeconds}s ago`;
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else {
      return time.toLocaleDateString();
    }
  },

  formatDateTime: (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  },

  formatDuration: (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ${hours % 24}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  },

  formatFileSize: (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  },

  formatTransactionType: (type) => {
    switch (type.toLowerCase()) {
      case 'buy':
        return 'Buy';
      case 'sell':
        return 'Sell';
      case 'transfer':
        return 'Transfer';
      case 'swap':
        return 'Swap';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  },

  formatProtocolName: (protocol) => {
    const protocolNames = {
      'jupiter': 'Jupiter',
      'raydium': 'Raydium',
      'orca': 'Orca',
      'serum': 'Serum',
      'saber': 'Saber'
    };
    
    return protocolNames[protocol.toLowerCase()] || protocol;
  },

  formatHash: (hash, length = 8) => {
    if (!hash) return '';
    return `${hash.slice(0, length)}...${hash.slice(-4)}`;
  }
};

export default formatters;
