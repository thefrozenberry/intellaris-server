# Upstash Redis REST API Reference

This document provides a reference for using the Upstash Redis REST API with our fintech authentication backend.

## Authentication

Upstash REST API requires a Bearer token:

```
Authorization: Bearer YOUR_UPSTASH_TOKEN
```

## API Endpoints

### PING - Check Connection

```
GET /ping
```

**Response:**
```json
{
  "result": "PONG"
}
```

### SET - Store a Value

```
POST /set/{key}
```

**Body:** Send the value directly in the request body without wrapping it in an object.

**Example:**
```
POST /set/mykey
Content-Type: application/json

"my value"
```

**Response:**
```json
{
  "result": "OK"
}
```

### GET - Retrieve a Value

```
GET /get/{key}
```

**Response:**
```json
{
  "result": "my value"
}
```

**Note:** The API returns the value as-is, which may include quotes if the value was a string.

### DEL - Delete a Key

```
GET /del/{key}
```

**Response:**
```json
{
  "result": 1
}
```

**Note:** The Upstash API uses GET (not DELETE) for the Redis DEL command.

### EXPIRE - Set Expiration Time

```
POST /expire/{key}/{seconds}
```

**Response:**
```json
{
  "result": 1
}
```

**Note:** The expiration time is specified in the URL path, not in the request body.

## Special Considerations

1. **String Handling:** Redis strings are returned with quotes that must be stripped for proper handling.

2. **HTTP Methods:** Upstash REST API deviates from RESTful convention by using GET for DELETE operations.

3. **Error Handling:** The API returns detailed error messages in the response body, with appropriate HTTP status codes.

## Testing

Use the `scripts/test-upstash.js` script to test your Upstash Redis connection:

```bash
node scripts/test-upstash.js
```

## Debugging

When troubleshooting Upstash Redis issues:

1. Check the raw response format from Upstash
2. Ensure quotes are handled properly for string values
3. Verify you're using the correct HTTP method for each Redis command 