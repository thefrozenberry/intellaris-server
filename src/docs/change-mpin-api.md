# UPI Change MPIN API

This document provides details about the UPI Change MPIN API endpoint.

## Endpoint

```
POST /api/transactions/v1/changempin
```

## Description

This API allows users to change their UPI MPIN (Mobile PIN) used for UPI transactions. The MPIN is a 4-6 digit PIN that serves as an authentication factor for UPI transactions.

## Request Headers

| Header          | Type   | Description                                            | Required |
|-----------------|--------|--------------------------------------------------------|----------|
| X-AXIS-TEST-ID  | String | Test ID to simulate different response scenarios (1-5) | Yes      |
| Content-Type    | String | Application/json                                       | Yes      |

## Request Body

```json
{
  "ChangeMPINRequest": {
    "SubHeader": {
      "requestUUID": "string",
      "serviceRequestId": "string",
      "serviceRequestVersion": "string",
      "channelId": "string"
    },
    "SetResetMPINRequestBody": {
      "customerId": "string",
      "bank": "string",
      "txnId": "string",
      "ac": {
        "accRefNumber": "string",
        "name": "string",
        "ifsc": "string",
        "maskedAccnumber": "string",
        "status": "string",
        "type": "string",
        "vpa": "string",
        "aeba": "string"
      },
      "cred": {
        "type": "string",
        "subType": "string",
        "data": {
          "code": "string"
        }
      },
      "newcred": {
        "type": "string",
        "subType": "string",
        "data": {
          "code": "string"
        }
      },
      "device": {
        "app": "string",
        "capability": "string",
        "geocode": "string",
        "id": "string",
        "ip": "string",
        "location": "string",
        "mobile": "string",
        "os": "string",
        "type": "string"
      }
    }
  }
}
```

### Field Descriptions

| Field                                        | Type   | Description                                     | Required |
|----------------------------------------------|--------|-------------------------------------------------|----------|
| ChangeMPINRequest                            | Object | Root object                                     | Yes      |
| ChangeMPINRequest.SubHeader                  | Object | Contains request header information             | Yes      |
| ChangeMPINRequest.SubHeader.requestUUID      | String | Unique request identifier                       | Yes      |
| ChangeMPINRequest.SubHeader.serviceRequestId | String | Service request ID (e.g., NB.GEN.UPIAPI.CHANGEMPIN) | Yes      |
| ChangeMPINRequest.SubHeader.serviceRequestVersion | String | Service request version                   | Yes      |
| ChangeMPINRequest.SubHeader.channelId        | String | Channel ID (e.g., MOBILE, NET, etc.)           | Yes      |
| ChangeMPINRequest.SetResetMPINRequestBody    | Object | Contains details for MPIN change                | Yes      |
| ChangeMPINRequest.SetResetMPINRequestBody.customerId | String | Unique customer ID                      | Yes      |
| ChangeMPINRequest.SetResetMPINRequestBody.bank | String | Bank ID (e.g., AXIS)                         | Yes      |
| ChangeMPINRequest.SetResetMPINRequestBody.txnId | String | Unique transaction ID                       | Yes      |
| ChangeMPINRequest.SetResetMPINRequestBody.ac | Object | Account details                                | Yes      |
| ChangeMPINRequest.SetResetMPINRequestBody.ac.accRefNumber | String | Account reference number          | Yes      |
| ChangeMPINRequest.SetResetMPINRequestBody.ac.name | String | Account holder name                        | Yes      |
| ChangeMPINRequest.SetResetMPINRequestBody.ac.ifsc | String | IFSC code of the bank                     | Yes      |
| ChangeMPINRequest.SetResetMPINRequestBody.ac.maskedAccnumber | String | Masked account number          | Yes      |
| ChangeMPINRequest.SetResetMPINRequestBody.ac.status | String | Account status                          | Yes      |
| ChangeMPINRequest.SetResetMPINRequestBody.ac.type | String | Account type                              | Yes      |
| ChangeMPINRequest.SetResetMPINRequestBody.ac.vpa | String | Virtual Payment Address                    | Yes      |
| ChangeMPINRequest.SetResetMPINRequestBody.ac.aeba | String | AEBA flag (Y/N)                           | Yes      |
| ChangeMPINRequest.SetResetMPINRequestBody.cred | Object | Existing MPIN credentials                   | Yes      |
| ChangeMPINRequest.SetResetMPINRequestBody.cred.type | String | Credential type (e.g., PIN)             | Yes      |
| ChangeMPINRequest.SetResetMPINRequestBody.cred.subType | String | Credential subtype (e.g., MPIN)      | Yes      |
| ChangeMPINRequest.SetResetMPINRequestBody.cred.data | Object | Credential data                         | Yes      |
| ChangeMPINRequest.SetResetMPINRequestBody.cred.data.code | String | Current MPIN (encrypted)           | Yes      |
| ChangeMPINRequest.SetResetMPINRequestBody.newcred | Object | New MPIN credentials                      | Yes      |
| ChangeMPINRequest.SetResetMPINRequestBody.newcred.type | String | Credential type (e.g., PIN)          | Yes      |
| ChangeMPINRequest.SetResetMPINRequestBody.newcred.subType | String | Credential subtype (e.g., MPIN)   | Yes      |
| ChangeMPINRequest.SetResetMPINRequestBody.newcred.data | Object | Credential data                      | Yes      |
| ChangeMPINRequest.SetResetMPINRequestBody.newcred.data.code | String | New MPIN (encrypted)            | Yes      |
| ChangeMPINRequest.SetResetMPINRequestBody.device | Object | Device information                        | Yes      |

## Response Body (Success)

```json
{
  "SubHeader": {
    "responseUUID": "string",
    "serviceResponseId": "string",
    "serviceResponseVersion": "string",
    "channelId": "string"
  },
  "SetResetMPINResponseBody": {
    "code": "00",
    "status": "Success",
    "data": "base64EncodedString"
  }
}
```

### Decoded Data (Success)

```json
{
  "txnId": "string",
  "customerId": "string",
  "bank": "string",
  "account": {
    "accRefNumber": "string",
    "name": "string",
    "vpa": "string"
  },
  "status": "MPIN_CHANGED",
  "timestamp": "string",
  "message": "UPI MPIN has been changed successfully"
}
```

## Error Scenarios

### 1. Incorrect Old MPIN (Test ID: 2)

```json
{
  "message": "Incorrect old MPIN",
  "error": {
    "errors": [
      {
        "errorCode": "E40101",
        "errorMessage": "Incorrect old MPIN",
        "errorDescription": "The old MPIN provided is incorrect"
      }
    ]
  },
  "statusCode": 401
}
```

### 2. Invalid Input Parameters (Test ID: 3)

```json
{
  "message": "Invalid input parameters",
  "error": {
    "errors": [
      {
        "errorCode": "E40001",
        "errorMessage": "Mandatory field missing",
        "errorDescription": "One or more mandatory fields are missing or invalid"
      }
    ]
  },
  "statusCode": 400
}
```

### 3. MPIN Validation Failure (Test ID: 4)

```json
{
  "message": "MPIN validation failed",
  "error": {
    "errors": [
      {
        "errorCode": "E40004",
        "errorMessage": "MPIN validation failed",
        "errorDescription": "New MPIN does not meet security requirements"
      }
    ]
  },
  "statusCode": 400
}
```

### 4. Invalid Test ID (Test ID: 5 or any other unsupported value)

```json
{
  "message": "Invalid test ID",
  "error": {
    "errors": [
      {
        "errorCode": "E40002",
        "errorMessage": "Invalid test ID",
        "errorDescription": "The provided test ID is not supported"
      }
    ]
  },
  "statusCode": 400
}
```

## MPIN Requirements

- MPIN must be 4-6 digits
- MPIN should not be sequential (e.g., 1234, 4321)
- MPIN should not contain repeating numbers (e.g., 1111)
- MPIN should not be the same as the last 3 previously used MPINs
- MPIN should not contain the user's date of birth

## Test IDs

| Test ID | Scenario Description          |
|---------|-------------------------------|
| 1       | Successful MPIN change        |
| 2       | Incorrect old MPIN error      |
| 3       | Invalid input parameters error|
| 4       | MPIN validation failure error |
| 5+      | Invalid test ID error         |

## Sample Request

```json
{
  "ChangeMPINRequest": {
    "SubHeader": {
      "requestUUID": "req-1621234567890-123",
      "serviceRequestId": "NB.GEN.UPIAPI.CHANGEMPIN",
      "serviceRequestVersion": "1.0",
      "channelId": "TEST"
    },
    "SetResetMPINRequestBody": {
      "customerId": "CIF12345678",
      "bank": "AXIS",
      "txnId": "TXN1621234567890",
      "ac": {
        "accRefNumber": "ACC123456789",
        "name": "John Doe",
        "ifsc": "AXIS0000001",
        "maskedAccnumber": "*****6789",
        "status": "ACTIVE",
        "type": "SAVINGS",
        "vpa": "johndoe@axis",
        "aeba": "N"
      },
      "cred": {
        "type": "PIN",
        "subType": "MPIN",
        "data": {
          "code": "1234"
        }
      },
      "newcred": {
        "type": "PIN",
        "subType": "MPIN",
        "data": {
          "code": "5678"
        }
      },
      "device": {
        "app": "AXISBANK",
        "capability": "5200000200010004000639292929292",
        "geocode": "28.613939,77.209021",
        "id": "DCAD28A8A1AB48F99BBCA425B0912ECD",
        "ip": "192.168.1.1",
        "location": "Delhi",
        "mobile": "918888888888",
        "os": "Android",
        "type": "MOB"
      }
    }
  }
} 