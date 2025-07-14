# UPI Customer De-Registration API

This document provides details about the UPI Customer De-Registration API endpoint.

## Endpoint

```
GET /api/transactions/v2/customer-dergistration
```

## Description

This API allows users to de-register from UPI services. The de-registration process removes the user's UPI profile from the system.

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
| customerId    | String | Unique Customer ID     | No       |
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
  "CustomerDeregistrationResponseBody": {
    "code": "00",
    "result": "Success",
    "data": "Successfuly De-Registered"
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
        "errorDescription": "Customer ID or Application ID is required"
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
| 1       | Successful de-registration    |
| 3       | Invalid input parameters error|
| Other   | Invalid test ID error         |

## Sample Request

```
GET /api/transactions/v2/customer-dergistration?customerId=CIF12345678&applicationId=AXISAPP001

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
  "CustomerDeregistrationResponseBody": {
    "code": "00",
    "result": "Success",
    "data": "Successfuly De-Registered"
  }
}
```

## Use Cases

1. User wants to stop using UPI services
2. User wants to change their UPI provider
3. User wants to migrate to a different bank
4. Account closure
5. Security concerns requiring account reset

## Notes

- The de-registration process is permanent and cannot be undone
- To use UPI services again, the customer will need to re-register with a new registration process
- Any pending transactions will be affected by de-registration and may be cancelled
- All linked accounts and VPAs will be de-linked from UPI during de-registration 