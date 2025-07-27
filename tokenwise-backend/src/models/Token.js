const { DataTypes, Model } = require('sequelize');

class Token extends Model {
  static init(sequelize) {
    return super.init({
      address: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        validate: {
          len: [32, 44]
        }
      },
      symbol: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'UNKNOWN'
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Unknown Token'
      },
      decimals: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 9,
        validate: {
          min: 0,
          max: 18
        }
      },
      supply: {
        type: DataTypes.STRING,
        allowNull: true
      },
      uiAmount: {
        type: DataTypes.DECIMAL(20, 6),
        allowNull: true
      },
      logoURI: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl: true
        }
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      lastUpdated: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      sequelize,
      modelName: 'Token',
      tableName: 'tokens',
      timestamps: true,
      indexes: [
        {
          fields: ['symbol']
        },
        {
          fields: ['isActive']
        }
      ]
    });
  }
}

module.exports = Token;

