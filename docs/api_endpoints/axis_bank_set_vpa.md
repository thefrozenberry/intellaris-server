# Axis Bank UPI Set VPA API

This endpoint is used to set a Virtual Primary Address (VPA) for UPI Payment Service Provider.

## API Details

**Endpoint:** `POST /api/axis/upi/set-vpa`

**Description:** Set a VPA through Axis Bank UPI service.

## Request Parameters

### Headers

| Header | Type | Required | Description |
|--------|------|----------|-------------|
| X-IBM-Client-Id | String | Yes | Client ID from API keys shared by Axis Bank |
| X-IBM-Client-Secret | String | Yes | Client Secret from API keys shared by Axis Bank |
| X-AXIS-TEST-ID | String | Yes | Test ID to simulate different response conditions (1=Success, 2=No records found, 90=Invalid Input, 91=Backend Failure) |
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
  "SetVPARequestBody": {
    "setVpas": [
      {
        "account": "1234567890",
        "customerid": "90*****340",
        "defaultvpa": "Y",
        "ifsc": "AXIS0****95",
        "newvpa": "vi**t@axis",
        "oldvpa": "vir**25@axis"
      }
    ]
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

#### SetVPARequestBody.setVpas Array

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| account | String | Yes | Account number of the user |
| customerid | String | Yes | Unique customer identification number |
| defaultvpa | String | Yes | Default VPA flag (Y/N) |
| ifsc | String | Yes | IFSC code of bank |
| newvpa | String | Yes | VPA to be set |
| oldvpa | String | No | Old VPA (if updating) |

## Response

### Success Response (Status 200)

```json
{
  "status": "success",
  "message": "VPA set successfully in Axis Bank UPI",
  "data": {
    "SubHeader": {
      "requestUUID": "97f6b07e-b82d-4fed-9c57-80088ba23e30",
      "serviceRequestId": "NB.GEN.PDT.ELIG",
      "serviceRequestVersion": "1.0",
      "channelId": "TEST"
    },
    "SetVPAResponseBody": {
      "code": "00",
      "result": "Success",
      "data": ""
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
| 1 | 00 | Success | Successfully set VPA |
| 2 | 01 | No records found | No records found for the given parameters |
| 90 | 90 | Invalid Input | Invalid input parameters |
| 91 | 91 | Backend Failure | Backend system error |

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
  SetVPARequestBody: {
    setVpas: [
      {
        account: "1234567890",
        customerid: "9087654321",
        defaultvpa: "Y",
        ifsc: "AXIS0001234",
        newvpa: "newuser@axis",
        oldvpa: "olduser@axis"
      }
    ]
  }
};

// Make API request
axios({
  method: 'POST',
  url: 'http://your-api-endpoint/api/axis/upi/set-vpa',
  headers: {
    'X-IBM-Client-Id': 'your-client-id',
    'X-IBM-Client-Secret': 'your-client-secret',
    'X-AXIS-TEST-ID': '1',
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