const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Stock = sequelize.define('Stock', {
  stock_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  stock_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  stock_sector: {
    type: DataTypes.STRING,
    allowNull: true
  },
  current_price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  is_wishlisted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'stock',   // Match your DB table name
  timestamps: false     // Disable createdAt and updatedAt if not present
});

module.exports = Stock;
