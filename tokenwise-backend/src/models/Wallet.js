const { DataTypes, Model } = require('sequelize');

class Wallet extends Model {
  static init(sequelize) {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [32, 44]
        }
      },
      tokenAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'tokens',
          key: 'address'
        }
      },
      tokenAccount: {
        type: DataTypes.STRING,
        allowNull: true
      },
      balance: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
      },
      uiAmount: {
        type: DataTypes.DECIMAL(20, 6),
        allowNull: true
      },
      decimals: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 9
      },
      percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        defaultValue: 0
      },
      rank: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      transactionCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      lastActivity: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    }, {
      sequelize,
      modelName: 'Wallet',
      tableName: 'wallets',
      timestamps: true,
      indexes: [
        {
          fields: ['address']
        },
        {
          fields: ['tokenAddress']
        },
        {
          fields: ['balance']
        },
        {
          fields: ['rank']
        },
        {
          unique: true,
          fields: ['address', 'tokenAddress']
        }
      ]
    });
  }
}

module.exports = Wallet;
