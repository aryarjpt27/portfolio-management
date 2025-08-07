const request = require('supertest');
const app = require('../src/app'); // Adjust path if needed
const { RealEstate, PurchasedRealEstate, RealEstateTransaction } = require('../src/models');

jest.mock('../src/models'); // Mock model layer

describe('Real Estate API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/estates/add', () => {
    it('adds a new property successfully', async () => {
      const newProp = { realEstateId: 1, name: 'Villa', location: 'City', currentValue: 10 };
      RealEstate.create.mockResolvedValue(newProp);

      const res = await request(app)
        .post('/api/estates/add')
        .send(newProp);

      expect(res.status).toBe(201);
      expect(res.body).toEqual(newProp);
    });

    it('returns 400 on invalid data', async () => {
      RealEstate.create.mockRejectedValue(new Error('Validation Error'));

      const res = await request(app)
        .post('/api/estates/add')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation Error');
    });
  });

  describe('GET /api/estates', () => {
    it('retrieves all properties', async () => {
      const list = [{ realEstateId: 1 }];
      RealEstate.findAll.mockResolvedValue(list);

      const res = await request(app).get('/api/estates');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(list);
    });
  });

  describe('POST /api/estates/buy', () => {
    it('buys property when exists', async () => {
      RealEstate.findByPk.mockResolvedValue({ realEstateId: 1 });
      const purchase = { purchaseId: 2, realEstateId: 1 };
      PurchasedRealEstate.create.mockResolvedValue(purchase);
      RealEstateTransaction.create.mockResolvedValue({});

      const res = await request(app).post('/api/estates/buy').send({
        realEstateId: 1,
        purchaseDate: '2025-08-07',
        purchasePrice: 100
      });

      expect(res.status).toBe(201);
      expect(res.body.purchase).toEqual(purchase);
    });

    it('returns 404 if property not found', async () => {
      RealEstate.findByPk.mockResolvedValue(null);

      const res = await request(app).post('/api/estates/buy').send({
        realEstateId: 99,
        purchaseDate: '2025-08-07',
        purchasePrice: 100
      });

      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/estates/sell', () => {
    it('sells property when owned', async () => {
      const purchaseRecord = { purchaseId: 3, realEstateId: 1, destroy: jest.fn() };
      PurchasedRealEstate.findOne.mockResolvedValue(purchaseRecord);
      RealEstateTransaction.create.mockResolvedValue({});

      const res = await request(app).post('/api/estates/sell').send({
        realEstateId: 1,
        sellDate: '2025-08-08',
        sellPrice: 150
      });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Property sold successfully');
    });

    it('returns 404 if not in portfolio', async () => {
      PurchasedRealEstate.findOne.mockResolvedValue(null);

      const res = await request(app).post('/api/estates/sell').send({
        realEstateId: 99,
        sellDate: '2025-08-08',
        sellPrice: 150
      });

      expect(res.status).toBe(404);
    });
  });

  describe('GET aggregate and detail endpoints', () => {
    it('gets total invested amount', async () => {
      PurchasedRealEstate.findAll.mockResolvedValue([
        { purchasePrice: 100 },
        { purchasePrice: 200 }
      ]);

      const res = await request(app).get('/api/estates/invested');

      expect(res.status).toBe(200);
      expect(res.body.invested_amount).toBe(300);
    });

    it('calculates current portfolio value correctly', async () => {
      PurchasedRealEstate.findAll.mockResolvedValue([
        { RealEstate: { currentValue: 100 } },
        { RealEstate: { currentValue: 150 } }
      ]);

      const res = await request(app).get('/api/estates/portfolio-value');

      expect(res.status).toBe(200);
      expect(res.body.portfolio_value).toBe(250);
    });

    it('retrieves property by ID with nested purchases and transactions', async () => {
      const mockRecord = {
        realEstateId: 1,
        PurchasedRealEstates: [
          { purchaseId: 5, RealEstateTransactions: [{ transactionId: 6 }] }
        ]
      };
      RealEstate.findByPk.mockResolvedValue(mockRecord);

      const res = await request(app).get('/api/estates/1');

      expect(res.status).toBe(200);
      expect(res.body.PurchasedRealEstates[0].RealEstateTransactions).toBeDefined();
    });

    it('returns 404 for non-existent ID', async () => {
      RealEstate.findByPk.mockResolvedValue(null);

      const res = await request(app).get('/api/estates/999');

      expect(res.status).toBe(404);
    });
  });
});
