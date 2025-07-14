const request = require('supertest');
const nock = require('nock');
const app = require('../app');
const config = require('../config/config');

// Mock data
const getMandateTransactionsPayload = {
  "Data": {
    "customerid": "919666799064",
    "appid": "123",
    "txnid": "AXI1fc804602a964c99820246bc4df6844f"
  },
  "Risk": {
    "id": 2999041652686848
  }
};

const getMandateTransactionsSuccessResponse = {
  "Data": {
    "code": "00",
    "result": "success",
    "data": [
      "transaction1",
      "transaction2",
      "transaction3"
    ]
  },
  "Risk": {
    "id": 210759174848512
  },
  "Link": {
    "id": 2442866397806592
  },
  "Meta": {
    "id": 1953391475425280
  }
};

describe('Get Mandate Transactions API', () => {
  beforeEach(() => {
    // Reset nock interceptors before each test
    nock.cleanAll();
  });

  afterEach(() => {
    // Ensure all nock interceptors were called
    nock.cleanAll();
  });

  describe('POST /api/v1/mandate/get-transactions', () => {
    it('should get mandate transactions successfully', async () => {
      // Mock Axis Bank API response
      nock(config.AXIS_API_URL)
        .post('/transactions/getmandatetxn')
        .reply(200, getMandateTransactionsSuccessResponse);

      const res = await request(app)
        .post('/api/v1/mandate/get-transactions')
        .set('Content-Type', 'application/json')
        .set('x-fapi-epoch-millis', Date.now().toString())
        .set('x-fapi-channel-id', 'TEST')
        .set('x-fapi-uuid', 'test-uuid-123')
        .set('X-AXIS-TEST-ID', '1')
        .send(getMandateTransactionsPayload);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('Data');
      expect(res.body.data.Data.result).toBe('success');
      expect(res.body.data.Data.code).toBe('00');
      expect(Array.isArray(res.body.data.Data.data)).toBeTruthy();
      expect(res.body.data.Data.data.length).toBe(3);
    });

    it('should handle failure response from bank API', async () => {
      // Mock Axis Bank API failure response
      nock(config.AXIS_API_URL)
        .post('/transactions/getmandatetxn')
        .reply(400, {
          message: 'Invalid transaction details'
        });

      const res = await request(app)
        .post('/api/v1/mandate/get-transactions')
        .set('Content-Type', 'application/json')
        .set('x-fapi-epoch-millis', Date.now().toString())
        .set('x-fapi-channel-id', 'TEST')
        .set('x-fapi-uuid', 'test-uuid-123')
        .set('X-AXIS-TEST-ID', '2') // Test ID for failure scenario
        .send(getMandateTransactionsPayload);

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Invalid transaction details');
    });

    it('should handle validation errors', async () => {
      const invalidPayload = {
        Data: {
          // Missing required fields
        },
        Risk: {
          id: 2999041652686848
        }
      };

      const res = await request(app)
        .post('/api/v1/mandate/get-transactions')
        .set('Content-Type', 'application/json')
        .set('x-fapi-epoch-millis', Date.now().toString())
        .set('x-fapi-channel-id', 'TEST')
        .set('x-fapi-uuid', 'test-uuid-123')
        .set('X-AXIS-TEST-ID', '1')
        .send(invalidPayload);

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
      expect(res.body).toHaveProperty('errors');
    });

    it('should handle axis bank api errors', async () => {
      // Mock Axis Bank API error response
      nock(config.AXIS_API_URL)
        .post('/transactions/getmandatetxn')
        .reply(500, {
          error: 'Internal Server Error',
          message: 'Something went wrong'
        });

      const res = await request(app)
        .post('/api/v1/mandate/get-transactions')
        .set('Content-Type', 'application/json')
        .set('x-fapi-epoch-millis', Date.now().toString())
        .set('x-fapi-channel-id', 'TEST')
        .set('x-fapi-uuid', 'test-uuid-123')
        .set('X-AXIS-TEST-ID', '1')
        .send(getMandateTransactionsPayload);

      expect(res.statusCode).toEqual(500);
      expect(res.body.success).toBe(false);
      expect(res.body).toHaveProperty('error');
    });

    it('should work with optional txnid field', async () => {
      // Create payload without txnid
      const payloadWithoutTxnId = JSON.parse(JSON.stringify(getMandateTransactionsPayload));
      delete payloadWithoutTxnId.Data.txnid;

      // Mock Axis Bank API response
      nock(config.AXIS_API_URL)
        .post('/transactions/getmandatetxn')
        .reply(200, getMandateTransactionsSuccessResponse);

      const res = await request(app)
        .post('/api/v1/mandate/get-transactions')
        .set('Content-Type', 'application/json')
        .set('x-fapi-epoch-millis', Date.now().toString())
        .set('x-fapi-channel-id', 'TEST')
        .set('x-fapi-uuid', 'test-uuid-123')
        .set('X-AXIS-TEST-ID', '1')
        .send(payloadWithoutTxnId);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('Data');
    });
  });
}); 