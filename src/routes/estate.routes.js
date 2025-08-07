const express = require('express');
const router = express.Router();
const controller = require('../controllers/RealEstate.controller');

router.post('/add', controller.addProperty);
router.get('/show', controller.getProperties);
router.get('/transactions', controller.getRealEstateTransactions);
router.post('/buy', controller.buyProperty);
router.post('/sell', controller.sellProperty);
router.get('/analytics/invested-amount-rs', controller.getRealEstateInvestedAmount);
router.get('/analytics/current-portfolio-value-rs', controller.getRealEstateCurrentPortfolioValue);
router.get('/purchased', controller.getBoughtProperties);
router.get('/show/:id', controller.getRealEstateById);

module.exports = router;