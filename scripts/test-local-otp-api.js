const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// Test data for OTP request
const otpData = {
  customerId: "919702003848",
  bankId: "607153",
  txnId: `AXI${uuidv4().replace(/-/g, '').substring(0, 30)}`,
  device: {
    mobile: "919702003848",
    geocode: "0.0,0.0",
    location: "",
    ip: "10.82.135.133",
    type: "Redmi Note 5 Pro",
    id: "868434049506001",
    os: "Android8.1.0",
    app: "com.upi.axispay",
    capability: "011001",
    gcmid: "U"
  },
  ac: {
    name: "AXIS",
    iin: "607153",
    aeba: "N",
    accRefNumber: "917010030923962",
    type: "SAVINGS",
    vpa: "swapnashetty@axis",
    status: "R",
    maskedAccnumber: "XXXX3962",
    ifsc: "AXIS0000473",
    dLength: "6",
    dType: "NUM"
  },
  card: 30719,
  expiry: "01/2020"
};

async function testLocalOtpRequestAPI() {
  try {
    console.log('Testing local OTP request API endpoint...');
    console.log('Request payload:', JSON.stringify(otpData, null, 2));
    
    // Make API request to our local server
    const response = await axios({
      method: 'POST',
      url: 'http://localhost:5000/api/axis/upi/otp/request',
      headers: {
        'Content-Type': 'application/json'
      },
      data: otpData
    });

    console.log('Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
}

// Execute the test function
testLocalOtpRequestAPI()
  .then(() => console.log('Test completed successfully'))
  .catch(error => console.error('Test failed:', error))
  .finally(() => process.exit()); 