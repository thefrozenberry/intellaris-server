const request = require('supertest');
const nock = require('nock');
const app = require('../app');
const config = require('../config/config');

// Mock data
const getMandatePayload = {
  "Data": {
    "customerid": "919666799064",
    "txnid": "AXI4f12cd1080cb4910b7518f25c720df1a",
    "appid": "123",
    "umn": "AXI839a288d42da40dab2a2e0d80c486@psp"
  },
  "Risk": "basjewkijatni"
};

const getMandateSuccessResponse = {
  "Data": {
    "code": "00",
    "result": "success",
    "data": [
      {
        "id": 0,
        "payerMobile": "919182025967",
        "payeeMobile": "910001231414",
        "mandateType": "CREATE",
        "initiatedBy": "PAYER",
        "umn": "AXI68d08ba01c7849bc8cb0157dcaac5@axis",
        "revokeable": "Y",
        "shareToPayee": "Y",
        "txnid": "AXI78912b36cf89460c8065b390ba2cb2b3",
        "validity_start": "19052022",
        "validity_end": "20052022",
        "amount": "4.00",
        "amountRule": "MAX",
        "recurrencePattern": "DAILY",
        "rule_value": "null",
        "rule_type": "ON",
        "credType": "null",
        "payerVpa": "saikiran@axis",
        "payeeVpa": "payu@axis",
        "payerType": "PERSON",
        "payeeType": "PERSON",
        "createdDate": "2022-05-19T12:57:36.023Z",
        "updatedDate": "2022-05-19T12:57:36.799Z",
        "dgtSign": "null",
        "payerAccountNumber": "XXXXXX021766",
        "payeeAccountNumber": "XXXXXX013359",
        "payerIfsc": "AXIS0000205",
        "payeeIfsc": "AXIS0000063",
        "payerAccountName": "SHYAM SUNDER AGARWAL",
        "payeeAccountName": "PAYUCOLLECT",
        "payerAccountType": "SAVINGS",
        "payeeAccountType": "CURRENT",
        "payerStatus": "S",
        "payeeStatus": "S",
        "mandateName": "UPI",
        "remarks": "UPI",
        "recurrenceRuleType": "ON",
        "recurrenceRuleValue": "null",
        "payername": "SHYAM SUNDER AGARWAL",
        "payeename": "PAYUCOLLECT",
        "merchantflag": "N",
        "rrn": "213924932121",
        "refUrl": "https://axisbank.com/"
      }
    ]
  },
  "Risk": {
    "id": 7055358637899776
  },
  "Link": {
    "id": 2662250861035520
  },
  "Meta": {
    "id": 7219393685618688
  }
};

describe('Get Mandate API', () => {
  beforeEach(() => {
    // Reset nock interceptors before each test
    nock.cleanAll();
  });

  afterEach(() => {
    // Ensure all nock interceptors were called
    nock.cleanAll();
  });

  describe('POST /api/v1/mandate/get-mandate', () => {
    it('should get mandate details successfully', async () => {
      // Mock Axis Bank API response
      nock(config.AXIS_API_URL)
        .post('/transactions/getmandate')
        .reply(200, getMandateSuccessResponse);

      const res = await request(app)
        .post('/api/v1/mandate/get-mandate')
        .set('Content-Type', 'application/json')
        .set('x-fapi-epoch-millis', Date.now().toString())
        .set('x-fapi-channel-id', 'TEST')
        .set('x-fapi-uuid', 'test-uuid-123')
        .set('X-AXIS-TEST-ID', '1')
        .send(getMandatePayload);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('Data');
      expect(res.body.data.Data.result).toBe('success');
      expect(res.body.data.Data.code).toBe('00');
      expect(Array.isArray(res.body.data.Data.data)).toBeTruthy();
      expect(res.body.data.Data.data.length).toBeGreaterThan(0);
      expect(res.body.data.Data.data[0].umn).toBe('AXI68d08ba01c7849bc8cb0157dcaac5@axis');
    });

    it('should handle failure response from bank API', async () => {
      // Mock Axis Bank API failure response
      nock(config.AXIS_API_URL)
        .post('/transactions/getmandate')
        .reply(400, {
          message: 'Invalid mandate details'
        });

      const res = await request(app)
        .post('/api/v1/mandate/get-mandate')
        .set('Content-Type', 'application/json')
        .set('x-fapi-epoch-millis', Date.now().toString())
        .set('x-fapi-channel-id', 'TEST')
        .set('x-fapi-uuid', 'test-uuid-123')
        .set('X-AXIS-TEST-ID', '2') // Test ID for failure scenario
        .send(getMandatePayload);

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Invalid mandate details');
    });

    it('should handle validation errors', async () => {
      const invalidPayload = {
        Data: {
          // Missing required fields
        },
        Risk: "basjewkijatni"
      };

      const res = await request(app)
        .post('/api/v1/mandate/get-mandate')
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
        .post('/transactions/getmandate')
        .reply(500, {
          error: 'Internal Server Error',
          message: 'Something went wrong'
        });

      const res = await request(app)
        .post('/api/v1/mandate/get-mandate')
        .set('Content-Type', 'application/json')
        .set('x-fapi-epoch-millis', Date.now().toString())
        .set('x-fapi-channel-id', 'TEST')
        .set('x-fapi-uuid', 'test-uuid-123')
        .set('X-AXIS-TEST-ID', '1')
        .send(getMandatePayload);

      expect(res.statusCode).toEqual(500);
      expect(res.body.success).toBe(false);
      expect(res.body).toHaveProperty('error');
    });
  });
}); 