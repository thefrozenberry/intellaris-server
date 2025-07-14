const axios = require('axios');
const crypto = require('crypto');

/**
 * Test client for Axis Bank UPI Get Token API
 */
async function testGetToken() {
  try {
    // Base URL for the API
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:5000';
    
    // Create a challenge string (DeviceID|AppID|MobileNumber|RandomString)
    const deviceId = '353385092922150';
    const appId = 'com.fintech.upi';
    const mobileNumber = '9876543210';
    const randomString = crypto.randomBytes(8).toString('hex');
    const challenge = `${deviceId}|${appId}|${mobileNumber}|${randomString}`;
    
    // Test parameters
    const customerId = '9876543210';
    const type = 'INITIAL'; // or 'ROTATE'
    
    // Create request UUID
    const requestUUID = crypto.randomUUID();
    
    // Set headers
    const headers = {
      'X-IBM-Client-Id': process.env.AXIS_CLIENT_ID || '078d5c0393e264476debb8b6721b3628',
      'X-IBM-Client-Secret': process.env.AXIS_CLIENT_SECRET || '9a11abd2ba1dac20755e87d76343cb31',
      'X-AXIS-TEST-ID': '1', // 1=Success, 2=No records found, 90=Invalid Input, 91=Backend Failure
      'X-AXIS-serviceRequestId': 'NB.GEN.PDT.ELIG',
      'X-AXIS-serviceRequestVersion': '1.0',
      'X-AXIS-channelId': 'TEST',
      'X-Axis-requestUUID': requestUUID,
      'Accept': 'application/json'
    };
    
    // Make API request
    console.log('Making request to Axis Bank UPI Get Token API...');
    const response = await axios({
      method: 'GET',
      url: `${baseUrl}/api/axis/upi/get-token`,
      headers,
      params: {
        customerId,
        type,
        challenge
      }
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
  testGetToken()
    .then(() => console.log('Test completed successfully'))
    .catch(err => console.error('Test failed:', err));
}

module.exports = {
  testGetToken
}; 