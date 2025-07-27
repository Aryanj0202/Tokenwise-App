const { DataTypes, Model } = require('sequelize');

class Transaction extends Model {
  static init(sequelize) {
    return super.init({
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
      },
      tokenAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'tokens',
          key: 'address'
        }
      },
      walletAddress: {
        type: DataTypes.STRING,
        allowNull: false
      },
      type: {
        type: DataTypes.ENUM('buy', 'sell', 'transfer', 'swap'),
        allowNull: false
      },
      amount: {
        type: DataTypes.DECIMAL(20, 6),
        allowNull: false
      },
      price: {
        type: DataTypes.DECIMAL(20, 8),
        allowNull: true
      },
      value: {
        type: DataTypes.DECIMAL(20, 6),
        allowNull: true
      },
      protocol: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'Unknown'
      },
      signature: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      slot: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      blockTime: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'failed'),
        defaultValue: 'confirmed'
      },
      fees: {
        type: DataTypes.DECIMAL(20, 6),
        allowNull: true
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      sequelize,
      modelName: 'Transaction',
      tableName: 'transactions',
      timestamps: true,
      indexes: [
        {
          fields: ['tokenAddress']
        },
        {
          fields: ['walletAddress']
        },
        {
          fields: ['type']
        },
        {
          fields: ['protocol']
        },
        {
          fields: ['timestamp']
        },
        {
          fields: ['signature']
        }
      ]
    });
  }
}

module.exports = Transaction;
