const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Stock = sequelize.define('Stock', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  purchase_price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  current_price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  sector: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: false   // ✅ This disables createdAt and updatedAt
});

module.exports = Stock;
