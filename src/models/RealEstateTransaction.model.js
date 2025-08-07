const { DataTypes } = require("sequelize");
const sequelize = require('../config/db');

const RealEstateTransaction = sequelize.define("RealEstateTransaction", {
  transactionId: {
    type: DataTypes.INTEGER,  
    primaryKey: true,
    autoIncrement: true
  },
  purchaseId: {
    type: DataTypes.INTEGER,  
    allowNull: false,
  },
  transactionType: { type: DataTypes.ENUM("buy", "sell"), allowNull: false },
  transactionDate: { type: DataTypes.DATE, allowNull: false },
  transactionAmount: { type: DataTypes.FLOAT, allowNull: false },
},
{
  tableName: 'real_estate_transactions',
  timestamps: false
});

module.exports = RealEstateTransaction;
