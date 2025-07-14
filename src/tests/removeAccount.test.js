const axios = require('axios');

/**
 * Test script for the UPI Remove Accounts API
 * 
 * This script demonstrates how to call the UPI Remove Accounts API
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
async function testRemoveAccount(testId, params = {}) {
  try {
    console.log(`Testing Remove Account API with Test ID: ${testId}`);
    
    // Default query parameters if not provided
    const queryParams = {
      customerId: params.customerId || 'CIF12345678',
      accountNumber: params.accountNumber || '9876543210',
      applicationId: params.applicationId || 'AXISAPP001'
    };
    
    const response = await axios.get(
      `${API_BASE_URL}/v4/account/remove`, 
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
  console.log('======= UPI Remove Account API Tests =======');
  
  // Test with valid input (Test ID: 1) - Success case
  await testRemoveAccount('1');
  console.log('\n');
  
  // Test with Test ID: 3 - Invalid input parameters
  await testRemoveAccount('3', { customerId: '' });
  console.log('\n');
  
  // Test with Test ID: 5 - Invalid test ID
  await testRemoveAccount('5');
  
  console.log('\n======= Tests Completed =======');
}

// Run tests
runTests().catch(err => console.error('Test runner error:', err)); 