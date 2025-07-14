# API Access Documentation

## Access Requirements

All API endpoints under `/api/*` routes are protected with access control headers. To access these endpoints, you must include the following HTTP headers with every request:

| Header Name        | Required Value                           | Description                    |
|--------------------|------------------------------------------|--------------------------------|
| `x-api-password`   | `Ripun54321@#`                           | Password for API access        |
| `x-access-code`    | `RIPUN-ACCESS-V1`                        | Access code for API validation |
| `x-api-client-id`      | `ripun_7f3b2c9d-84a1-4dcb-90e6-fb17e16ab3da`                | Client ID for API access       |
| `x-api-secret-id`  | `cb85fc11-9ab6-4e52-bd0a-64c9b15166f2`   | Secret key for API validation  |

## Example API Request

### Using cURL

```bash
curl -X POST http://localhost:5000/api/auth/request-otp \
  -H "Content-Type: application/json" \
  -H "x-api-password: Ripun54321@#" \
  -H "x-access-code: RIPUN-ACCESS-V1" \
  -H "x-api-client-id: ripun_7f3b2c9d-84a1-4dcb-90e6-fb17e16ab3da" \
  -H "x-api-secret-id: cb85fc11-9ab6-4e52-bd0a-64c9b15166f2" \
  -d '{"phoneNumber": "9199999999"}'
```

### Using Fetch API (JavaScript)

```javascript
fetch('http://localhost:5000/api/transactions/v1/payrequest', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-password': 'Ripun54321@#',
    'x-access-code': 'RIPUN-ACCESS-V1',
    'x-api-client-id': 'ripun_7f3b2c9d-84a1-4dcb-90e6-fb17e16ab3da',
    'x-api-secret-id': 'cb85fc11-9ab6-4e52-bd0a-64c9b15166f2'
  },
  body: JSON.stringify({
    // request payload
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### Using Axios (JavaScript)

```javascript
const axios = require('axios');

axios({
  method: 'post',
  url: 'http://localhost:5000/api/axis/upi/register',
  headers: {
    'x-api-password': 'Ripun54321@#',
    'x-access-code': 'RIPUN-ACCESS-V1',
    'x-api-client-id': 'ripun_7f3b2c9d-84a1-4dcb-90e6-fb17e16ab3da',
    'x-api-secret-id': 'cb85fc11-9ab6-4e52-bd0a-64c9b15166f2'
  },
  data: {
    // request payload
  }
})
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error('Error:', error);
});
```

## Error Responses

If any of the required access headers are missing or invalid, the API will respond with a 403 Forbidden error:

```json
{
  "status": "error",
  "message": "Access denied. You are not eligible to access this resource. This is a 403 Forbidden error. Please contact our representative for further assistance."
}
```

## Security Considerations

- Do not hardcode these credentials in client-side code that is publicly accessible
- Use environment variables on your server-side implementation
- Consider implementing IP whitelisting for additional security
- Rotate the credentials periodically for improved security
- Store client secrets securely and transmit them only over HTTPS

## Health Check Endpoint

The health check endpoint is not protected and can be accessed without these headers:

```
GET http://localhost:5000/health
``` 