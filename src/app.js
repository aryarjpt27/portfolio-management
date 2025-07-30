const express = require('express');
const stockRoutes = require('./routes/stock.routes');

const app = express();
app.use(express.json());
app.use('/api/stocks', stockRoutes);

module.exports = app;