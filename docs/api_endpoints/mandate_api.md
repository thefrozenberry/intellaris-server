# Mandate API Documentation

This document outlines the API endpoints for the Mandate (Auto-debit/Subscription) feature.

## Initiate Mandate

Allows payer/payee to initiate a mandate creation request.

- **URL**: `/api/v1/mandate/initiate`
- **Method**: `POST`
- **Auth required**: Yes

### Request Headers

| Header               | Required | Description                                   |
|----------------------|----------|-----------------------------------------------|
| Content-Type         | Yes      | application/json                              |
| x-fapi-epoch-millis  | Yes      | Epoch millis at the time of API request       |
| x-fapi-channel-id    | Yes      | Channel identifier for the API consumer       |
| x-fapi-uuid          | Yes      | Unique alphanumeric ID for each request       |
| X-AXIS-TEST-ID       | Yes      | Test ID to control response type (1=SUCCESS)  |

### Request Body

```json
{
  "Data": {
    "CustomerID": "917400112235",
    "txnID": "AXIg7dl348v8797t6wtlsdt7srds38c45v4",
    "appid": "123",
    "umn": "AXIShjsteajYRSndTV4To6wttD9h6i",
    "mandateName": "UPI",
    "revocable": "Y",
    "shareToPayee": "Y",
    "validityStart": 6022019,
    "validityEnd": "27022019",
    "amountRule": "EXACT",
    "amountRuleValue": "200.00",
    "recurrence": "ONETIME",
    "ruleValue": "string",
    "purposecode": "00",
    "ruleType": "ON",
    "note": "Mandate Request",
    "payerAddr": "muk***.gami29@okaxis",
    "payerName": "MAYANKARVINDKUMAMEHTA",
    "payeeAddr": "soh***@axis",
    "payeeName": "HANOZKEKIBHARUCHA",
    "executeByPayeePSP": "Y",
    "accountDetails": {
      "name": "Customer Name",
      "accRefNumber": "450010100225601",
      "maskedAccnumber": "XXXX5601",
      "ifsc": "AXIS0000450",
      "type": "SAVINGS",
      "iin": "233343"
    },
    "creds": {
      "type": "PIN",
      "subType": "MPIN",
      "data": {
        "code": "NPCI",
        "ki": "20150822",
        "encryptedBase64String": "2.0|AfMUR/p7M1Oe8sKwu/6dz6f2RoWDJ5xcAFOA43hicpwkJwrebFlt6gRcz01lkjRKIaDRUeTGqrFll2sab3V16XTolcM2tARR8RYGp78OcHaTokXnrC3dqiKmJmM9XmOM6uCXnPHb5NgLqY5V6ynTbuqVUEzVE8T3/mwQQkT70jAAw8kaDn9mFyTBmuTBVcOxbf1PgVpUSQH2yuM66dUBCqtpVFqmT2/IHlx5IGu3efd/N7hO/h9R43QYD61o9UBcIDJRs72X5KJudWu0Np6gs4OxhD285P7hwZE8T0uLpZ2ucqYSMxUulF/hSB+9IKolIpCp+kzswViy6osc4/5EA\\u003d\\u003d"
      }
    },
    "Device": "{\"mobile\":\"917400112235\",\"geocode\":\"0.0,0.0\",\"location\":\"Mumbai\",\"ip\":\"100.125.244.211\",\"type\":\"XiaomiRedmiNote5\",\"id\":\"868210034695367\",\"os\":\"Android7.1.2\",\"app\":\"com.google.android.apps.nbu.paisa.user\",\"capability\":\"011001\"}",
    "initiatedBy": "PAYER_INITIATED"
  },
  "Risk": {
    "id": 4818195206635520
  }
}
```

### Response

```json
{
  "success": true,
  "data": {
    "Data": {
      "code": "00",
      "result": "success",
      "data": "830315136150",
      "umn": "AXI36cc92790e594ca083cb14eac4cf5@psp",
      "txnid": "AXI36cc92790e594ca083cb14eac4cf5@psp"
    },
    "Risk": {
      "id": 938183248314368
    },
    "Link": {
      "id": 6810498465005568
    },
    "Meta": {
      "id": 4455354769342464
    }
  }
}
```

## Authorize Mandate

Allows a payer to approve or decline a mandate request initiated by a payee.

- **URL**: `/api/v1/mandate/authorize`
- **Method**: `POST`
- **Auth required**: Yes

### Request Headers

Same as Initiate Mandate.

### Request Body

```json
{
  "Data": {
    "CustomerID": "917400112235",
    "appId": "123",
    "action": "APPROVE",
    "accountDetails": {
      "accRefNumber": "7411114661",
      "accType": "SAVINGS",
      "ifsc": "UTIB0000131",
      "maskedAccnumber": "XXXXXXXX114661",
      "mbeba": "Y",
      "vpa": "teji@psp",
      "name": "XXXXX XXXXX XXXXX",
      "type": "SAVINGS"
    },
    "creds": {
      "type": "PIN",
      "subType": "MPIN",
      "data": {
        "code": "NPCI",
        "ki": "20150822",
        "encryptedBase64String": "2.0|AfMUR/p7M1Oe8sKwu/6dz6f2RoWDJ5xcAFOA43hicpwkJwrebFlt6gRcz01lkjRKIaDRUeTGqrFll2sab3V16XTolcM2tARR8RYGp78OcHaTokXnrC3dqiKmJmM9XmOM6uCXnPHb5NgLqY5V6ynTbuqVUEzVE8T3/mwQQkT70jAAw8kaDn9mFyTBmuTBVcOxbf1PgVpUSQH2yuM66dUBCqtpVFqmT2/IHlx5IGu3efd/N7hO/h9R43QYD61o9UBcIDJRs72X5KJudWu0Np6gs4OxhD285P7hwZE8T0uLpZ2ucqYSMxUulF/hSB+9IKolIpCp+kzswViy6osc4/5EA\\u003d\\u003d"
      }
    },
    "Device": {
      "mobile": "917400112235",
      "geocode": "0.0,0.0",
      "location": "Mumbai",
      "ip": "100.125.244.211",
      "type": "XiaomiRedmiNote5",
      "id": "868210034695367",
      "os": "Android7.1.2",
      "app": "com.google.android.apps.nbu.paisa.user",
      "capability": "011001"
    },
    "umn": "AXIShjsteajYRSndTV4To6wttD9h6i",
    "txnID": "AXIg7dl348v8797t6wtlsdt7srds38c45v4"
  },
  "Risk": {
    "id": 8059811534995456
  }
}
```

### Response

```json
{
  "success": true,
  "data": {
    "Data": {
      "code": "00",
      "result": "success",
      "data": "830315136150",
      "umn": "AXI36cc92790e594ca083cb14eac4cf5@psp",
      "txnid": "AXI36cc92790e594ca083cb14eac4cf5@psp"
    },
    "Risk": {
      "id": 2351067966734336
    },
    "Link": {
      "id": 6899965974544384
    },
    "Meta": {
      "id": 2558648463130624
    }
  }
}
```

## Validate Mandate

Validates an existing mandate.

- **URL**: `/api/v1/mandate/validate`
- **Method**: `POST`
- **Auth required**: Yes

### Request Headers

Same as Initiate Mandate.

### Request Body

```json
{
  "umn": "AXI36cc92790e594ca083cb14eac4cf5@psp"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "Data": {
      "code": "00",
      "result": "success",
      "status": "ACTIVE",
      "txnid": "AXI36cc92790e594ca083cb14eac4cf5@psp"
    }
  }
}
```

## Revoke Mandate

Revokes an existing mandate.

- **URL**: `/api/v1/mandate/revoke`
- **Method**: `POST`
- **Auth required**: Yes

### Request Headers

Same as Initiate Mandate.

### Request Body

```json
{
  "umn": "AXI36cc92790e594ca083cb14eac4cf5@psp",
  "reason": "Service no longer required"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "Data": {
      "code": "00",
      "result": "success",
      "txnid": "AXI36cc92790e594ca083cb14eac4cf5@psp"
    }
  }
}
```

## Execute Mandate

Executes a payment based on an existing mandate.

- **URL**: `/api/v1/mandate/execute`
- **Method**: `POST`
- **Auth required**: Yes

### Request Headers

Same as Initiate Mandate.

### Request Body

```json
{
  "umn": "AXI36cc92790e594ca083cb14eac4cf5@psp",
  "txnId": "AXI36cc92790e594ca083cb14eac4cf5@psp",
  "amount": "200.00"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "Data": {
      "code": "00",
      "result": "success",
      "txnid": "AXI36cc92790e594ca083cb14eac4cf5@psp",
      "rrn": "123456789012"
    }
  }
}
```

## Execute Mandate Transaction

Allows a payee to request money corresponding to a mandate created by the payer.

- **URL**: `/api/v1/mandate/execute-transaction`
- **Method**: `POST`
- **Auth required**: Yes

### Request Headers

Same as Initiate Mandate.

### Request Body

```json
{
  "Data": {
    "customerid": "91993988764",
    "txnid": "AXI67655656565654ddf",
    "appId": "123",
    "umn": "AXI87656656455445@axis",
    "remarks": "mandate execute",
    "validitystart": "1022019",
    "validityend": "10032019",
    "amount": "199.99",
    "execute": "EXECUTE",
    "device": {
      "app": "com.olive.up",
      "capability": "011001",
      "gcmid": "fQVucf-7dGg:APA91bH_CCs0F-Fqb-nnqNCFQNxYXu3cR6lWjIszYbzOEphvNG07VDPN7IcPMJWZk0hkzsE4DFTRt_JgtTS2bX09s0nIcjiHddgEC8kII7kv2-QRAnE4rwANWDM4jPZYwgP9avwXOWRR",
      "geocode": "0.0,0.0",
      "id": "354460072382094",
      "ip": "10.207.160.30",
      "location": "http://pagin.nf/biiwogo",
      "mobile": "919397123108",
      "os": "Android7.0",
      "type": "MOB"
    }
  },
  "Risk": "kadfop"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "Data": {
      "code": "00",
      "result": "success",
      "data": "830315136150",
      "umn": "AXI36cc92790e594ca083cb14eac4cf5@psp",
      "txnid": "AXI36cc92790e594ca083cb14eac4cf5"
    },
    "Risk": {
      "id": 5373606303367168
    },
    "Link": {
      "id": 8911282998607872
    },
    "Meta": {
      "id": 5149311262261248
    }
  }
}
```

### Error Responses

1. **Mandate Already Executed**

```json
{
  "success": false,
  "error": "Mandate has already been executed"
}
```

2. **Mandate Expired**

```json
{
  "success": false,
  "error": "Mandate has expired"
}
```

## Get Mandate Details

Retrieves details of an existing mandate.

- **URL**: `/api/v1/mandate/:umn`
- **Method**: `GET`
- **Auth required**: Yes

### Request Headers

Same as Initiate Mandate.

### URL Parameters

- `umn`: Unique Mandate Number

### Response

```json
{
  "success": true,
  "data": {
    "Data": {
      "umn": "AXI36cc92790e594ca083cb14eac4cf5@psp",
      "mandateName": "UPI",
      "revocable": "Y",
      "shareToPayee": "Y",
      "validityStart": "06-02-2019",
      "validityEnd": "27-02-2019",
      "amountRule": "EXACT",
      "amountRuleValue": "200.00",
      "recurrence": "ONETIME",
      "status": "ACTIVE",
      "payerAddr": "muk***.gami29@okaxis",
      "payerName": "MAYANKARVINDKUMAMEHTA",
      "payeeAddr": "soh***@axis",
      "payeeName": "HANOZKEKIBHARUCHA"
    }
  }
}
```

## Modify Mandate

This endpoint allows modification of an existing mandate.

- **URL**: `/api/v1/mandate/modify`
- **Method**: `POST`
- **Auth required**: Yes

### Request Headers

| Header              | Type   | Description                                                      |
|---------------------|--------|------------------------------------------------------------------|
| Content-Type        | string | Should be `application/json`                                     |
| x-fapi-epoch-millis | string | The Epoch millis at the time of hitting the API request          |
| x-fapi-channel-id   | string | Channel identifier                                              |
| x-fapi-uuid         | string | Unique alphanumeric Id (without special characters)             |
| X-AXIS-TEST-ID      | integer| Used for creating the type of response (1=Success, etc)         |

### Request Body

```json
{
  "Data": {
    "CustomerID": "917400112235",
    "txnID": "AXIg7dl348v8797t6wtlsdt7srds38c45v4",
    "appId": "123",
    "umn": "AXIShjsteajYRSndTV4To6wttD9h6i",
    "mandateName": "UPI",
    "validityStart": "6022019",
    "validityEnd": "27022019",
    "amountRule": "EXACT",
    "amountRuleValue": "200.00",
    "recurrence": "ONETIME",
    "note": "Mandate Request",
    "executeByPayeePSP": "Y",
    "creds": {
      "type": "PIN",
      "subType": "MPIN",
      "data": {
        "code": "NPCI",
        "ki": "20150822",
        "encryptedBase64String": "2.0|AfMUR/p7M1Oe8sKwu/6dz6f2RoWDJ5xcAFOA43hicpwkJwrebFlt6gRcz01lkjRKIaDRUeTGqrFll2sab3V16XTolcM2tARR8RYGp78OcHaTokXnrC3dqiKmJmM9XmOM6uCXnPHb5NgLqY5V6ynTbuqVUEzVE8T3/mwQQkT70jAAw8kaDn9mFyTBmuTBVcOxbf1PgVpUSQH2yuM66dUBCqtpVFqmT2/IHlx5IGu3efd/N7hO/h9R43QYD61o9UBcIDJRs72X5KJudWu0Np6gs4OxhD285P7hwZE8T0uLpZ2ucqYSMxUulF/hSB+9IKolIpCp+kzswViy6osc4/5EA\\u003d\\u003d"
      }
    },
    "Device": "{\"mobile\":\"917400112235\",\"geocode\":\"0.0,0.0\",\"location\":\"Mumbai\",\"ip\":\"100.125.244.211\",\"type\":\"XiaomiRedmiNote5\",\"id\":\"868210034695367\",\"os\":\"Android7.1.2\",\"app\":\"com.google.android.apps.nbu.paisa.user\",\"capability\":\"011001\"}",
    "initiatedBy": "PAYER_INITIATED"
  },
  "Risk": {
    "id": 5213441599995904
  }
}
```

### Successful Response

```json
{
  "success": true,
  "message": "Mandate modified successfully",
  "data": {
    "Data": {
      "code": "00",
      "result": "success",
      "data": "830315136150",
      "umn": "AXI36cc92790e594ca083cb14eac4cf5@psp",
      "txnid": "AXI36cc92790e594ca083cb14eac4cf5@psp"
    },
    "Risk": {
      "id": 3485739950014464
    },
    "Link": {
      "id": 7203585135738880
    },
    "Meta": {
      "id": 5379853658357760
    }
  }
}
```

### Error Response

- **Mandate Not Created**

```json
{
  "success": false,
  "error": "Mandate not created"
}
```

- **Mandate Already Executed**

```json
{
  "success": false,
  "error": "Mandate has already been executed"
}
```

### Notes

- The `X-AXIS-TEST-ID` parameter determines the response type:
  - 1 = Success
  - 2 = Mandate already executed
  - 3 = Mandate not created
  - Others = Invalid Test Id

## Update Mandate Status (Suspend/Activate/Revoke)

This endpoint allows updating the status of an existing mandate (suspend, activate, or revoke).

- **URL**: `/api/v1/mandate/update-status`
- **Method**: `POST`
- **Auth required**: Yes

### Request Headers

| Header              | Type   | Description                                                      |
|---------------------|--------|------------------------------------------------------------------|
| Content-Type        | string | Should be `application/json`                                     |
| x-fapi-epoch-millis | string | The Epoch millis at the time of hitting the API request          |
| x-fapi-channel-id   | string | Channel identifier                                              |
| x-fapi-uuid         | string | Unique alphanumeric Id (without special characters)             |
| X-AXIS-TEST-ID      | integer| Used for creating the type of response (1=Success, etc)         |

### Request Body

```json
{
  "Data": {
    "customerid": "917400112235",
    "appId": "123",
    "creds": {
      "type": "PIN",
      "subType": "MPIN",
      "data": {
        "code": "NPCI",
        "ki": "20150822",
        "encryptedBase64String": "2.0|AfMUR/p7M1Oe8sKwu/6dz6f2RoWDJ5xcAFOA43hicpwkJwrebFlt6gRcz01lkjRKIaDRUeTGqrFll2sab3V16XTolcM2tARR8RYGp78OcHaTokXnrC3dqiKmJmM9XmOM6uCXnPHb5NgLqY5V6ynTbuqVUEzVE8T3/mwQQkT70jAAw8kaDn9mFyTBmuTBVcOxbf1PgVpUSQH2yuM66dUBCqtpVFqmT2/IHlx5IGu3efd/N7hO/h9R43QYD61o9UBcIDJRs72X5KJudWu0Np6gs4OxhD285P7hwZE8T0uLpZ2ucqYSMxUulF/hSB+9IKolIpCp+kzswViy6osc4/5EA\\u003d\\u003d"
      }
    },
    "Device": "{\"mobile\":\"917400112235\",\"geocode\":\"0.0,0.0\",\"location\":\"Mumbai\",\"ip\":\"100.125.244.211\",\"type\":\"XiaomiRedmiNote5\",\"id\":\"868210034695367\",\"os\":\"Android7.1.2\",\"app\":\"com.google.android.apps.nbu.paisa.user\",\"capability\":\"011001\"}",
    "newstate": "REVOKE",
    "txnID": "AXIg7dl348v8797t6wtlsdt7srds38c45v4",
    "umn": "AXIShjsteajYRSndTV4To6wttD9h6i"
  },
  "Risk": {
    "id": 8844750822047744
  }
}
```

The `newstate` field can have the following values:
- `REVOKE`: To revoke/cancel the mandate
- `SUSPEND`: To temporarily suspend the mandate
- `ACTIVATE`: To activate a suspended mandate

### Successful Response

```json
{
  "success": true,
  "message": "Mandate revoked successfully",
  "data": {
    "Data": {
      "code": "00",
      "result": "success",
      "data": "830315136150",
      "umn": "AXI36cc92790e594ca083cb14eac4cf5@psp",
      "txnid": "AXI36cc92790e594ca083cb14eac4cf5@psp"
    },
    "Risk": {
      "id": 5306660891394048
    },
    "Link": {
      "id": 1290329091211264
    },
    "Meta": {
      "id": 2620040683716608
    }
  }
}
```

### Error Response

- **Mandate Not Found**

```json
{
  "success": false,
  "error": "Mandate not found"
}
```

- **Mandate Already Revoked**

```json
{
  "success": false,
  "error": "Mandate already revoked"
}
```

### Notes

- The `X-AXIS-TEST-ID` parameter determines the response type:
  - 1 = Success
  - 2 = Mandate not found
  - 3 = Mandate already revoked
  - Others = Invalid Test Id 

## Get Mandate

This endpoint retrieves detailed mandate information.

- **URL**: `/api/v1/mandate/get-mandate`
- **Method**: `POST`
- **Auth required**: Yes

### Request Headers

| Header              | Type   | Description                                                      |
|---------------------|--------|------------------------------------------------------------------|
| Content-Type        | string | Should be `application/json`                                     |
| x-fapi-epoch-millis | string | The Epoch millis at the time of hitting the API request          |
| x-fapi-channel-id   | string | Channel identifier                                              |
| x-fapi-uuid         | string | Unique alphanumeric Id (without special characters)             |
| X-AXIS-TEST-ID      | integer| Used for creating the type of response (1=Success, etc)         |

### Request Body

```json
{
  "Data": {
    "customerid": "919666799064",
    "txnid": "AXI4f12cd1080cb4910b7518f25c720df1a",
    "appid": "123",
    "umn": "AXI839a288d42da40dab2a2e0d80c486@psp"
  },
  "Risk": "basjewkijatni"
}
```

### Successful Response

```json
{
  "success": true,
  "data": {
    "Data": {
      "code": "00",
      "result": "success",
      "data": [
        {
          "id": 0,
          "payerMobile": "919182025967",
          "payeeMobile": "910001231414",
          "mandateType": "CREATE",
          "initiatedBy": "PAYER",
          "umn": "AXI68d08ba01c7849bc8cb0157dcaac5@axis",
          "revokeable": "Y",
          "shareToPayee": "Y",
          "txnid": "AXI78912b36cf89460c8065b390ba2cb2b3",
          "validity_start": "19052022",
          "validity_end": "20052022",
          "amount": "4.00",
          "amountRule": "MAX",
          "recurrencePattern": "DAILY",
          "rule_value": "null",
          "rule_type": "ON",
          "credType": "null",
          "payerVpa": "saikiran@axis",
          "payeeVpa": "payu@axis",
          "payerType": "PERSON",
          "payeeType": "PERSON",
          "createdDate": "2022-05-19T12:57:36.023Z",
          "updatedDate": "2022-05-19T12:57:36.799Z",
          "dgtSign": "null",
          "payerAccountNumber": "XXXXXX021766",
          "payeeAccountNumber": "XXXXXX013359",
          "payerIfsc": "AXIS0000205",
          "payeeIfsc": "AXIS0000063",
          "payerAccountName": "SHYAM SUNDER AGARWAL",
          "payeeAccountName": "PAYUCOLLECT",
          "payerAccountType": "SAVINGS",
          "payeeAccountType": "CURRENT",
          "payerStatus": "S",
          "payeeStatus": "S",
          "mandateName": "UPI",
          "remarks": "UPI",
          "recurrenceRuleType": "ON",
          "recurrenceRuleValue": "null",
          "payername": "SHYAM SUNDER AGARWAL",
          "payeename": "PAYUCOLLECT",
          "merchantflag": "N",
          "rrn": "213924932121",
          "refUrl": "https://axisbank.com/"
        }
      ]
    },
    "Risk": {
      "id": 7055358637899776
    },
    "Link": {
      "id": 2662250861035520
    },
    "Meta": {
      "id": 7219393685618688
    }
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Failed to fetch mandate details"
}
```

### Notes

- The `X-AXIS-TEST-ID` parameter determines the response type:
  - 1 = Success
  - 2 = Failure
  - Others = Invalid Test Id

## Get Mandate Transactions

This endpoint retrieves transactions associated with a mandate.

- **URL**: `/api/v1/mandate/get-transactions`
- **Method**: `POST`
- **Auth required**: Yes

### Request Headers

| Header              | Type   | Description                                                      |
|---------------------|--------|------------------------------------------------------------------|
| Content-Type        | string | Should be `application/json`                                     |
| x-fapi-epoch-millis | string | The Epoch millis at the time of hitting the API request          |
| x-fapi-channel-id   | string | Channel identifier                                              |
| x-fapi-uuid         | string | Unique alphanumeric Id (without special characters)             |
| X-AXIS-TEST-ID      | integer| Used for creating the type of response (1=Success, etc)         |

### Request Body

```json
{
  "Data": {
    "customerid": "919666799064",
    "appid": "123",
    "txnid": "AXI1fc804602a964c99820246bc4df6844f"
  },
  "Risk": {
    "id": 2999041652686848
  }
}
```

Note: The `txnid` field is optional.

### Successful Response

```json
{
  "success": true,
  "data": {
    "Data": {
      "code": "00",
      "result": "success",
      "data": [
        "transaction1",
        "transaction2",
        "transaction3"
      ]
    },
    "Risk": {
      "id": 210759174848512
    },
    "Link": {
      "id": 2442866397806592
    },
    "Meta": {
      "id": 1953391475425280
    }
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Failed to fetch mandate transactions"
}
```

### Notes

- The `X-AXIS-TEST-ID` parameter determines the response type:
  - 1 = Success
  - 2 = Failure
  - Others = Invalid Test Id 