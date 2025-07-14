# Axis Bank UPI Set/Reset MPIN API

This endpoint is used to set or reset the MPIN (Mobile Personal Identification Number) of a selected bank account. MPIN is used for transaction authorization in UPI payments.

## API Details

**Endpoint:** `POST /api/axis/upi/set-reset-mpin`

**Description:** Set or reset the MPIN for a selected bank account through Axis Bank UPI service.

## Request Parameters

### Headers

| Header | Type | Required | Description |
|--------|------|----------|-------------|
| X-IBM-Client-Id | String | Yes | Client ID from API keys shared by Axis Bank |
| X-IBM-Client-Secret | String | Yes | Client Secret from API keys shared by Axis Bank |
| X-AXIS-TEST-ID | String | Yes | Test ID to simulate different response conditions (1=Success, 3=Customer Accounts not found, others=Invalid Test ID) |
| Content-Type | String | No | Request content type (application/json) |
| Accept | String | No | Response content type (application/json) |

### Request Body

```json
{
  "SetResetMPINRequest": {
    "SubHeader": {
      "requestUUID": "97f6b07e-b82d-4fed-9c57-80088ba23e30",
      "serviceRequestId": "NB.GEN.PDT.ELIG",
      "serviceRequestVersion": "1.0",
      "channelId": "TEST"
    },
    "SetResetMPINRequestBody": {
      "customerid": "918096449293",
      "bank": "607290",
      "card": "123456",
      "ac": {
        "name": "Test User",
        "mmid": "",
        "aeba": "N",
        "mbeba": "Y",
        "accRefNumber": "22200011",
        "ifsc": "AXIS0000002",
        "maskedAccnumber": "******200011",
        "status": "A",
        "type": "SAVINGS",
        "vpa": "testuser@axis",
        "dLength": "6",
        "dType": "NUM",
        "iin": "AXIS141",
        "uidnum": "123512341235"
      },
      "device": {
        "app": "com.olive.axis.upi.debug",
        "capability": "",
        "gcmid": "",
        "geocode": "37.423021,-122.083739",
        "id": "358096052312150",
        "ip": "10.10.20.160",
        "location": "Hyderabad",
        "mobile": "918096449293",
        "os": "Android",
        "type": "C1904",
        "telecom": "Airtel",
        "version": "4.3",
        "deviceName": "SAMSUNG M8"
      },
      "expiry": "05/2026",
      "mpincred": {
        "data": {
          "code": "string",
          "ki": "string",
          "skey": "skey",
          "type": "type",
          "pid": "pid",
          "hmac": "hmac",
          "encryptedBase64String": "encryptedBase64String"
        },
        "subType": "string",
        "type": "string"
      },
      "otpcred": {
        "data": {
          "code": "string",
          "ki": "string",
          "skey": "skey",
          "type": "type",
          "pid": "pid",
          "hmac": "hmac",
          "encryptedBase64String": "encryptedBase64String"
        },
        "subType": "string",
        "type": "string"
      },
      "atmpincred": {
        "data": {
          "code": "string",
          "ki": "string",
          "skey": "skey",
          "type": "type",
          "pid": "pid",
          "hmac": "hmac",
          "encryptedBase64String": "encryptedBase64String"
        },
        "subType": "string",
        "type": "string"
      },
      "regtype": "string",
      "txnId": "TXN12345678"
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

#### SetResetMPINRequestBody Object

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| customerid | String | Yes | Unique identifier of the customer |
| bank | String | No | Bank code or identifier |
| card | String | Yes | Debit card number (last 6 digits) |
| ac | Object | No | Account information details |
| device | Object | No | Device information details |
| expiry | String | Yes | Card expiry date (MM/YYYY) |
| mpincred | Object | No | MPIN credential details |
| otpcred | Object | No | OTP credential details |
| atmpincred | Object | No | ATM PIN credential details |
| regtype | String | No | Registration type |
| txnId | String | Yes | Transaction ID |

#### Account (ac) Object

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| name | String | Yes | Account holder name |
| ifsc | String | Yes | Bank IFSC code |
| maskedAccnumber | String | Yes | Masked account number |
| status | String | Yes | Account status (A = Active) |
| vpa | String | Yes | Virtual Payment Address |
| type | String | Yes | Account type (SAVINGS, CURRENT) |
| accRefNumber | String | Yes | Account reference number |
| aeba | String | Yes | AEBA flag (Y/N) |
| iin | String | Yes | Institution Identification Number |
| mmid | String | No | Mobile Money Identifier |
| mbeba | String | No | MBEBA flag (Y/N) |
| dLength | String | No | MPIN length constraint |
| dType | String | No | MPIN type constraint (e.g., NUM) |
| uidnum | String | No | Aadhaar number (UID) |

#### Device Object

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| app | String | No | Application identifier |
| capability | String | No | Device capability |
| id | String | No | Device ID (IMEI) |
| ip | String | No | Device IP address |
| location | String | No | Device location |
| mobile | String | No | Mobile number |
| os | String | No | Operating system |
| type | String | No | Device type |
| telecom | String | No | Telecom provider |
| version | String | No | OS/App version |
| deviceName | String | No | Device name |
| gcmid | String | No | GCM ID for push notification |
| geocode | String | No | Geocode coordinates |

#### Credential Objects (mpincred, otpcred, atmpincred)

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| data | Object | Yes | Credential data object |
| subType | String | No | Credential sub-type |
| type | String | No | Credential type |

#### Credential Data Object

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| code | String | No | Credential code |
| ki | String | No | Key identifier |
| skey | String | No | Session key |
| type | String | No | Credential data type |
| pid | String | No | Provider ID |
| hmac | String | No | HMAC value |
| encryptedBase64String | String | No | Encrypted data in Base64 format |

## Response

### Success Response (Status 200)

```json
{
  "status": "success",
  "message": "MPIN set/reset successfully with Axis Bank UPI",
  "data": {
    "SubHeader": {
      "requestUUID": "97f6b07e-b82d-4fed-9c57-80088ba23e30",
      "serviceRequestId": "NB.GEN.PDT.ELIG",
      "serviceRequestVersion": "1.0",
      "channelId": "TEST"
    },
    "SetResetMPINResponseBody": {
      "code": "00",
      "Status": "Success"
    }
  }
}
```

### Customer Accounts Not Found Response (Status 200)

```json
{
  "status": "success",
  "message": "MPIN set/reset successfully with Axis Bank UPI",
  "data": {
    "SubHeader": {
      "requestUUID": "97f6b07e-b82d-4fed-9c57-80088ba23e30",
      "serviceRequestId": "NB.GEN.PDT.ELIG",
      "serviceRequestVersion": "1.0",
      "channelId": "TEST"
    },
    "SetResetMPINResponseBody": {
      "code": "01",
      "Status": "Customer Accounts Not Found"
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

| X-AXIS-TEST-ID | Code | Status | Description |
|----------------|------|--------|-------------|
| 1 | 00 | Success | MPIN set/reset successfully |
| 3 | 01 | Customer Accounts Not Found | No customer accounts found |
| Others | 99 | Invalid Test ID | Invalid test ID provided |

## Example Usage

### Node.js Example

```javascript
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// Generate a request UUID
const requestUUID = uuidv4();

// Create the request payload
const payload = {
  SetResetMPINRequest: {
    SubHeader: {
      requestUUID: requestUUID,
      serviceRequestId: "NB.GEN.PDT.ELIG",
      serviceRequestVersion: "1.0",
      channelId: "TEST"
    },
    SetResetMPINRequestBody: {
      customerid: "918096449293",
      bank: "607290",
      card: "123456",
      ac: {
        name: "Test User",
        mmid: "",
        aeba: "N",
        mbeba: "Y",
        accRefNumber: "22200011",
        ifsc: "AXIS0000002",
        maskedAccnumber: "******200011",
        status: "A",
        type: "SAVINGS",
        vpa: "testuser@axis",
        dLength: "6",
        dType: "NUM",
        iin: "AXIS141",
        uidnum: "123512341235"
      },
      device: {
        app: "com.olive.axis.upi.debug",
        capability: "",
        geocode: "37.423021,-122.083739",
        id: "358096052312150",
        ip: "10.10.20.160",
        location: "Hyderabad",
        mobile: "918096449293",
        os: "Android",
        type: "C1904",
        telecom: "Airtel",
        version: "4.3",
        deviceName: "SAMSUNG M8"
      },
      expiry: "05/2026",
      mpincred: {
        data: {
          encryptedBase64String: "encryptedBase64String"
        },
        type: "string"
      },
      txnId: "TXN" + Date.now()
    }
  }
};

// Make API request
axios({
  method: 'POST',
  url: 'http://your-api-endpoint/api/axis/upi/set-reset-mpin',
  headers: {
    'X-IBM-Client-Id': 'your-client-id',
    'X-IBM-Client-Secret': 'your-client-secret',
    'X-AXIS-TEST-ID': '1', // 1=Success, 3=Customer Accounts not found
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