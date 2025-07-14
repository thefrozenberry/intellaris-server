# Axis Bank UPI VPA Availability API

This endpoint is used to check the availability of Virtual Primary Addresses (VPAs) for UPI Payment Service Provider.

## API Details

**Endpoint:** `GET /api/axis/upi/vpa-availability`

**Description:** Check VPA availability through Axis Bank UPI service.

## Request Parameters

### Headers

| Header | Type | Required | Description |
|--------|------|----------|-------------|
| X-IBM-Client-Id | String | Yes | Client ID from API keys shared by Axis Bank |
| X-IBM-Client-Secret | String | Yes | Client Secret from API keys shared by Axis Bank |
| X-AXIS-TEST-ID | String | Yes | Test ID to simulate different response conditions (1=Success, 2=No records found, 90=Invalid Input, 91=Backend Failure) |
| X-AXIS-serviceRequestId | String | Yes | Service request ID configured for the source system |
| X-AXIS-serviceRequestVersion | String | Yes | Service request version for the source system |
| X-AXIS-channelId | String | Yes | Channel ID configured for the source system |
| X-Axis-requestUUID | String | Yes | Reference identifier for uniquely identifying each request |
| Accept | String | No | Response content type (application/json) |

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| customerId | String | Optional* | Unique identifier of the customer |
| vpa | String | Optional* | Virtual Primary Address to check |
| applicationID | String | No | Application unique ID |

*At least one of `customerId` or `vpa` must be provided.

## Response

### Success Response (Status 200)

```json
{
  "status": "success",
  "message": "VPA availability checked successfully with Axis Bank UPI",
  "data": {
    "CheckVPAAvailibilityResponse": {
      "SubHeader": {
        "requestUUID": "97f6b07e-b82d-4fed-9c57-80088ba23e30",
        "serviceRequestId": "NB.GEN.PDT.ELIG",
        "serviceRequestVersion": "1.0",
        "channelId": "TEST"
      },
      "CheckVPAAvailibilityResponseBody": {
        "code": "00",
        "result": "Success",
        "data": {
          "mobilenumber": "919010852345",
          "vpa": [
            "olive@axis",
            "richa@axis"
          ]
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
| 1 | 00 | Success | Successfully checked VPA availability |
| 2 | 01 | No records found | No records found for the given parameters |
| 90 | 90 | Invalid Input | Invalid input parameters |
| 91 | 91 | Backend Failure | Backend system error |

## Response Structure

### CheckVPAAvailibilityResponseBody.data Object

| Property | Type | Description |
|----------|------|-------------|
| mobilenumber | String | Customer's mobile number |
| vpa | Array | List of available VPAs |

## Example Usage

### Node.js Example

```javascript
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// Generate a request UUID
const requestUUID = uuidv4();

// Make API request
axios({
  method: 'GET',
  url: 'http://your-api-endpoint/api/axis/upi/vpa-availability',
  headers: {
    'X-IBM-Client-Id': 'your-client-id',
    'X-IBM-Client-Secret': 'your-client-secret',
    'X-AXIS-TEST-ID': '1',
    'X-AXIS-serviceRequestId': 'NB.GEN.PDT.ELIG',
    'X-AXIS-serviceRequestVersion': '1.0',
    'X-AXIS-channelId': 'TEST',
    'X-Axis-requestUUID': requestUUID,
    'Accept': 'application/json'
  },
  params: {
    customerId: '9087654321',
    vpa: 'testuser@axis',
    applicationID: 'com.fintech.upi'
  }
})
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });
``` 