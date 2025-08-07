const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const RealEstate = sequelize.define("RealEstate", {
  realEstateId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING }, // e.g., Residential, Commercial
  currentValue: { type: DataTypes.FLOAT, allowNull: false },
}, {
    tableName: 'real_estate',   // Match your DB table name
    timestamps: false     // Disable createdAt and updatedAt if not present
});

module.exports = RealEstate;
