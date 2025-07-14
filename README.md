# Fintech Backend Server

A production-grade fintech backend built with Node.js, Express, and PostgreSQL, featuring a secure OTP-based authentication system.

## Features

- **OTP-Based Authentication**: Secure login with mobile number + OTP verification
- **JWT Authentication**: Access and refresh tokens for secure API access
- **Rate Limiting**: Protects against brute force attacks
- **Redis Integration**: Fast OTP storage with automatic expiration
- **PostgreSQL Database**: Stores user information and refresh tokens
- **Prisma ORM**: Type-safe database access
- **Error Handling**: Comprehensive error handling throughout the application

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables by copying `.env.sample` to `.env` and filling in your values
4. Run database migrations:
   ```
   npx prisma migrate dev
   ```
5. Start the server:
   ```
   npm run dev
   ```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | Environment (`development`, `production`) |
| `PORT` | Server port |
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection URL (with TLS for Upstash) |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST API URL |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST API token |
| `JWT_ACCESS_SECRET` | Secret for signing access tokens |
| `JWT_ACCESS_EXPIRY` | Access token expiry (e.g., `15m`) |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens |
| `JWT_REFRESH_EXPIRY` | Refresh token expiry (e.g., `7d`) |

## API Endpoints

### Authentication

#### Request OTP

```
POST /api/auth/request-otp
```

**Request Body:**
```json
{
  "mobile": "1234567890"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "OTP sent successfully",
  "data": {
    "mobile": "1234567890"
  }
}
```

**Rate Limit:** 5 requests per minute per mobile/IP

#### Verify OTP

```
POST /api/auth/verify-otp
```

**Request Body:**
```json
{
  "mobile": "1234567890",
  "otp": "123456"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Authentication successful",
  "data": {
    "accessToken": "jwt-token",
    "refreshToken": "refresh-token",
    "user": {
      "id": "uuid",
      "mobile": "1234567890"
    }
  }
}
```

**Rate Limit:** 10 verification attempts per minute per mobile/IP

#### Refresh Token

```
POST /api/auth/refresh-token
```

**Request Body:**
```json
{
  "refreshToken": "your-refresh-token"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "new-jwt-token"
  }
}
```

#### Logout

```
POST /api/auth/logout
```

**Request Body:**
```json
{
  "refreshToken": "your-refresh-token"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

### Axis Bank APIs

#### UPI Customer Registration

```
POST /api/axis/upi/register
```

**Request Body:**
```json
{
  "name": "Customer Name",
  "mobileNumber": "9999999999",
  "vpa": "customer@upi",
  "type": "Customer",
  "deviceInfo": {
    "app": "AppName",
    "os": "Android",
    "mobile": "9999999999",
    "geocode": "12.9716,77.5946",
    "location": "Bangalore",
    "ip": "192.168.1.1"
  }
}
```

#### UPI OTP Request

```
POST /api/axis/upi/otp/request
```

**Request Body:**
```json
{
  "mobileNumber": "9999999999",
  "customerId": "1234567890",
  "bankId": "AXIS",
  "txnId": "TXN123456789"
}
```

#### UPI Fetch Customer Accounts

```
POST /api/axis/upi/accounts/fetch
```

**Request Body:**
```json
{
  "FetchCustomerAccountsRequest": {
    "SubHeader": {
      "requestUUID": "UUID-123456",
      "serviceRequestId": "SRI-123456",
      "serviceRequestVersion": "1.0",
      "channelId": "MOBILE"
    },
    "FetchCustomerAccountsRequestBody": {
      "customerId": "1234567890",
      "device": {
        "mobile": "9999999999"
      }
    }
  }
}
```

#### UPI Get Token

```
GET /api/axis/upi/get-token
```

**Headers:**
```
X-IBM-Client-Id: your-client-id
X-IBM-Client-Secret: your-client-secret
X-AXIS-TEST-ID: 1
X-AXIS-serviceRequestId: NB.GEN.PDT.ELIG
X-AXIS-serviceRequestVersion: 1.0
X-AXIS-channelId: TEST
X-Axis-requestUUID: unique-request-uuid
```

**Query Parameters:**
```
customerId=customer123
type=INITIAL
challenge=deviceId|appId|mobileNumber|randomChallenge
```

**Response:**
```json
{
  "status": "success",
  "message": "Token fetched successfully from Axis Bank",
  "data": {
    "GetTokenResponse": {
      "SubHeader": {
        "requestUUID": "unique-request-uuid",
        "serviceRequestId": "NB.GEN.PDT.ELIG",
        "serviceRequestVersion": "1.0",
        "channelId": "TEST"
      },
      "GetTokenResponseBody": {
        "code": "00",
        "result": "success",
        "data": "base64-encoded-token-string"
      }
    }
  }
}
```

#### UPI Set VPA

```
POST /api/axis/upi/set-vpa
```

**Headers:**
```
X-IBM-Client-Id: your-client-id
X-IBM-Client-Secret: your-client-secret
X-AXIS-TEST-ID: 1
```

**Request Body:**
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
        "customerid": "9087654321",
        "defaultvpa": "Y",
        "ifsc": "AXIS0001234",
        "newvpa": "testuser@axis",
        "oldvpa": "olduser@axis"
      }
    ]
  }
}
```

**Response:**
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

#### UPI VPA Availability

```
GET /api/axis/upi/vpa-availability
```

**Headers:**
```
X-IBM-Client-Id: your-client-id
X-IBM-Client-Secret: your-client-secret
X-AXIS-TEST-ID: 1
X-AXIS-serviceRequestId: NB.GEN.PDT.ELIG
X-AXIS-serviceRequestVersion: 1.0
X-AXIS-channelId: TEST
X-Axis-requestUUID: unique-request-uuid
```

**Query Parameters:**
```
customerId=9087654321
vpa=testuser@axis
applicationID=com.fintech.upi
```

**Response:**
```json
{
  "status": "success",
  "message": "VPA availability checked successfully with Axis Bank UPI",
  "data": {
    "CheckVPAAvailibilityResponse": {
      "SubHeader": {
        "requestUUID": "unique-request-uuid",
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
            "user1@axis",
            "user2@axis"
          ]
        }
      }
    }
  }
}
```

#### UPI Verify VPA

```
POST /api/axis/upi/verify-vpa
```

**Headers:**
```
X-IBM-Client-Id: your-client-id
X-IBM-Client-Secret: your-client-secret
X-AXIS-TEST-ID: 1
```

**Request Body:**
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
    "vpa": "testuser@axis",
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

**Response:**
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

For more detailed information about these APIs, see:
- [Axis Bank Get Token API Reference](docs/api_endpoints/axis_bank_get_token.md)
- [Axis Bank Set VPA API Reference](docs/api_endpoints/axis_bank_set_vpa.md)
- [Axis Bank VPA Availability API Reference](docs/api_endpoints/axis_bank_vpa_availability.md)
- [Axis Bank Verify VPA API Reference](docs/api_endpoints/axis_bank_verify_vpa.md)

## Redis Integration

This application supports two methods of connecting to Redis:

1. **Standard Redis Connection**: Using `ioredis` with the `REDIS_URL` environment variable
2. **Upstash REST API**: Using the Upstash REST API for serverless environments

### Upstash Redis REST API Integration

The application includes a dedicated client for Upstash Redis REST API. To use it:

1. Set the environment variables:
   ```
   UPSTASH_REDIS_REST_URL=https://your-upstash-instance.upstash.io
   UPSTASH_REDIS_REST_TOKEN=your-upstash-token
   ```

2. The application will automatically use the REST API client for OTP storage.

3. If using Upstash with the standard Redis protocol, ensure you use the TLS URL format:
   ```
   REDIS_URL=rediss://default:password@your-upstash-instance.upstash.io:6379
   ```

For detailed information about the Upstash REST API implementation, see [Upstash REST API Reference](docs/upstash-rest-api-reference.md).

## Development

In development mode, the application will fall back to an in-memory OTP store if Redis is unavailable. This helps with development when you don't have Redis installed locally.

## Testing Redis Connection

To test your Redis connection:

```
node scripts/test-upstash.js
```

This script will verify connectivity with your Upstash Redis instance and test basic operations

## License

[License information]

## Contact

[Contact information]

## Available APIs

### Axis Bank UPI APIs

1. **UPI Fetch Token**
   - Endpoint: `GET /api/axis/upi/get-token`
   - Description: Retrieve token for UPI Payment Service Provider Switch

2. **UPI Set VPA**
   - Endpoint: `POST /api/axis/upi/set-vpa`
   - Description: Set a Virtual Payment Address (VPA) for UPI

3. **UPI VPA Availability**
   - Endpoint: `GET /api/axis/upi/vpa-availability`
   - Description: Check availability of a Virtual Payment Address (VPA)

4. **UPI Verify VPA**
   - Endpoint: `POST /api/axis/upi/verify-vpa`
   - Description: Verify a Virtual Payment Address (VPA) for both P2P and P2M

5. **UPI Set/Reset MPIN**
   - Endpoint: `POST /api/axis/upi/set-reset-mpin`
   - Description: Set or reset MPIN for a selected bank account 