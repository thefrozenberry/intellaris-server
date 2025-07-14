require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

const AXIS_CLIENT_ID = process.env.AXIS_CLIENT_ID || '078d5c0393e264476debb8b6721b3628';
const AXIS_CLIENT_SECRET = process.env.AXIS_CLIENT_SECRET || '9a11abd2ba1dac20755e87d76343cb31';
const AXIS_API_UPI_ACCOUNT_REG_URL = process.env.AXIS_API_UPI_ACCOUNT_REG_URL || 'https://apiportal.axisbank.com/gateway/openapi/v1/upi/accountregistration/v1/otprequest';

// Get test ID from command line args (1=Success, 3=OTP failed, others=Invalid Test Id)
const testId = process.argv[2] || 1;

// Test data for OTP request
const otpData = {
  mobileNumber: "919702003848",
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

async function testAxisBankOTPAPI() {
  try {
    console.log(`Testing Axis Bank UPI OTP Request API with testId=${testId}...`);
    
    // Generate request UUID
    const requestUUID = uuidv4();
    
    // Prepare request body according to Axis Bank API specification
    const payload = {
      OTPRequest: {
        SubHeader: {
          requestUUID: requestUUID,
          serviceRequestId: "NB.GEN.PDT.ELIG",
          serviceRequestVersion: "1.0",
          channelId: "TEST"
        },
        OTPRequestBody: {
          customerId: otpData.customerId,
          bankId: otpData.bankId,
          txnId: otpData.txnId,
          device: otpData.device,
          ac: otpData.ac,
          card: otpData.card,
          expiry: otpData.expiry
        }
      }
    };

    console.log('Request payload:', JSON.stringify(payload, null, 2));
    
    // Make API request to Axis Bank
    const response = await axios({
      method: 'POST',
      url: AXIS_API_UPI_ACCOUNT_REG_URL,
      headers: {
        'X-IBM-Client-Id': AXIS_CLIENT_ID,
        'X-IBM-Client-Secret': AXIS_CLIENT_SECRET,
        'X-AXIS-TEST-ID': testId.toString(),
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: payload
    });

    console.log('Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('Axis Bank API Error:', error.response?.data || error.message);
    throw error;
  }
}

// Execute the test function
testAxisBankOTPAPI()
  .then(() => console.log('Test completed successfully'))
  .catch(error => console.error('Test failed:', error))
  .finally(() => process.exit()); 