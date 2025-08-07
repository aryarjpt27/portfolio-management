const {RealEstate, RealEstateTransaction, PurchasedRealEstate } = require('../models');
// 1. Add a new property
exports.addProperty = async (req, res) => {
  try {
    const property = await RealEstate.create(req.body);
    res.status(201).json(property);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 2. Get all properties
exports.getProperties = async (req, res) => {
  try {
    const properties = await RealEstate.findAll();
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 3. Get all transactions
exports.getRealEstateTransactions = async (req, res) => {
  try {
    const transactions = await RealEstateTransaction.findAll({
      include: {
        model: PurchasedRealEstate,
        include: {
          model: RealEstate
        }
      }
    });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// 4. Buy real estate
exports.buyProperty = async (req, res) => {
  try {
    const { realEstateId, purchaseDate, purchasePrice } = req.body;

    const realEstate = await RealEstate.findByPk(realEstateId);
    if (!realEstate) {
      return res.status(404).json({ message: 'Real estate not found' });
    }

    const purchase = await PurchasedRealEstate.create({
      realEstateId,
      purchaseDate,
      purchasePrice
    });

    await RealEstateTransaction.create({
      transactionType: 'buy',
      transactionDate: purchaseDate,
      transactionAmount: purchasePrice,
      purchaseId: purchase.purchaseId
    });

    res.status(201).json({ message: 'Property purchased', purchase });
  } catch (error) {
    res.status(500).json({ message: 'Error purchasing property', error: error.message });
  }
};

// 5. Sell real estate
exports.sellProperty = async (req, res) => {
  try {
    const { realEstateId, sellDate, sellPrice } = req.body;

    const purchase = await PurchasedRealEstate.findOne({ where: { realEstateId } });

    if (!purchase) {
      return res.status(404).json({ message: 'Property not found in portfolio' });
    }

    await RealEstateTransaction.create({
      transactionType: 'sell',
      transactionDate: sellDate,
      transactionAmount: sellPrice,
      purchaseId: purchase.purchaseId
    });

    await purchase.destroy();

    res.json({ message: 'Property sold successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error selling property', error: error.message });
  }
};

// 6. Get total invested amount in real estate
exports.getRealEstateInvestedAmount = async (req, res) => {
  try {
    const purchases = await PurchasedRealEstate.findAll();
    const totalInvested = purchases.reduce(
      (sum, p) => sum +=p.purchasePrice, 0
    );
    res.json({ invested_amount: totalInvested });
  } catch (err) {
    res.status(500).json({ message: 'Error calculating total invested amount', error: err.message });
  }
};

//7. Get total value of real estate portfolio
exports.getRealEstateCurrentPortfolioValue = async (req, res) => {
  try {
    const purchases = await PurchasedRealEstate.findAll({ include: RealEstate });

    let totalValue = 0;
    purchases.forEach(p => {
      totalValue += (p.currentValue);
    });

    res.json({ portfolio_value: totalValue });
  } catch (err) {
    res.status(500).json({ message: 'Error calculating real estate portfolio value', error: err.message });
  }
};

// 8. Get all bought (purchase) real estate properties
exports.getBoughtProperties = async (req, res) => {
  try {
    const boughtTransactions = await PurchasedRealEstate.findAll();
    res.json(boughtTransactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bought transactions', error: error.message });
  }
};

//10. Get real estate property by ID
exports.getRealEstateById = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await RealEstate.findByPk(id, {
      include: [
        {
          model: PurchasedRealEstate,
          include: [
            {
              model: RealEstateTransaction
            }
          ]
        }
      ]
    });

    if (!property) {
      return res.status(404).json({ message: 'Real estate property not found' });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching real estate by ID', error: error.message });
  }
};

