// tests/backend.test.js
const request = require('supertest');
const app = require('../src/app'); // adjust path if needed
const {
  RealEstate,
  PurchasedRealEstate,
  RealEstateTransaction,
  Stock,
  PurchasedStock,
  Transaction
} = require('../src/models');

jest.mock('../src/models');

describe('Real Estate Controllers (/api/estates)', () => {
  afterEach(jest.clearAllMocks);

  describe('POST /api/estates/add', () => {
    it('should add a new property', async () => {
      const mock = { realEstateId: 1, name: 'A', location: 'B', currentValue: 100 };
      RealEstate.create.mockResolvedValue(mock);
      const res = await request(app).post('/api/estates/add').send(mock);
      expect(res.status).toBe(201);
      expect(res.body).toEqual(mock);
    });

    it('handles invalid input', async () => {
      RealEstate.create.mockRejectedValue(new Error('Bad input'));
      const res = await request(app).post('/api/estates/add').send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/Bad input/);
    });
  });

  describe('GET /api/estates', () => {
    it('retrieves all properties', async () => {
      RealEstate.findAll.mockResolvedValue([{ realEstateId:1 }]);
      const res = await request(app).get('/api/estates');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('POST /api/estates/buy', () => {
    it('buys property when exists', async () => {
      RealEstate.findByPk.mockResolvedValue({ realEstateId:2 });
      PurchasedRealEstate.create.mockResolvedValue({ purchaseId: 3 });
      RealEstateTransaction.create.mockResolvedValue({});
      const res = await request(app).post('/api/estates/buy').send({
        realEstateId:2, purchaseDate:'2025-08-01', purchasePrice:500
      });
      expect(res.status).toBe(201);
      expect(res.body.message).toMatch(/Property purchased/);
    });

    it('returns 404 if property not found', async () => {
      RealEstate.findByPk.mockResolvedValue(null);
      const res = await request(app).post('/api/estates/buy').send({
        realEstateId:99, purchaseDate:'2025-08-01', purchasePrice:500
      });
      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/estates/sell', () => {
    it('sells property when owned', async () => {
      PurchasedRealEstate.findOne.mockResolvedValue({ purchaseId:4, destroy: jest.fn() });
      RealEstateTransaction.create.mockResolvedValue({});
      const res = await request(app).post('/api/estates/sell').send({
        realEstateId:5, sellDate:'2025-08-05', sellPrice:600
      });
      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/sold successfully/);
    });

    it('returns 404 when not in portfolio', async () => {
      PurchasedRealEstate.findOne.mockResolvedValue(null);
      const res = await request(app).post('/api/estates/sell').send({
        realEstateId:999, sellDate:'2025-08-05', sellPrice:600
      });
      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/estates/:id', () => {
    it('retrieves property by ID with nested data', async () => {
      const mock = {
        realEstateId: 1,
        PurchasedRealEstates: [{ purchaseId:2, RealEstateTransactions: [{ transactionId:3 }] }]
      };
      RealEstate.findByPk.mockResolvedValue(mock);
      const res = await request(app).get('/api/estates/1');
      expect(res.status).toBe(200);
      expect(res.body.PurchasedRealEstates[0].RealEstateTransactions).toBeDefined();
    });

    it('404 when property not found', async () => {
      RealEstate.findByPk.mockResolvedValue(null);
      const res = await request(app).get('/api/estates/999');
      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/estates/transactions', () => {
    it('retrieves all real estate transactions', async () => {
      const mock = [{ transactionId:1, PurchasedRealEstate:{ realEstateId:2, RealEstate:{}}}];
      RealEstateTransaction.findAll.mockResolvedValue(mock);
      const res = await request(app).get('/api/estates/transactions');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });
  });

  describe('GET /api/estates/invested', () => {
    it('returns total invested amount', async () => {
      PurchasedRealEstate.findAll.mockResolvedValue([
        { purchasePrice: 100 },
        { purchasePrice: 200 }
      ]);
      const res = await request(app).get('/api/estates/invested');
      expect(res.status).toBe(200);
      expect(res.body.invested_amount).toBe(300);
    });
  });

  describe('GET /api/estates/value', () => {
    it('returns portfolio current value', async () => {
      PurchasedRealEstate.findAll.mockResolvedValue([
        { RealEstate: { currentValue: 100 }, purchasePrice: 50 }
      ]);
      const res = await request(app).get('/api/estates/value');
      expect(res.status).toBe(200);
      expect(res.body.portfolio_value).toBe(100);
    });
  });

  describe('GET /api/estates/bought', () => {
    it('returns all bought purchases', async () => {
      PurchasedRealEstate.findAll.mockResolvedValue([{ purchaseId: 1 }]);
      const res = await request(app).get('/api/estates/bought');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});

describe('Stock Controllers (/api/stocks)', () => {
  afterEach(jest.clearAllMocks);

  describe('POST /api/stocks/buy', () => {
    it('buys stock successfully', async () => {
      Stock.findByPk.mockResolvedValue({ stockId: 1 });
      PurchasedStock.create.mockResolvedValue({ purchased_id: 10 });
      Transaction.create.mockResolvedValue({});
      const res = await request(app).post('/api/stocks/buy').send({
        stock_id:1, purchase_date:'2025-08-02', purchase_price:200, quantity:5
      });
      expect(res.status).toBe(201);
      expect(res.body.message).toMatch(/purchased/);
    });

    it('404 if stock not found', async () => {
      Stock.findByPk.mockResolvedValue(null);
      const res = await request(app).post('/api/stocks/buy').send({ stock_id:99 });
      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/stocks/sell', () => {
    it('sells shares partially', async () => {
      const purchase = { quantity:10, update: jest.fn(), destroy: jest.fn() };
      PurchasedStock.findAll.mockResolvedValue([purchase]);
      Transaction.create.mockResolvedValue({});
      const res = await request(app).post('/api/stocks/sell').send({
        stock_id:1, quantity:5, transaction_date:'2025-08-03', sell_price:210
      });
      expect(res.status).toBe(200);
      expect(res.body.soldTransactions[0].sold).toBe(5);
    });

    it('400 for insufficient shares', async () => {
      PurchasedStock.findAll.mockResolvedValue([{ quantity:2 }]);
      const res = await request(app).post('/api/stocks/sell').send({
        stock_id:1, quantity:5, transaction_date:'2025-08-03', sell_price:210
      });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/stocks/:id', () => {
    it('retrieves stock info', async () => {
      Stock.findByPk.mockResolvedValue({ stockId:7, ticker_symbol:'XYZ' });
      const res = await request(app).get('/api/stocks/7');
      expect(res.status).toBe(200);
      expect(res.body.ticker_symbol).toBe('XYZ');
    });

    it('404 if not found', async () => {
      Stock.findByPk.mockResolvedValue(null);
      const res = await request(app).get('/api/stocks/999');
      expect(res.status).toBe(404);
    });
  });
});
