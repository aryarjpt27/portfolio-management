const {Stock, PurchasedStock, Transaction} = require('../models');
// 1. List all stocks
exports.getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.findAll();
    res.json(stocks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stocks', error: err.message });
  }
};

// 2. List wishlisted stocks
exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Stock.findAll({ where: { is_wishlisted: true } });
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching wishlist', error: err.message });
  }
};

// 3. Buy stock
exports.buyStock = async (req, res) => {
  try {
    const { stock_id, purchase_date, purchase_price, quantity } = req.body;

    const stock = await Stock.findByPk(stock_id);
    
    if (!stock) return res.status(404).json({ message: 'Stock not found' });
    
    const purchase = await PurchasedStock.create({
      stock_id,
      purchase_date,
      purchase_price,
      quantity
    });
    await Transaction.create({
      type_of_transaction: 'BUY',
      transaction_date: purchase_date,
      quantity,
      amount: purchase_price * quantity,
      purchased_id: purchase.purchased_id  // <-- Fix is here
    });
    // console.log("this much is fine");
    res.status(201).json({ message: 'Stock purchased', purchase });
  } catch (error) {
    res.status(500).json({ message: 'Error buying stock', error: error.message });
  }
};

// 4. Sell stock
exports.sellStock = async (req, res) => {
  try {
    const { stock_id, quantity, transaction_date, sell_price } = req.body;

    let remaining = quantity;
    const purchases = await PurchasedStock.findAll({
      where: { stock_id },
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
        purchased_id: -1
      });
      
      if (sellQty === purchase.quantity) {
        await purchase.destroy();
      } else {
        await purchase.update({ quantity: purchase.quantity - sellQty });
      }

      soldTransactions.push({ purchase_id: purchase.id, sold: sellQty });
      remaining -= sellQty;
    }

    if (remaining > 0) {
      return res.status(400).json({ message: 'Not enough stock to sell' });
    }

    res.json({ message: 'Stock sold', soldTransactions });
  } catch (error) {
    res.status(500).json({ message: 'Error selling stock', error: error.message });
  }
};

// 5. Get specific stock info
exports.getStockInfo = async (req, res) => {
  try {
    const stock = await Stock.findByPk(req.params.id);
    if (!stock) return res.status(404).json({ message: 'Stock not found' });
    res.json(stock);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stock info', error: err.message });
  }
};

// 6. Get total stock invested amount
exports.getInvestedAmount = async (req, res) => {
  try {
    const purchases = await PurchasedStock.findAll();
    const totalInvested = purchases.reduce(
      (sum, p) => sum += p.purchase_price * p.quantity, 0
    );
    res.json({ invested_amount: totalInvested });
  } catch (err) {
    res.status(500).json({ message: 'Error calculating stock invested amount', error: err.message });
  }
};

// 7. Get current stock portfolio value
exports.getCurrentPortfolioValue = async (req, res) => {
  try {
    const purchases = await PurchasedStock.findAll({ include: Stock });

    let totalValue = 0;
    purchases.forEach(p => {
      totalValue += (p.quantity * p.Stock.current_price);
    });

    res.json({ portfolio_value: totalValue });
  } catch (err) {
    res.status(500).json({ message: 'Error calculating stock portfolio value', error: err.message });
  }
};

// 8. Get all purchased stocks
// exports.getAllPurchasedStocks = async (req, res) => {
//   try {
//     const purchasedStocks = await PurchasedStock.findAll();
//     res.json(purchasedStocks);
//   } catch (err) {
//     res.status(500).json({ message: 'Error fetching purchased stocks', error: err.message });
//   }
// };

exports.getAllPurchasedStocks = async (req, res) => {
  try {
    const purchasedStocks = await PurchasedStock.findAll({
      include: [
        {
          model: Stock,
          attributes: ['stock_id', 'stock_name', 'stock_sector', 'current_price'] // choose what to include
        }
      ]
    });

    res.status(200).json(purchasedStocks);
  } catch (err) {
    console.error('Error fetching purchased stocks:', err);
    res.status(500).json({ message: 'Error fetching purchased stocks', error: err.message });
  }
  
};

exports.hello = async (req, res) => {
  res.status(200).json({message : "hello"});
}


