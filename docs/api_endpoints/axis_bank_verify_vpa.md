# Axis Bank UPI Verify VPA API

This endpoint is used to verify a Virtual Primary Address (VPA) for UPI Payment Service Provider. It can be used for both Person to Person (P2P) and Person to Merchant (P2M) verifications.

## API Details

**Endpoint:** `POST /api/axis/upi/verify-vpa`

**Description:** Verify a VPA through Axis Bank UPI service for both P2P and P2M scenarios.

## Request Parameters

### Headers

| Header | Type | Required | Description |
|--------|------|----------|-------------|
| X-IBM-Client-Id | String | Yes | Client ID from API keys shared by Axis Bank |
| X-IBM-Client-Secret | String | Yes | Client Secret from API keys shared by Axis Bank |
| X-AXIS-TEST-ID | String | Yes | Test ID to simulate different response conditions (1=P2P Success, 2=P2M Success, 90=Invalid Input, others=Backend Failure) |
| Content-Type | String | No | Request content type (application/json) |
| Accept | String | No | Response content type (application/json) |

### Request Body

```json
{
  "SubHeader": {
    "requestUUID": "97f6b07e-b82d-4fed-9c57-80088ba23e30",
    "serviceRequestId": "NB.GEN.PDT.ELIG",
    "serviceRequestVersion": "1.0",
    "channelId": "TEST"
  },
  "VerifyVPARequestBody": {
    "customerid": "918341030147",
    "vpa": "prashanth@axis",
    "device": {
      "app": "com.upi.axispay",
      "capability": "011001",
      "id": "321a192dc6dc8f7a",
      "ip": "100.86.115.100",
      "location": "Jubli Hills Hyd TS IN",
      "mobile": "9183410148",
      "os": "Android9",
      "type": "MOB"
    },
    "payerInfo": {
      "accountnumber": "24412354",
      "mcc": "0000",
      "name": "Test User",
      "payervpa": "payer@axis"
    }
  }
}
```

#### SubHeader Object

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| requestUUID | String | Yes | Unique alphanumeric ID from the source system |
| serviceRequestId | String | Yes | Service request ID configured for the source system |
| serviceRequestVersion | String | Yes | Service request version for the source system |
| channelId | String | Yes | Channel ID configured for the source system |

#### VerifyVPARequestBody Object

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| customerid | String | Yes | Unique identifier of the customer |
| vpa | String | Yes | Virtual Payment Address to verify (Payee) |
| device | Object | Yes | Information related to the source device |
| payerInfo | Object | No | Information of the Payer |

#### Device Object

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| app | String | Yes | Application identifier |
| mobile | String | Yes | Customer mobile number |
| capability | String | No | Device capability as per NPCI specs |
| id | String | No | IMEI of the device |
| ip | String | No | IP address of the mobile |
| location | String | No | Device geolocation |
| os | String | No | OS of the device |
| type | String | No | Type of device |

#### PayerInfo Object

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| accountnumber | String | No | Payer account number |
| mcc | String | No | Merchant Category Code of the Payer |
| name | String | No | Payer name |
| payervpa | String | No | VPA of the Payer |

## Response

### Success Response (Status 200)

#### P2P Success Response (X-AXIS-TEST-ID: 1)

```json
{
  "status": "success",
  "message": "VPA verified successfully with Axis Bank UPI",
  "data": {
    "VerifyVPAResponse": {
      "SubHeader": {
        "requestUUID": "97f6b07e-b82d-4fed-9c57-80088ba23e30",
        "serviceRequestId": "NB.GEN.PDT.ELIG",
        "serviceRequestVersion": "1.0",
        "channelId": "TEST"
      },
      "VerifyVPAResponseBody": {
        "code": "00",
        "result": "Success",
        "data": {
          "name": "John Doe",
          "accType": "SAVINGS",
          "vpa": "testuser@axis",
          "accountnumber": "",
          "ifsc": "",
          "mcc": "0000",
          "customerId": "918341030147",
          "merchantName": "",
          "merchantCategory": ""
        }
      }
    }
  }
}
```

#### P2M Success Response (X-AXIS-TEST-ID: 2)

```json
{
  "status": "success",
  "message": "VPA verified successfully with Axis Bank UPI",
  "data": {
    "VerifyVPAResponse": {
      "SubHeader": {
        "requestUUID": "97f6b07e-b82d-4fed-9c57-80088ba23e30",
        "serviceRequestId": "NB.GEN.PDT.ELIG",
        "serviceRequestVersion": "1.0",
        "channelId": "TEST"
      },
      "VerifyVPAResponseBody": {
        "code": "00",
        "result": "Success",
        "data": {
          "name": "John Doe",
          "accType": "SAVINGS",
          "vpa": "testuser@axis",
          "accountnumber": "",
          "ifsc": "",
          "mcc": "0000",
          "customerId": "918341030147",
          "merchantName": "Test Merchant",
          "merchantCategory": "Retail"
        }
      }
    }
  }
}
```

### Error Response (Status 400/500)

```json
{
  "status": "error",
  "message": "<Error message>",
  "errors": [...],
  "statusCode": 400/500
}
```

## Response Codes

| X-AXIS-TEST-ID | Code | Result | Description |
|----------------|------|--------|-------------|
| 1 | 00 | Success | P2P verification successful |
| 2 | 00 | Success | P2M verification successful |
| 90 | 90 | Invalid Input | Invalid input parameters |
| Others | 91 | Backend Failure | Backend system error |

## Example Usage

### Node.js Example

```javascript
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// Generate a request UUID
const requestUUID = uuidv4();

// Create the request payload
const payload = {
  SubHeader: {
    requestUUID: requestUUID,
    serviceRequestId: "NB.GEN.PDT.ELIG",
    serviceRequestVersion: "1.0",
    channelId: "TEST"
  },
  VerifyVPARequestBody: {
    customerid: "918341030147",
    vpa: "testuser@axis",
    device: {
      app: "com.upi.axispay",
      capability: "011001",
      id: "321a192dc6dc8f7a",
      ip: "100.86.115.100",
      location: "Jubli Hills Hyd TS IN",
      mobile: "9183410148",
      os: "Android9",
      type: "MOB"
    },
    payerInfo: {
      accountnumber: "24412354",
      mcc: "0000",
      name: "Test User",
      payervpa: "payer@axis"
    }
  }
};

// Make API request
axios({
  method: 'POST',
  url: 'http://your-api-endpoint/api/axis/upi/verify-vpa',
  headers: {
    'X-IBM-Client-Id': 'your-client-id',
    'X-IBM-Client-Secret': 'your-client-secret',
    'X-AXIS-TEST-ID': '1', // 1=P2P Success, 2=P2M Success
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  data: payload
})
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });
``` 