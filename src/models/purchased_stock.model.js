const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PurchasedStock = sequelize.define('PurchasedStock', {
  purchased_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  purchase_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  purchase_price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  stock_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'purchased_stock', // This ensures Sequelize uses your exact table name
  timestamps: false             // Skip createdAt/updatedAt if not in table
});

module.exports = PurchasedStock;
