const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

/**
 * Test client for Axis Bank UPI Set VPA API
 */
async function testSetVpa() {
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
      SetVPARequestBody: {
        setVpas: [
          {
            account: "1234567890",
            customerid: "9087654321",
            defaultvpa: "Y",
            ifsc: "AXIS0001234",
            newvpa: "testuser@axis",
            oldvpa: "olduser@axis"
          }
        ]
      }
    };
    
    // Set headers
    const headers = {
      'X-IBM-Client-Id': process.env.AXIS_CLIENT_ID || '078d5c0393e264476debb8b6721b3628',
      'X-IBM-Client-Secret': process.env.AXIS_CLIENT_SECRET || '9a11abd2ba1dac20755e87d76343cb31',
      'X-AXIS-TEST-ID': '1', // 1=Success, 2=No records found, 90=Invalid Input, 91=Backend Failure
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    // Make API request
    console.log('Making request to Axis Bank UPI Set VPA API...');
    const response = await axios({
      method: 'POST',
      url: `${baseUrl}/api/axis/upi/set-vpa`,
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
  testSetVpa()
    .then(() => console.log('Test completed successfully'))
    .catch(err => console.error('Test failed:', err));
}

module.exports = {
  testSetVpa
}; 