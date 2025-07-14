const request = require('supertest');
const nock = require('nock');
const app = require('../app');
const config = require('../config/config');

// Mock data for revoking a mandate
const updateMandatePayload = {
  "Data": {
    "customerid": "917400112235",
    "appId": "123",
    "creds": {
      "type": "PIN",
      "subType": "MPIN",
      "data": {
        "code": "NPCI",
        "ki": "20150822",
        "encryptedBase64String": "2.0|AfMUR/p7M1Oe8sKwu/6dz6f2RoWDJ5xcAFOA43hicpwkJwrebFlt6gRcz01lkjRKIaDRUeTGqrFll2sab3V16XTolcM2tARR8RYGp78OcHaTokXnrC3dqiKmJmM9XmOM6uCXnPHb5NgLqY5V6ynTbuqVUEzVE8T3/mwQQkT70jAAw8kaDn9mFyTBmuTBVcOxbf1PgVpUSQH2yuM66dUBCqtpVFqmT2/IHlx5IGu3efd/N7hO/h9R43QYD61o9UBcIDJRs72X5KJudWu0Np6gs4OxhD285P7hwZE8T0uLpZ2ucqYSMxUulF/hSB+9IKolIpCp+kzswViy6osc4/5EA\\u003d\\u003d"
      }
    },
    "Device": "{\"mobile\":\"917400112235\",\"geocode\":\"0.0,0.0\",\"location\":\"Mumbai\",\"ip\":\"100.125.244.211\",\"type\":\"XiaomiRedmiNote5\",\"id\":\"868210034695367\",\"os\":\"Android7.1.2\",\"app\":\"com.google.android.apps.nbu.paisa.user\",\"capability\":\"011001\",\"gcmid\":\"0.0,0.0\",\"version\":\"2.5.33_uat\"}",
    "newstate": "REVOKE",
    "txnID": "AXIg7dl348v8797t6wtlsdt7srds38c45v4",
    "umn": "AXIShjsteajYRSndTV4To6wttD9h6i"
  },
  "Risk": {
    "id": 8844750822047744
  }
};

const updateMandateSuccessResponse = {
  "Data": "{\"code\":\"00\",\"result\":\"success\",\"data\":\"830315136150\",\"umn\":\"AXI36cc92790e594ca083cb14eac4cf5@psp\",\"txnid\":\"AXI36cc92790e594ca083cb14eac4cf5@psp\"}",
  "Risk": {
    "id": 5306660891394048
  },
  "Link": {
    "id": 1290329091211264
  },
  "Meta": {
    "id": 2620040683716608
  }
};

// Parsed version of the success response for assertions
const parsedSuccessResponse = {
  "Data": {
    "code": "00",
    "result": "success",
    "data": "830315136150",
    "umn": "AXI36cc92790e594ca083cb14eac4cf5@psp",
    "txnid": "AXI36cc92790e594ca083cb14eac4cf5@psp"
  },
  "Risk": {
    "id": 5306660891394048
  },
  "Link": {
    "id": 1290329091211264
  },
  "Meta": {
    "id": 2620040683716608
  }
};

describe('Update Mandate Status API', () => {
  beforeEach(() => {
    // Reset nock interceptors before each test
    nock.cleanAll();
  });

  afterEach(() => {
    // Ensure all nock interceptors were called
    nock.cleanAll();
  });

  describe('POST /api/v1/mandate/update-status', () => {
    it('should revoke a mandate successfully', async () => {
      // Mock Axis Bank API response
      nock(config.AXIS_API_URL)
        .post('/transactions/updatemandate')
        .reply(200, updateMandateSuccessResponse);

      const res = await request(app)
        .post('/api/v1/mandate/update-status')
        .set('Content-Type', 'application/json')
        .set('x-fapi-epoch-millis', Date.now().toString())
        .set('x-fapi-channel-id', 'TEST')
        .set('x-fapi-uuid', 'test-uuid-123')
        .set('X-AXIS-TEST-ID', '1')
        .send(updateMandatePayload);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Mandate revoked successfully');
      expect(res.body.data).toHaveProperty('Data');
      // Since the service parses the string response, our assertion should match the parsed object
      expect(typeof res.body.data.Data).toBe('object');
      expect(res.body.data.Data.result).toBe('success');
      expect(res.body.data.Data.code).toBe('00');
    });

    it('should suspend a mandate successfully', async () => {
      // Create a copy of the payload with different newstate
      const suspendPayload = JSON.parse(JSON.stringify(updateMandatePayload));
      suspendPayload.Data.newstate = 'SUSPEND';

      // Mock Axis Bank API response
      nock(config.AXIS_API_URL)
        .post('/transactions/updatemandate')
        .reply(200, updateMandateSuccessResponse);

      const res = await request(app)
        .post('/api/v1/mandate/update-status')
        .set('Content-Type', 'application/json')
        .set('x-fapi-epoch-millis', Date.now().toString())
        .set('x-fapi-channel-id', 'TEST')
        .set('x-fapi-uuid', 'test-uuid-123')
        .set('X-AXIS-TEST-ID', '1')
        .send(suspendPayload);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Mandate suspended successfully');
      expect(res.body.data).toHaveProperty('Data');
    });

    it('should activate a mandate successfully', async () => {
      // Create a copy of the payload with different newstate
      const activatePayload = JSON.parse(JSON.stringify(updateMandatePayload));
      activatePayload.Data.newstate = 'ACTIVATE';

      // Mock Axis Bank API response
      nock(config.AXIS_API_URL)
        .post('/transactions/updatemandate')
        .reply(200, updateMandateSuccessResponse);

      const res = await request(app)
        .post('/api/v1/mandate/update-status')
        .set('Content-Type', 'application/json')
        .set('x-fapi-epoch-millis', Date.now().toString())
        .set('x-fapi-channel-id', 'TEST')
        .set('x-fapi-uuid', 'test-uuid-123')
        .set('X-AXIS-TEST-ID', '1')
        .send(activatePayload);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Mandate activated successfully');
      expect(res.body.data).toHaveProperty('Data');
    });

    it('should handle mandate not found error', async () => {
      // Mock Axis Bank API error response for not found mandate
      nock(config.AXIS_API_URL)
        .post('/transactions/updatemandate')
        .reply(400, {
          message: 'Mandate not found'
        });

      const res = await request(app)
        .post('/api/v1/mandate/update-status')
        .set('Content-Type', 'application/json')
        .set('x-fapi-epoch-millis', Date.now().toString())
        .set('x-fapi-channel-id', 'TEST')
        .set('x-fapi-uuid', 'test-uuid-123')
        .set('X-AXIS-TEST-ID', '2') // Test ID for not found scenario
        .send(updateMandatePayload);

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Mandate not found');
    });

    it('should handle mandate already revoked error', async () => {
      // Mock Axis Bank API error response for already revoked mandate
      nock(config.AXIS_API_URL)
        .post('/transactions/updatemandate')
        .reply(400, {
          message: 'Mandate already revoked'
        });

      const res = await request(app)
        .post('/api/v1/mandate/update-status')
        .set('Content-Type', 'application/json')
        .set('x-fapi-epoch-millis', Date.now().toString())
        .set('x-fapi-channel-id', 'TEST')
        .set('x-fapi-uuid', 'test-uuid-123')
        .set('X-AXIS-TEST-ID', '3') // Test ID for already revoked scenario
        .send(updateMandatePayload);

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Mandate already revoked');
    });

    it('should handle validation errors', async () => {
      const invalidPayload = {
        Data: {
          // Missing required fields
        },
        Risk: {
          id: 8844750822047744
        }
      };

      const res = await request(app)
        .post('/api/v1/mandate/update-status')
        .set('Content-Type', 'application/json')
        .set('x-fapi-epoch-millis', Date.now().toString())
        .set('x-fapi-channel-id', 'TEST')
        .set('x-fapi-uuid', 'test-uuid-123')
        .set('X-AXIS-TEST-ID', '1')
        .send(invalidPayload);

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
      expect(res.body).toHaveProperty('error');
    });

    it('should handle axis bank api errors', async () => {
      // Mock Axis Bank API error response
      nock(config.AXIS_API_URL)
        .post('/transactions/updatemandate')
        .reply(500, {
          error: 'Internal Server Error',
          message: 'Something went wrong'
        });

      const res = await request(app)
        .post('/api/v1/mandate/update-status')
        .set('Content-Type', 'application/json')
        .set('x-fapi-epoch-millis', Date.now().toString())
        .set('x-fapi-channel-id', 'TEST')
        .set('x-fapi-uuid', 'test-uuid-123')
        .set('X-AXIS-TEST-ID', '1')
        .send(updateMandatePayload);

      expect(res.statusCode).toEqual(500);
      expect(res.body.success).toBe(false);
      expect(res.body).toHaveProperty('error');
    });
  });
}); 