const axios = require('axios');

/**
 * Test script for the UPI Change MPIN API
 * 
 * This script demonstrates how to call the UPI Change MPIN API
 * with different test IDs to get different response scenarios.
 * 
 * Run this after starting the server.
 */

// Base URL for the API
const API_BASE_URL = 'http://localhost:5000/api/transactions';

// Sample request payload for Change MPIN
const generateChangeMPINPayload = () => {
  return {
    ChangeMPINRequest: {
      SubHeader: {
        requestUUID: `req-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        serviceRequestId: "NB.GEN.UPIAPI.CHANGEMPIN",
        serviceRequestVersion: "1.0",
        channelId: "TEST"
      },
      SetResetMPINRequestBody: {
        customerId: "CIF12345678",
        bank: "AXIS",
        txnId: `TXN${Date.now()}`,
        ac: {
          accRefNumber: "ACC123456789",
          name: "John Doe",
          ifsc: "AXIS0000001",
          maskedAccnumber: "*****6789",
          status: "ACTIVE",
          type: "SAVINGS",
          vpa: "johndoe@axis",
          aeba: "N"
        },
        cred: {
          type: "PIN",
          subType: "MPIN",
          data: {
            code: "1234" // Old MPIN (Encrypted in a real scenario)
          }
        },
        newcred: {
          type: "PIN",
          subType: "MPIN",
          data: {
            code: "5678" // New MPIN (Encrypted in a real scenario)
          }
        },
        device: {
          app: "AXISBANK",
          capability: "5200000200010004000639292929292",
          geocode: "28.613939,77.209021",
          id: "DCAD28A8A1AB48F99BBCA425B0912ECD",
          ip: "192.168.1.1",
          location: "Delhi",
          mobile: "918888888888",
          os: "Android",
          type: "MOB"
        }
      }
    }
  };
};

/**
 * Function to make API requests with different test IDs
 * @param {string} testId - Test ID for simulating different responses
 */
async function testChangeMPIN(testId) {
  try {
    console.log(`Testing Change MPIN API with Test ID: ${testId}`);
    
    const response = await axios.post(
      `${API_BASE_URL}/v1/changempin`, 
      generateChangeMPINPayload(),
      {
        headers: {
          'Content-Type': 'application/json',
          'X-AXIS-TEST-ID': testId
        }
      }
    );
    
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    // If response contains base64 encoded data, decode it
    if (response.data.SetResetMPINResponseBody?.data) {
      const decodedData = JSON.parse(Buffer.from(response.data.SetResetMPINResponseBody.data, 'base64').toString());
      console.log('Decoded Data:', JSON.stringify(decodedData, null, 2));
    }
    
    return true;
  } catch (error) {
    console.error(`Error with Test ID ${testId}:`, error.response ? error.response.data : error.message);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('======= UPI Change MPIN API Tests =======');
  
  // Test with valid input (Test ID: 1) - Success case
  await testChangeMPIN('1');
  console.log('\n');
  
  // Test with Test ID: 2 - Incorrect old MPIN
  await testChangeMPIN('2');
  console.log('\n');
  
  // Test with Test ID: 3 - Invalid input parameters
  await testChangeMPIN('3');
  console.log('\n');
  
  // Test with Test ID: 4 - MPIN validation failed
  await testChangeMPIN('4');
  console.log('\n');
  
  // Test with Test ID: 5 - Invalid test ID
  await testChangeMPIN('5');
  
  console.log('\n======= Tests Completed =======');
}

// Run tests
runTests().catch(err => console.error('Test runner error:', err)); 