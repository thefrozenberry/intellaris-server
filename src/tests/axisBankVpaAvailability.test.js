const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

/**
 * Test client for Axis Bank UPI VPA Availability API
 */
async function testVpaAvailability() {
  try {
    // Base URL for the API
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:5000';
    
    // Create a request UUID
    const requestUUID = uuidv4();
    
    // Test parameters
    const customerId = '9087654321';
    const vpa = 'testuser@axis';
    const applicationID = 'com.fintech.upi';
    
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
    console.log('Making request to Axis Bank UPI VPA Availability API...');
    const response = await axios({
      method: 'GET',
      url: `${baseUrl}/api/axis/upi/vpa-availability`,
      headers,
      params: {
        customerId,
        vpa,
        applicationID
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
  testVpaAvailability()
    .then(() => console.log('Test completed successfully'))
    .catch(err => console.error('Test failed:', err));
}

module.exports = {
  testVpaAvailability
}; 