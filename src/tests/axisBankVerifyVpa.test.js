const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

/**
 * Test client for Axis Bank UPI Verify VPA API
 */
async function testVerifyVpa() {
  try {
    // Base URL for the API
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:5000';
    
    // Create request UUID
    const requestUUID = uuidv4();
    
    // Prepare test data
    const payload = {
      SubHeader: {
        requestUUID: requestUUID,
        serviceRequestId: "NB.GEN.PDT.ELIG",
        serviceRequestVersion: "1.0",
        channelId: "TEST"
      },
      VerifyVPARequestBody: {
        customerid: "918341030147",
        vpa: "testuser@axis",
        device: {
          app: "com.upi.axispay",
          capability: "011001",
          id: "321a192dc6dc8f7a",
          ip: "100.86.115.100",
          location: "Jubli Hills Hyd TS IN",
          mobile: "9183410148",
          os: "Android9",
          type: "MOB"
        },
        payerInfo: {
          accountnumber: "24412354",
          mcc: "0000",
          name: "Test User",
          payervpa: "payer@axis"
        }
      }
    };
    
    // Set headers
    const headers = {
      'X-IBM-Client-Id': process.env.AXIS_CLIENT_ID || '078d5c0393e264476debb8b6721b3628',
      'X-IBM-Client-Secret': process.env.AXIS_CLIENT_SECRET || '9a11abd2ba1dac20755e87d76343cb31',
      'X-AXIS-TEST-ID': '1', // 1=P2P Success, 2=P2M Success, 90=Invalid Input, others=Backend Failure
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    // Make API request
    console.log('Making request to Axis Bank UPI Verify VPA API...');
    const response = await axios({
      method: 'POST',
      url: `${baseUrl}/api/axis/upi/verify-vpa`,
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
  testVerifyVpa()
    .then(() => console.log('Test completed successfully'))
    .catch(err => console.error('Test failed:', err));
}

module.exports = {
  testVerifyVpa
}; 