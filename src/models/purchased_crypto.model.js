const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Crypto = require('./crypto.model'); // import the Crypto model

const PurchasedCrypto = sequelize.define('PurchasedCrypto', {
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
  crypto_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'purchased_crypto', // custom table name
  timestamps: false              // skip createdAt and updatedAt
});

// Define the association with the Crypto model
PurchasedCrypto.belongsTo(Crypto, {
  foreignKey: 'crypto_id'
});

module.exports = PurchasedCrypto;
