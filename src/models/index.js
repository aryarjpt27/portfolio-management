const sequelize = require('../config/db');
const Stock = require('./stock.model');
const PurchasedStock = require('./purchased_stock.model');
const Transaction = require('./transaction.model');

// Define relationships
Stock.hasMany(PurchasedStock, { foreignKey: 'stock_id' });
PurchasedStock.belongsTo(Stock, { foreignKey: 'stock_id' });

PurchasedStock.hasMany(Transaction, { foreignKey: 'purchased_id' });
Transaction.belongsTo(PurchasedStock, { foreignKey: 'purchased_id' });

const db = {};
db.sequelize = sequelize;
db.Stock = Stock;
db.PurchasedStock = PurchasedStock;
db.Transaction = Transaction;

module.exports = db;
