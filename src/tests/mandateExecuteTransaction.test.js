const request = require('supertest');
const nock = require('nock');
const app = require('../app');
const config = require('../config/config');

// Mock data
const mandateExecuteTransactionPayload = {
  "Data": {
    "customerid": "91993988764",
    "txnid": "AXI67655656565654ddf",
    "appId": "123",
    "umn": "AXI87656656455445@axis",
    "remarks": "mandate execute",
    "validitystart": "1022019",
    "validityend": "10032019",
    "amount": "199.99",
    "execute": "EXECUTE",
    "device": {
      "app": "com.olive.up",
      "capability": "011001",
      "gcmid": "fQVucf-7dGg:APA91bH_CCs0F-Fqb-nnqNCFQNxYXu3cR6lWjIszYbzOEphvNG07VDPN7IcPMJWZk0hkzsE4DFTRt_JgtTS2bX09s0nIcjiHddgEC8kII7kv2-QRAnE4rwANWDM4jPZYwgP9avwXOWRR",
      "geocode": "0.0,0.0",
      "id": "354460072382094",
      "ip": "10.207.160.30",
      "location": "http://pagin.nf/biiwogo",
      "mobile": "919397123108",
      "os": "Android7.0",
      "type": "MOB"
    }
  },
  "Risk": "kadfop"
};

const mandateExecuteTransactionSuccessResponse = {
  "Data": {
    "code": "00",
    "result": "success",
    "data": "830315136150",
    "umn": "AXI36cc92790e594ca083cb14eac4cf5@psp",
    "txnid": "AXI36cc92790e594ca083cb14eac4cf5"
  },
  "Risk": {
    "id": 5373606303367168
  },
  "Link": {
    "id": 8911282998607872
  },
  "Meta": {
    "id": 5149311262261248
  }
};

describe('Mandate Execute Transaction API', () => {
  beforeEach(() => {
    // Reset nock interceptors before each test
    nock.cleanAll();
  });

  afterEach(() => {
    // Ensure all nock interceptors were called
    nock.cleanAll();
  });

  describe('POST /api/v1/mandate/execute-transaction', () => {
    it('should execute a mandate transaction successfully', async () => {
      // Mock Axis Bank API response
      nock(config.AXIS_API_URL)
        .post('/transactions/mandateexecute')
        .reply(200, mandateExecuteTransactionSuccessResponse);

      const res = await request(app)
        .post('/api/v1/mandate/execute-transaction')
        .set('Content-Type', 'application/json')
        .set('x-fapi-epoch-millis', Date.now().toString())
        .set('x-fapi-channel-id', 'TEST')
        .set('x-fapi-uuid', 'test-uuid-123')
        .set('X-AXIS-TEST-ID', '1')
        .send(mandateExecuteTransactionPayload);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('Data');
      expect(res.body.data.Data.result).toBe('success');
      expect(res.body.data.Data.code).toBe('00');
      expect(res.body.data.Data.umn).toBe('AXI36cc92790e594ca083cb14eac4cf5@psp');
    });

    it('should handle mandate already executed error', async () => {
      // Mock Axis Bank API error response for already executed mandate
      nock(config.AXIS_API_URL)
        .post('/transactions/mandateexecute')
        .reply(400, {
          message: 'Mandate has already been executed'
        });

      const res = await request(app)
        .post('/api/v1/mandate/execute-transaction')
        .set('Content-Type', 'application/json')
        .set('x-fapi-epoch-millis', Date.now().toString())
        .set('x-fapi-channel-id', 'TEST')
        .set('x-fapi-uuid', 'test-uuid-123')
        .set('X-AXIS-TEST-ID', '2') // Test ID for already executed scenario
        .send(mandateExecuteTransactionPayload);

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Mandate has already been executed');
    });

    it('should handle mandate expired error', async () => {
      // Mock Axis Bank API error response for expired mandate
      nock(config.AXIS_API_URL)
        .post('/transactions/mandateexecute')
        .reply(400, {
          message: 'Mandate has expired'
        });

      const res = await request(app)
        .post('/api/v1/mandate/execute-transaction')
        .set('Content-Type', 'application/json')
        .set('x-fapi-epoch-millis', Date.now().toString())
        .set('x-fapi-channel-id', 'TEST')
        .set('x-fapi-uuid', 'test-uuid-123')
        .set('X-AXIS-TEST-ID', '3') // Test ID for expired mandate scenario
        .send(mandateExecuteTransactionPayload);

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Mandate has expired');
    });

    it('should handle validation errors', async () => {
      const invalidPayload = {
        Data: {
          // Missing required fields
        },
        Risk: "kadfop"
      };

      const res = await request(app)
        .post('/api/v1/mandate/execute-transaction')
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
        .post('/transactions/mandateexecute')
        .reply(500, {
          error: 'Internal Server Error',
          message: 'Something went wrong'
        });

      const res = await request(app)
        .post('/api/v1/mandate/execute-transaction')
        .set('Content-Type', 'application/json')
        .set('x-fapi-epoch-millis', Date.now().toString())
        .set('x-fapi-channel-id', 'TEST')
        .set('x-fapi-uuid', 'test-uuid-123')
        .set('X-AXIS-TEST-ID', '1')
        .send(mandateExecuteTransactionPayload);

      expect(res.statusCode).toEqual(500);
      expect(res.body.success).toBe(false);
      expect(res.body).toHaveProperty('error');
    });
  });
}); 