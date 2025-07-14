/**
 * Test script for Axis Bank UPI Registration API
 * 
 * This script allows you to test the Axis Bank UPI Registration API without needing to start the full server.
 * It directly calls the Axis Bank service with test data.
 * 
 * Usage:
 * 1. Run using: node scripts/test-axis-bank-api.js [testId]
 * 2. testId is optional, defaults to 1 (success)
 */

require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

const AXIS_CLIENT_ID = process.env.AXIS_CLIENT_ID || '078d5c0393e264476debb8b6721b3628';
const AXIS_CLIENT_SECRET = process.env.AXIS_CLIENT_SECRET || '9a11abd2ba1dac20755e87d76343cb31';
const AXIS_API_BASE_URL = process.env.AXIS_API_BASE_URL || 'https://apiportal.axisbank.com/gateway/openapi/v2/upi/customerregistration';

// Get test ID from command line args
const testId = process.argv[2] || 1;

// Test data
const customerData = {
  name: "John Doe",
  mobileNumber: "9185558889999",
  vpa: "johndoe@axis",
  type: "Customer",
  deviceInfo: {
    app: "com.fintech.upi",
    capacity: "",
    gcmid: "777566645666abhgedd",
    geocode: "37.423021,-122.083739",
    id: "",
    ip: "10.10.20.160",
    location: "Mumbai",
    mobile: "9185558889999",
    os: "Android 12",
    type: "SM-A526B",
    version: "1.0",
    telecom: "Airtel"
  }
};

async function testAxisBankAPI() {
  try {
    console.log(`Testing Axis Bank UPI Registration API with testId=${testId}...`);
    
    // Generate request UUID
    const requestUUID = uuidv4();
    
    // Prepare request body
    const payload = {
      CustomerRegistrationRequest: {
        SubHeader: {
          requestUUID,
          serviceRequestId: "NB.GEN.JDT",
          serviceRequestVersion: "1.0",
          channelId: "TEST"
        },
        CustomerRegistrationRequestBody: {
          customerId: customerData.mobileNumber,
          deviceInfo: {
            app: customerData.deviceInfo.app,
            capacity: customerData.deviceInfo.capacity,
            gcmid: customerData.deviceInfo.gcmid,
            geocode: customerData.deviceInfo.geocode,
            id: customerData.deviceInfo.id,
            ip: customerData.deviceInfo.ip,
            location: customerData.deviceInfo.location,
            mobile: customerData.deviceInfo.mobile,
            os: customerData.deviceInfo.os,
            type: customerData.deviceInfo.type,
            version: customerData.deviceInfo.version,
            telecom: customerData.deviceInfo.telecom
          },
          mobilenumber: customerData.mobileNumber,
          name: customerData.name,
          action: "register",
          vpa: customerData.vpa,
          type: customerData.type,
          smstext: "Registration confirmation",
          aggregator: "125"
        }
      }
    };

    console.log('Request payload:', JSON.stringify(payload, null, 2));
    
    // Make API request to Axis Bank
    const response = await axios({
      method: 'POST',
      url: `${AXIS_API_BASE_URL}/customer-registration`,
      headers: {
        'X-IBM-Client-Id': AXIS_CLIENT_ID,
        'X-IBM-Client-Secret': AXIS_CLIENT_SECRET,
        'X-AXIS-TEST-ID': testId.toString(),
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: payload
    });

    console.log('Response Status:', response.status);
    console.log('Response Data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error testing Axis Bank API:');
    
    if (error.response) {
      // Server responded with an error
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      // Request was made but no response
      console.error('No response received:', error.request);
    } else {
      // Error setting up the request
      console.error('Error setting up request:', error.message);
    }
  }
}

// Run the test
testAxisBankAPI(); 