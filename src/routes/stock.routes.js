const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stock.controller');

router.get('/', stockController.getAllStocks);
router.get('/wishlist', stockController.getWishlist);
router.get('/:id', stockController.getStockInfo);

router.post('/buy-stock', stockController.buyStock);
router.post('/sell-stock', stockController.sellStock);

router.get('/analytics/invested-amount', stockController.getInvestedAmount);
router.get('/analytics/current-value', stockController.getCurrentPortfolioValue);

module.exports = router;
