const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stock.controller');

router.get('/', stockController.getAllStocks);
router.post('/', stockController.addStock);
router.get('/:id', stockController.getStockById);
router.delete('/:id', stockController.deleteStock);

module.exports = router;