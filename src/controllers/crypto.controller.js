const Crypto = require('../models/crypto.model');
const PurchasedCrypto = require('../models/purchased_crypto.model');
const Transaction = require('../models/transaction.model');
const { Op } = require('sequelize');

// 1. List all cryptos
exports.getAllCryptos = async (req, res) => {
  try {
    const cryptos = await Crypto.findAll();
    res.json(cryptos);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cryptos', error: err.message });
  }
};

// 2. List wishlisted cryptos
exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Crypto.findAll({ where: { is_wishlisted: true } });
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching wishlist', error: err.message });
  }
};

// 3. Buy crypto
exports.buyCrypto = async (req, res) => {
  try {
    const { crypto_id, purchase_date, purchase_price, quantity } = req.body;

    const crypto = await Crypto.findByPk(crypto_id);
    if (!crypto) return res.status(404).json({ message: 'Crypto not found' });

    const purchase = await PurchasedCrypto.create({
      crypto_id,
      purchase_date,
      purchase_price,
      quantity
    });

    await Transaction.create({
      type_of_transaction: 'BUY',
      transaction_date: purchase_date,
      quantity,
      amount: purchase_price * quantity,
      purchased_id: purchase.purchased_id
    });

    res.status(201).json({ message: 'Crypto purchased', purchase });
  } catch (error) {
    res.status(500).json({ message: 'Error buying crypto', error: error.message });
  }
};

// 4. Sell crypto
exports.sellCrypto = async (req, res) => {
  try {
    const { crypto_id, quantity, transaction_date, sell_price } = req.body;

    let remaining = quantity;
    const purchases = await PurchasedCrypto.findAll({
      where: { crypto_id },
      order: [['purchase_date', 'ASC']]
    });

    const soldTransactions = [];

    for (const purchase of purchases) {
      if (remaining <= 0) break;

      const sellQty = Math.min(purchase.quantity, remaining);

      await Transaction.create({
        type_of_transaction: 'SELL',
        transaction_date,
        quantity: sellQty,
        amount: sell_price * sellQty,
        purchased_id: -1  // or purchase.purchased_id if needed
      });

      if (sellQty === purchase.quantity) {
        await purchase.destroy();
      } else {
        await purchase.update({ quantity: purchase.quantity - sellQty });
      }

      soldTransactions.push({ purchase_id: purchase.purchased_id, sold: sellQty });
      remaining -= sellQty;
    }

    if (remaining > 0) {
      return res.status(400).json({ message: 'Not enough crypto to sell' });
    }

    res.json({ message: 'Crypto sold', soldTransactions });
  } catch (error) {
    res.status(500).json({ message: 'Error selling crypto', error: error.message });
  }
};

// 5. Get specific crypto info
exports.getCryptoInfo = async (req, res) => {
  try {
    const crypto = await Crypto.findByPk(req.params.id);
    if (!crypto) return res.status(404).json({ message: 'Crypto not found' });
    res.json(crypto);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching crypto info', error: err.message });
  }
};

// 6. Get total invested amount
exports.getInvestedAmount = async (req, res) => {
  try {
    const purchases = await PurchasedCrypto.findAll();
    const totalInvested = purchases.reduce(
      (sum, p) => sum + (p.purchase_price * p.quantity), 0
    );
    res.json({ invested_amount: totalInvested });
  } catch (err) {
    res.status(500).json({ message: 'Error calculating invested amount', error: err.message });
  }
};

// 7. Get current portfolio value
exports.getCurrentPortfolioValue = async (req, res) => {
  try {
    const purchases = await PurchasedCrypto.findAll({ include: Crypto });

    let totalValue = 0;
    purchases.forEach(p => {
      totalValue += (p.quantity * p.Crypto.current_price);
    });

    res.json({ portfolio_value: totalValue });
  } catch (err) {
    res.status(500).json({ message: 'Error calculating portfolio value', error: err.message });
  }
};

// 8. Get all purchased cryptos
exports.getAllPurchasedCryptos = async (req, res) => {
  try {
    const purchasedCryptos = await PurchasedCrypto.findAll({
      include: [
        {
          model: Crypto,
          attributes: ['crypto_id', 'crypto_name', 'current_price']
        }
      ]
    });

    res.status(200).json(purchasedCryptos);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching purchased cryptos', error: err.message });
  }
};

// Optional hello route
exports.hello = async (req, res) => {
  res.status(200).json({ message: 'hello' });
};
