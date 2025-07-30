const sequelize = require('../config/db');
const Stock = require('./stock.model');

const db = {};
db.sequelize = sequelize;
db.Stock = Stock;

module.exports = db;