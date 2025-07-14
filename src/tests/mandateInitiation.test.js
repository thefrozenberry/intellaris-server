const request = require('supertest');
const nock = require('nock');
const app = require('../app');
const config = require('../config/config');

// Mock data
const mandateRequestPayload = {
  "Data": {
    "CustomerID": "917400112235",
    "txnID": "AXIg7dl348v8797t6wtlsdt7srds38c45v4",
    "appid": "123",
    "umn": "AXIShjsteajYRSndTV4To6wttD9h6i",
    "mandateName": "UPI",
    "revocable": "Y",
    "shareToPayee": "Y",
    "validityStart": 6022019,
    "validityEnd": "27022019",
    "amountRule": "EXACT",
    "amountRuleValue": "200.00",
    "recurrence": "ONETIME",
    "ruleValue": "string",
    "purposecode": "00",
    "ruleType": "ON",
    "note": "Mandate Request",
    "payerAddr": "muk***.gami29@okaxis",
    "payerName": "MAYANKARVINDKUMAMEHTA",
    "payeeAddr": "soh***@axis",
    "payeeName": "HANOZKEKIBHARUCHA",
    "executeByPayeePSP": "Y",
    "accountDetails": {
      "name": "Customer Name",
      "accRefNumber": "450010100225601",
      "maskedAccnumber": "XXXX5601",
      "ifsc": "AXIS0000450",
      "type": "SAVINGS",
      "iin": "233343"
    },
    "creds": {
      "type": "PIN",
      "subType": "MPIN",
      "data": {
        "code": "NPCI",
        "ki": "20150822",
        "encryptedBase64String": "2.0|AfMUR/p7M1Oe8sKwu/6dz6f2RoWDJ5xcAFOA43hicpwkJwrebFlt6gRcz01lkjRKIaDRUeTGqrFll2sab3V16XTolcM2tARR8RYGp78OcHaTokXnrC3dqiKmJmM9XmOM6uCXnPHb5NgLqY5V6ynTbuqVUEzVE8T3/mwQQkT70jAAw8kaDn9mFyTBmuTBVcOxbf1PgVpUSQH2yuM66dUBCqtpVFqmT2/IHlx5IGu3efd/N7hO/h9R43QYD61o9UBcIDJRs72X5KJudWu0Np6gs4OxhD285P7hwZE8T0uLpZ2ucqYSMxUulF/hSB+9IKolIpCp+kzswViy6osc4/5EA\\u003d\\u003d"
      }
    },
    "Device": "{\"mobile\":\"917400112235\",\"geocode\":\"0.0,0.0\",\"location\":\"Mumbai\",\"ip\":\"100.125.244.211\",\"type\":\"XiaomiRedmiNote5\",\"id\":\"868210034695367\",\"os\":\"Android7.1.2\",\"app\":\"com.google.android.apps.nbu.paisa.user\",\"capability\":\"011001\"}",
    "initiatedBy": "PAYER_INITIATED"
  },
  "Risk": {
    "id": 4818195206635520
  }
};

const mandateSuccessResponse = {
  "Data": {
    "code": "00",
    "result": "success",
    "data": "830315136150",
    "umn": "AXI36cc92790e594ca083cb14eac4cf5@psp",
    "txnid": "AXI36cc92790e594ca083cb14eac4cf5@psp"
  },
  "Risk": {
    "id": 938183248314368
  },
  "Link": {
    "id": 6810498465005568
  },
  "Meta": {
    "id": 4455354769342464
  }
};

describe('Mandate API', () => {
  beforeEach(() => {
    // Reset nock interceptors before each test
    nock.cleanAll();
  });

  afterEach(() => {
    // Ensure all nock interceptors were called
    nock.cleanAll();
  });

  describe('POST /api/v1/mandate/initiate', () => {
    it('should initiate a mandate successfully', async () => {
      // Mock Axis Bank API response
      nock(config.AXIS_API_URL)
        .post('/transactions/initiatedmandate')
        .reply(200, mandateSuccessResponse);

      const res = await request(app)
        .post('/api/v1/mandate/initiate')
        .set('Content-Type', 'application/json')
        .set('x-fapi-epoch-millis', Date.now().toString())
        .set('x-fapi-channel-id', 'TEST')
        .set('x-fapi-uuid', 'test-uuid-123')
        .set('X-AXIS-TEST-ID', '1')
        .send(mandateRequestPayload);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('Data');
      expect(res.body.data.Data.result).toBe('success');
      expect(res.body.data.Data.code).toBe('00');
      expect(res.body.data.Data.umn).toBe('AXI36cc92790e594ca083cb14eac4cf5@psp');
    });

    it('should handle validation errors', async () => {
      const invalidPayload = {
        Data: {
          // Missing required fields
        },
        Risk: {}
      };

      const res = await request(app)
        .post('/api/v1/mandate/initiate')
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
        .post('/transactions/initiatedmandate')
        .reply(500, {
          error: 'Internal Server Error',
          message: 'Something went wrong'
        });

      const res = await request(app)
        .post('/api/v1/mandate/initiate')
        .set('Content-Type', 'application/json')
        .set('x-fapi-epoch-millis', Date.now().toString())
        .set('x-fapi-channel-id', 'TEST')
        .set('x-fapi-uuid', 'test-uuid-123')
        .set('X-AXIS-TEST-ID', '1')
        .send(mandateRequestPayload);

      expect(res.statusCode).toEqual(500);
      expect(res.body.success).toBe(false);
      expect(res.body).toHaveProperty('error');
    });
  });
}); 