const sequelize = require('../config/db');
const Stock = require('./stock.model');
const PurchasedStock = require('./purchased_stock.model');
const Transaction = require('./transaction.model');
const RealEstate = require('./realEstate.model');
const PurchasedRealEstate = require('./PurchasedRealEstate.model');
const RealEstateTransaction = require('./RealEstateTransaction.model');

// Define relationships
Stock.hasMany(PurchasedStock, { foreignKey: 'stock_id' });
PurchasedStock.belongsTo(Stock, { foreignKey: 'stock_id' });

PurchasedStock.hasMany(Transaction, { foreignKey: 'purchased_id' });
Transaction.belongsTo(PurchasedStock, { foreignKey: 'purchased_id' });

RealEstate.hasMany(PurchasedRealEstate, { foreignKey: 'realEstateId' });
PurchasedRealEstate.belongsTo(RealEstate, { foreignKey: 'realEstateId' });

PurchasedRealEstate.hasMany(RealEstateTransaction, { foreignKey: 'purchaseId' });
RealEstateTransaction.belongsTo(PurchasedRealEstate, { foreignKey: 'purchaseId' });

const db = {};
db.sequelize = sequelize;
db.Stock = Stock;
db.PurchasedStock = PurchasedStock;
db.Transaction = Transaction;
db.RealEstate = RealEstate;
db.PurchasedRealEstate = PurchasedRealEstate;
db.RealEstateTransaction = RealEstateTransaction;

module.exports = db;
