const express = require('express');
const stockRoutes = require('./routes/stock.routes');
const estateRoutes = require('./routes/estate.routes');
const app = express();
app.use(express.json());
app.use('/api/stocks', stockRoutes);
app.use('/api/estates', estateRoutes);
module.exports = app;