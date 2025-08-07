const { DataTypes } = require("sequelize");
const sequelize = require('../config/db');

const PurchasedRealEstate = sequelize.define("PurchasedRealEstate", {
  purchaseId: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  realEstateId: { type: DataTypes.INTEGER, allowNull: false},
  purchaseDate: { type: DataTypes.DATE, allowNull: false },
  purchasePrice: { type: DataTypes.FLOAT, allowNull: false },
},
{
  tableName: 'purchased_real_estate', // Match your DB table name
  timestamps: false
});

module.exports = PurchasedRealEstate;
