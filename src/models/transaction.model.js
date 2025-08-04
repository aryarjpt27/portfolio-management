const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Transaction = sequelize.define('Transaction', {
  transaction_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  purchased_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  type_of_transaction: {
    type: DataTypes.ENUM('BUY', 'SELL'),
    allowNull: false
  },
  transaction_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2), // match DB type exactly
    allowNull: false
  }
}, {
  tableName: 'transactions',
  timestamps: false
});

module.exports = Transaction;
