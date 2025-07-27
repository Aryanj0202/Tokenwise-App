const logger = require('../utils/logger');

class ProtocolService {
  constructor() {
    this.protocols = {
      'Jupiter': {
        programIds: ['JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB'],
        signatures: ['jupiter', 'jup'],
        weight: 0.35
      },
      'Raydium': {
        programIds: ['675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8'],
        signatures: ['raydium', 'ray'],
        weight: 0.30
      },
      'Orca': {
        programIds: ['whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc'],
        signatures: ['orca', 'whirlpool'],
        weight: 0.25
      },
      'Serum': {
        programIds: ['9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM'],
        signatures: ['serum', 'dex'],
        weight: 0.10
      }
    };
  }

  detectProtocol(transactionData = null) {
    // If no transaction data provided, return random protocol for simulation
    if (!transactionData) {
      return this.getRandomProtocol();
    }

    try {
      // Analyze transaction data to detect protocol
      const { programIds = [], accountKeys = [], instructions = [] } = transactionData;

      for (const [protocolName, protocolInfo] of Object.entries(this.protocols)) {
        // Check if any known program IDs are present
        const hasMatchingProgramId = protocolInfo.programIds.some(pid => 
          programIds.includes(pid)
        );

        if (hasMatchingProgramId) {
          return protocolName;
        }

        // Check instruction data for protocol signatures
        const hasMatchingSignature = instructions.some(instruction => 
          protocolInfo.signatures.some(sig => 
            instruction.data && instruction.data.includes(sig)
          )
        );

        if (hasMatchingSignature) {
          return protocolName;
        }
      }

      // If no specific protocol detected, return most likely based on market share
      return 'Jupiter'; // Default to Jupiter as it's most popular

    } catch (error) {
      logger.error('Error detecting protocol:', error);
      return 'Unknown';
    }
  }

  getRandomProtocol() {
    const protocols = Object.keys(this.protocols);
    const weights = Object.values(this.protocols).map(p => p.weight);
    
    // Weighted random selection
    const random = Math.random();
    let weightSum = 0;
    
    for (let i = 0; i < protocols.length; i++) {
      weightSum += weights[i];
      if (random <= weightSum) {
        return protocols[i];
      }
    }
    
    return protocols[0]; // Fallback
  }

  getProtocolStats(transactions) {
    const stats = {};
    
    transactions.forEach(tx => {
      const protocol = tx.protocol || 'Unknown';
      if (!stats[protocol]) {
        stats[protocol] = {
          count: 0,
          volume: 0,
          avgAmount: 0
        };
      }
      
      stats[protocol].count += 1;
      stats[protocol].volume += tx.amount || 0;
    });

    // Calculate averages
    Object.keys(stats).forEach(protocol => {
      stats[protocol].avgAmount = stats[protocol].count > 0 
        ? stats[protocol].volume / stats[protocol].count 
        : 0;
    });

    return stats;
  }

  getProtocolInfo(protocolName) {
    return this.protocols[protocolName] || null;
  }

  getAllProtocols() {
    return Object.keys(this.protocols);
  }
}

const protocolService = new ProtocolService();

module.exports = protocolService;
