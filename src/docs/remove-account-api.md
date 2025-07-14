# UPI Remove Accounts API

This document provides details about the UPI Remove Accounts API endpoint.

## Endpoint

```
GET /api/transactions/v4/account/remove
```

## Description

This API allows users to remove an account from their UPI profile. The account removal process removes the specific bank account from the user's UPI-linked accounts.

## Request Headers

| Header                    | Type   | Description                                            | Required |
|---------------------------|--------|--------------------------------------------------------|----------|
| X-AXIS-TEST-ID            | String | Test ID to simulate different response scenarios (1, 3)| Yes      |
| X-AXIS-serviceRequestId   | String | Service request ID                                     | No       |
| X-AXIS-serviceRequestVersion | String | Service request version                            | No       |
| X-AXIS-channelId          | String | Channel ID                                            | No       |
| X-Axis-requestUUID        | String | Unique request identifier                             | No       |
| Content-Type              | String | Application/json                                       | No       |
| Accept                    | String | Application/json                                       | No       |

## Query Parameters

| Parameter     | Type   | Description            | Required |
|---------------|--------|------------------------|----------|
| customerId    | String | Unique Customer ID     | Yes      |
| accountNumber | String | Account number to be removed | No   |
| applicationId | String | Application ID         | No       |

## Response Body (Success)

```json
{
  "SubHeader": {
    "requestUUID": "97f6b07e-b82d-4fed-9c57-80088ba23e30",
    "serviceRequestId": "NB.GEN.PDT.ELIG",
    "serviceRequestVersion": "1.0",
    "channelId": "TEST"
  },
  "RemoveAccountReponseBody": {
    "code": "00",
    "Status": "Success"
  }
}
```

## Error Scenarios

### 1. Invalid Input Parameters (Test ID: 3)

```json
{
  "message": "Invalid input parameters",
  "error": {
    "errors": [
      {
        "errorCode": "E40001",
        "errorMessage": "Mandatory field missing",
        "errorDescription": "Customer ID is required"
      }
    ]
  },
  "statusCode": 400
}
```

### 2. Invalid Test ID (Test ID: other than 1 or 3)

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

## Test IDs

| Test ID | Scenario Description          |
|---------|-------------------------------|
| 1       | Successful account removal    |
| 3       | Invalid input parameters error|
| Other   | Invalid test ID error         |

## Sample Request

```
GET /api/transactions/v4/account/remove?customerId=CIF12345678&accountNumber=9876543210&applicationId=AXISAPP001

Headers:
X-AXIS-TEST-ID: 1
X-AXIS-serviceRequestId: NB.GEN.PDT.ELIG
X-AXIS-serviceRequestVersion: 1.0
X-AXIS-channelId: TEST
X-Axis-requestUUID: 97f6b07e-b82d-4fed-9c57-80088ba23e30
```

## Sample Response

```json
{
  "SubHeader": {
    "requestUUID": "97f6b07e-b82d-4fed-9c57-80088ba23e30",
    "serviceRequestId": "NB.GEN.PDT.ELIG",
    "serviceRequestVersion": "1.0",
    "channelId": "TEST"
  },
  "RemoveAccountReponseBody": {
    "code": "00",
    "Status": "Success"
  }
}
```

## Use Cases

1. User wants to remove a specific bank account from their UPI profile
2. User has closed a bank account and wants to remove it from UPI
3. User wants to manage which accounts are linked to UPI
4. User wants to remove an account for security reasons

## Notes

- Removing an account does not affect the actual bank account
- Only the link between UPI and the specific bank account is removed
- The customer can re-add the account to UPI in the future if needed
- Any pending transactions associated with the removed account may be affected
- If a default account is removed, another account will be set as default automatically 