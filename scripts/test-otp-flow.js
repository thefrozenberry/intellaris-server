const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

// Configuration
const API_URL = `http://localhost:${process.env.PORT || 5000}/api`;
const TEST_MOBILE = '7002670531'; // Same as the one used in the error logs

// Helper for making API requests
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Function to request OTP
async function requestOTP(mobile) {
  try {
    console.log(`\n1. Requesting OTP for ${mobile}...`);
    const response = await api.post('/auth/request-otp', { mobile });
    console.log('Response:', response.status);
    console.log('Data:', response.data);
    
    // In development, the OTP is included in the response for testing
    if (response.data.data && response.data.data.otp) {
      return response.data.data.otp;
    }
    
    // Manual input if not available in response
    return null;
  } catch (error) {
    console.error('Error requesting OTP:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    return null;
  }
}

// Function to verify OTP
async function verifyOTP(mobile, otp) {
  try {
    console.log(`\n2. Verifying OTP ${otp} for ${mobile}...`);
    const response = await api.post('/auth/verify-otp', { mobile, otp });
    console.log('Response:', response.status);
    console.log('Data:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error verifying OTP:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    return null;
  }
}

// Main function to run the test
async function runTest() {
  try {
    console.log('===== TESTING OTP FLOW =====');
    
    // Step 1: Request OTP
    const otp = await requestOTP(TEST_MOBILE);
    
    if (!otp) {
      console.error('Failed to get OTP. Test aborted.');
      return;
    }
    
    // Step 2: Verify OTP
    const result = await verifyOTP(TEST_MOBILE, otp);
    
    if (result && result.status === 'success') {
      console.log('\nTEST RESULT: SUCCESS');
      console.log('Access Token:', result.data.accessToken.substring(0, 20) + '...');
      console.log('User ID:', result.data.user.id);
    } else {
      console.log('\nTEST RESULT: FAILED');
    }
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Run the test
runTest().catch(console.error); 