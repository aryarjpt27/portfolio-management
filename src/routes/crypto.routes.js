const express = require('express');
const router = express.Router();
const cryptoController = require('../controllers/crypto.controller');

// Get all cryptos
router.get('/', cryptoController.getAllCryptos);

// Get all wishlisted cryptos
router.get('/wishlist', cryptoController.getWishlist);

// Get specific crypto info by ID
router.get('/:id', cryptoController.getCryptoInfo);

// Buy and sell crypto
router.post('/buy-crypto', cryptoController.buyCrypto);
router.post('/sell-crypto', cryptoController.sellCrypto);

// Analytics
router.get('/analytics/invested-amount', cryptoController.getInvestedAmount);
router.get('/analytics/current-value', cryptoController.getCurrentPortfolioValue);

// Purchased cryptos
router.get('/purchased-cryptos/all', cryptoController.getAllPurchasedCryptos);

// Test route
router.get('/hello/abc', cryptoController.hello);

module.exports = router;
