# Axis Bank UPI Integration

This document outlines the integration with Axis Bank's UPI payment services in our fintech application.

## Overview

Axis Bank acts as our Payment Service Provider (PSP) for UPI-based transactions. The integration allows our application to register customers with Axis Bank's UPI service.

## API Endpoints

### UPI Customer Registration

**Endpoint:** `POST /api/axis/upi/register`

This endpoint registers a customer with Axis Bank's UPI service.

#### Request Format

```json
{
  "name": "John Doe",
  "mobileNumber": "9185558889999",
  "vpa": "johndoe@axis",
  "type": "Customer",
  "deviceInfo": {
    "app": "com.fintech.upi",
    "capacity": "",
    "gcmid": "777566645666abhgedd",
    "geocode": "37.423021,-122.083739",
    "id": "",
    "ip": "10.10.20.160",
    "location": "Mumbai",
    "mobile": "9185558889999",
    "os": "Android 12",
    "type": "SM-A526B",
    "version": "1.0",
    "telecom": "Airtel"
  }
}
```

#### Query Parameters

- `testId` (optional): Test ID for simulating different response scenarios from Axis Bank.
  - `1`: Success
  - `2`: No records found
  - `90`: Invalid Input
  - `91`: Backend Failure

#### Response Format (Success)

```json
{
  "success": true,
  "status": 200,
  "message": "Customer registered successfully with Axis Bank UPI",
  "data": {
    "CustomerRegistrationResponse": {
      "SubHeader": {
        "requestUUID": "97f6b07e-b82d-4fed-9c57-80088ba23e30",
        "serviceRequestId": "NB.GEN.JDT",
        "serviceRequestVersion": "1.0",
        "channelId": "TEST"
      },
      "CustomerRegistrationResponseBody": {
        "code": "00",
        "result": "Success",
        "data": {
          "name": "John Doe",
          "mobileNumbe": "9185558889999",
          "Type": "Customer",
          "deviceInfo": {
            "app": "com.fintech.upi",
            "capacity": "",
            "gcmid": "777566645666abhgedd",
            "geocode": "37.423021,-122.083739",
            "id": "",
            "ip": "10.10.20.160",
            "location": "Mumbai",
            "mobile": "9185558889999",
            "os": "Android 12",
            "type": "SM-A526B",
            "version": "1.0",
            "telecom": "Airtel"
          }
        }
      }
    }
  }
}
```

#### Response Format (Error)

```json
{
  "success": false,
  "status": 400,
  "message": "Failed to register customer with Axis Bank",
  "error": {
    "code": "90",
    "result": "Invalid Input",
    "message": "The request contains invalid data"
  }
}
```

## Testing the Integration

For testing purposes, you can use the `testId` query parameter to simulate different response scenarios:

1. Success Response: `/api/axis/upi/register?testId=1`
2. No Records Found: `/api/axis/upi/register?testId=2`
3. Invalid Input: `/api/axis/upi/register?testId=90`
4. Backend Failure: `/api/axis/upi/register?testId=91`

## Security

The integration uses the following security mechanisms:

1. **Client Authentication**: 
   - Client ID: Sent in the `X-IBM-Client-Id` header
   - Client Secret: Sent in the `X-IBM-Client-Secret` header

2. **HTTPS**: All communications are secured using HTTPS

3. **Environment Variables**: API credentials are stored in environment variables, not hardcoded in the application

## Production vs Development

The API is available in both production and development environments at:
`https://apiportal.axisbank.com/gateway/openapi/v2/upi/customerregistration/customer-registration` 