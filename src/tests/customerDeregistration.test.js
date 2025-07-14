const axios = require('axios');

/**
 * Test script for the UPI Customer De-Registration API
 * 
 * This script demonstrates how to call the UPI Customer De-Registration API
 * with different test IDs to get different response scenarios.
 * 
 * Run this after starting the server.
 */

// Base URL for the API
const API_BASE_URL = 'http://localhost:3000/api/transactions';

/**
 * Function to make API requests with different test IDs
 * @param {string} testId - Test ID for simulating different responses
 * @param {Object} params - Query parameters
 */
async function testCustomerDeregistration(testId, params = {}) {
  try {
    console.log(`Testing Customer De-Registration API with Test ID: ${testId}`);
    
    // Default query parameters if not provided
    const queryParams = {
      customerId: params.customerId || 'CIF12345678',
      applicationId: params.applicationId || 'AXISAPP001'
    };
    
    const response = await axios.get(
      `${API_BASE_URL}/v2/customer-dergistration`, 
      {
        params: queryParams,
        headers: {
          'Content-Type': 'application/json',
          'X-AXIS-TEST-ID': testId,
          'X-AXIS-serviceRequestId': params.serviceRequestId || 'NB.GEN.PDT.ELIG',
          'X-AXIS-serviceRequestVersion': params.serviceRequestVersion || '1.0',
          'X-AXIS-channelId': params.channelId || 'TEST',
          'X-Axis-requestUUID': params.requestUUID || '97f6b07e-b82d-4fed-9c57-80088ba23e30'
        }
      }
    );
    
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    return true;
  } catch (error) {
    console.error(`Error with Test ID ${testId}:`, error.response ? error.response.data : error.message);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('======= UPI Customer De-Registration API Tests =======');
  
  // Test with valid input (Test ID: 1) - Success case
  await testCustomerDeregistration('1');
  console.log('\n');
  
  // Test with Test ID: 3 - Invalid input parameters
  await testCustomerDeregistration('3', { customerId: '', applicationId: '' });
  console.log('\n');
  
  // Test with Test ID: 5 - Invalid test ID
  await testCustomerDeregistration('5');
  
  console.log('\n======= Tests Completed =======');
}

// Run tests
runTests().catch(err => console.error('Test runner error:', err)); 