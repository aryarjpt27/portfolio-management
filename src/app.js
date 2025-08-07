const express = require('express');
const cors = require('cors');
const stockRoutes = require('./routes/stock.routes');
const cryptoRoutes = require('./routes/crypto.routes');



const app = express();

app.use(cors({
  origin: 'http://localhost:3001',  // frontend origin
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());
app.use('/api/stocks', stockRoutes);

app.use('/api/cryptos', cryptoRoutes);




// 🔥 REMOVE or FIX this line if crashing
// app.options("*", cors()); // ❌ Don't use this directly

module.exports = app;
