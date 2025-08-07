
const request = require('supertest');
const app = require('../../app'); // Adjust path as needed
const db = require('../../models');
const RealEstate = require('../../models/realEstate.model');
const RealEstateTransaction = require('../../models/RealEstateTransaction.model');
const PurchasedRealEstate = require('../../models/PurchasedRealEstate.model');

jest.mock('../../models');

describe('Real Estate Controller', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addProperty', () => {
    it('should add a new property', async () => {
      const mockProperty = { name: 'Test Property', location: 'Test City', currentValue: 50000 };
      RealEstate.create.mockResolvedValue(mockProperty);

      const res = await request(app).post('/api/real-estate/add').send(mockProperty);

      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe('Test Property');
    });
  });

  describe('getProperties', () => {
    it('should fetch all properties', async () => {
      const mockProperties = [{ name: 'Property1' }, { name: 'Property2' }];
      RealEstate.findAll.mockResolvedValue(mockProperties);

      const res = await request(app).get('/api/real-estate');

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2);
    });
  });

  describe('buyProperty', () => {
    it('should allow buying a property', async () => {
      const mockEstate = { id: 1 };
      const mockPurchase = { purchaseId: 1, realEstateId: 1 };
      RealEstate.findByPk.mockResolvedValue(mockEstate);
      PurchasedRealEstate.create.mockResolvedValue(mockPurchase);
      RealEstateTransaction.create.mockResolvedValue({});

      const res = await request(app).post('/api/real-estate/buy').send({
        realEstateId: 1,
        purchaseDate: '2025-08-01',
        purchasePrice: 50000
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('Property purchased');
    });
  });

  describe('getRealEstateById', () => {
    it('should fetch real estate by ID', async () => {
      const mockProperty = {
        id: 1,
        name: 'Property A',
        PurchasedRealEstates: [{ purchaseId: 1, RealEstateTransactions: [] }]
      };

      RealEstate.findByPk.mockResolvedValue(mockProperty);

      const res = await request(app).get('/api/real-estate/1');

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Property A');
    });
  });

});
