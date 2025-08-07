const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Crypto = sequelize.define('Crypto', {
  crypto_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  crypto_name: {
    type: DataTypes.STRING,
    allowNull: false
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
  tableName: 'crypto',   // Match your DB table name
  timestamps: false      // Disable createdAt and updatedAt if not present
});

module.exports = Crypto;
