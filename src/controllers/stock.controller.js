const { Stock } = require('../models');

exports.getAllStocks = async (req, res) => {
  const stocks = await Stock.findAll();
  res.json(stocks);
};

exports.addStock = async (req, res) => {
  const stock = await Stock.create(req.body);
  res.status(201).json(stock);
};

exports.getStockById = async (req, res) => {
  const stock = await Stock.findByPk(req.params.id);
  if (!stock) {
    return res.status(404).json({ error: 'Stock not found' });
  }
  res.json(stock);
};

exports.deleteStock = async (req, res) => {
  const deleted = await Stock.destroy({ where: { id: req.params.id } });
  if (!deleted) {
    return res.status(404).json({ error: 'Stock not found' });
  }
  res.json({ message: 'Stock deleted successfully' });
};