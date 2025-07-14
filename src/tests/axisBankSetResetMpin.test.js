const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

/**
 * Test client for Axis Bank UPI Set Reset MPIN API
 */
async function testSetResetMpin() {
  try {
    // Base URL for the API
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:5000';
    
    // Create request UUID
    const requestUUID = uuidv4();
    
    // Prepare test data
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
            gcmid: "",
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
              code: "string",
              ki: "string",
              skey: "skey",
              type: "type",
              pid: "pid",
              hmac: "hmac",
              encryptedBase64String: "encryptedBase64String"
            },
            subType: "string",
            type: "string"
          },
          otpcred: {
            data: {
              code: "string",
              ki: "string",
              skey: "skey",
              type: "type",
              pid: "pid",
              hmac: "hmac",
              encryptedBase64String: "encryptedBase64String"
            },
            subType: "string",
            type: "string"
          },
          atmpincred: {
            data: {
              code: "string",
              ki: "string",
              skey: "skey",
              type: "type",
              pid: "pid",
              hmac: "hmac",
              encryptedBase64String: "encryptedBase64String"
            },
            subType: "string",
            type: "string"
          },
          regtype: "string",
          txnId: "TXN" + Date.now()
        }
      }
    };
    
    // Set headers
    const headers = {
      'X-IBM-Client-Id': process.env.AXIS_CLIENT_ID || '078d5c0393e264476debb8b6721b3628',
      'X-IBM-Client-Secret': process.env.AXIS_CLIENT_SECRET || '9a11abd2ba1dac20755e87d76343cb31',
      'X-AXIS-TEST-ID': '1', // 1=Success, 3=Customer Accounts not found, others=Invalid test ID
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    // Make API request
    console.log('Making request to Axis Bank UPI Set Reset MPIN API...');
    const response = await axios({
      method: 'POST',
      url: `${baseUrl}/api/axis/upi/set-reset-mpin`,
      headers,
      data: payload
    });
    
    console.log('Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
}

// Execute the test if this file is run directly
if (require.main === module) {
  testSetResetMpin()
    .then(() => console.log('Test completed successfully'))
    .catch(err => console.error('Test failed:', err));
}

module.exports = {
  testSetResetMpin
}; 