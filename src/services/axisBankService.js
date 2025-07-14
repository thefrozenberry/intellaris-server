const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Axis Bank API credentials
const AXIS_CLIENT_ID = process.env.AXIS_CLIENT_ID || '078d5c0393e264476debb8b6721b3628';
const AXIS_CLIENT_SECRET = process.env.AXIS_CLIENT_SECRET || '9a11abd2ba1dac20755e87d76343cb31';
const AXIS_API_BASE_URL = process.env.AXIS_API_BASE_URL || 'https://apiportal.axisbank.com/gateway/openapi/v2/upi/customerregistration';
const AXIS_API_UPI_ACCOUNT_REG_URL = process.env.AXIS_API_UPI_ACCOUNT_REG_URL || 'https://apiportal.axisbank.com/gateway/openapi/v1/upi/accountregistration/v1/otprequest';
const AXIS_API_UPI_FETCH_ACCOUNTS_URL = process.env.AXIS_API_UPI_FETCH_ACCOUNTS_URL || 'https://apiportal.axisbank.com/gateway/openapi/v1/upi/accountregistration/v4/fetchcustomeraccounts';

/**
 * Register a customer with Axis Bank UPI service
 * @param {Object} customerData - Customer registration data
 * @param {number} testId - Test ID for response type (1=Success, 2=No records found, etc.)
 * @returns {Promise<Object>} Registration response
 */
async function registerCustomer(customerData, testId = 1) {
  try {
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
          customerId: customerData.mobileNumber || customerData.customerId,
          deviceInfo: {
            app: customerData.deviceInfo?.app || "com.fintech.upi",
            capacity: customerData.deviceInfo?.capacity || "",
            gcmid: customerData.deviceInfo?.gcmid || `${Date.now()}`,
            geocode: customerData.deviceInfo?.geocode || "",
            id: customerData.deviceInfo?.id || "",
            ip: customerData.deviceInfo?.ip || "",
            location: customerData.deviceInfo?.location || "",
            mobile: customerData.mobileNumber || customerData.customerId,
            os: customerData.deviceInfo?.os || "Android",
            type: customerData.deviceInfo?.type || "Mobile",
            version: customerData.deviceInfo?.version || "1.0",
            telecom: customerData.deviceInfo?.telecom || ""
          },
          mobilenumber: customerData.mobileNumber || customerData.customerId,
          name: customerData.name || "",
          action: customerData.action || "register",
          vpa: customerData.vpa || "",
          type: customerData.type || "Customer",
          smstext: customerData.smstext || "Registration confirmation",
          aggregator: customerData.aggregator || ""
        }
      }
    };

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

    return response.data;
  } catch (error) {
    // Handle error
    console.error('Axis Bank API Error:', error.response?.data || error.message);
    
    // Throw a formatted error
    throw {
      status: error.response?.status || 500,
      message: error.response?.data?.message || 'Failed to register customer with Axis Bank',
      error: error.response?.data || error.message
    };
  }
}

/**
 * Request OTP for UPI account registration via Axis Bank
 * @param {Object} otpData - OTP request data
 * @param {number} testId - Test ID for response type (1=Success, 3=OTP failed, others=Invalid Test Id)
 * @returns {Promise<Object>} OTP request response
 */
async function requestOtp(otpData, testId = 1) {
  try {
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
          customerId: otpData.mobileNumber || otpData.customerId,
          bankId: otpData.bankId || "607153",
          txnId: otpData.txnId || `AXI${uuidv4().replace(/-/g, '').substring(0, 30)}`,
          device: {
            mobile: otpData.mobileNumber || otpData.customerId,
            geocode: otpData.device?.geocode || "0.0,0.0",
            location: otpData.device?.location || "",
            ip: otpData.device?.ip || "10.82.135.133",
            type: otpData.device?.type || "Mobile",
            id: otpData.device?.id || "",
            os: otpData.device?.os || "Android",
            app: otpData.device?.app || "com.upi.axispay",
            capability: otpData.device?.capability || "011001",
            gcmid: otpData.device?.gcmid || "U"
          },
          ac: {
            name: otpData.ac?.name || "AXIS",
            iin: otpData.ac?.iin || "607153",
            aeba: otpData.ac?.aeba || "N",
            accRefNumber: otpData.ac?.accRefNumber || "",
            type: otpData.ac?.type || "SAVINGS",
            vpa: otpData.ac?.vpa || "",
            status: otpData.ac?.status || "R",
            maskedAccnumber: otpData.ac?.maskedAccnumber || "",
            ifsc: otpData.ac?.ifsc || "",
            dLength: otpData.ac?.dLength || "6",
            dType: otpData.ac?.dType || "NUM"
          },
          card: otpData.card || 30719,
          expiry: otpData.expiry || "01/2030"
        }
      }
    };

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

    return response.data;
  } catch (error) {
    // Handle error
    console.error('Axis Bank OTP Request API Error:', error.response?.data || error.message);
    
    // Throw a formatted error
    throw {
      status: error.response?.status || 500,
      message: error.response?.data?.message || 'Failed to request OTP from Axis Bank',
      error: error.response?.data || error.message
    };
  }
}

/**
 * Fetch customer accounts via Axis Bank UPI
 * @param {Object} accountsData - Fetch accounts request data
 * @param {number} testId - Test ID for response type (1=Success, 3=Customer Id Invalid, 90=Invalid Test id)
 * @returns {Promise<Object>} Fetch accounts response
 */
async function fetchCustomerAccounts(accountsData, testId = 1) {
  try {
    // If client provides full request body, use it; otherwise construct one
    let payload = accountsData;
    
    // If no FetchCustomerAccountsRequest is provided, construct the payload
    if (!accountsData.FetchCustomerAccountsRequest) {
      // Generate request UUID
      const requestUUID = uuidv4();
      
      // Extract mobile number if available
      const mobileNumber = accountsData.mobileNumber || accountsData.mobile || accountsData.phone;
      
      // Prepare request body according to Axis Bank API specification
      payload = {
        FetchCustomerAccountsRequest: {
          SubHeader: {
            requestUUID: requestUUID,
            serviceRequestId: "NB.GEN.PDT.ELIG",
            serviceRequestVersion: "1.0",
            channelId: "TEST"
          },
          FetchCustomerAccountsRequestBody: {
            bankId: accountsData.bankId || "607153",
            customerId: accountsData.customerId || mobileNumber || "9010852340",
            txnId: accountsData.txnId || `AXI${uuidv4().replace(/-/g, '').substring(0, 30)}`,
            device: {
              mobile: mobileNumber || accountsData.customerId || "9197****053",
              location: accountsData.device?.location || "",
              ip: accountsData.device?.ip || "10.69.83.254",
              type: accountsData.device?.type || "HMD Global Nokia 6.1 Plus",
              Id: accountsData.device?.Id || "353385092922150",
              os: accountsData.device?.os || "Android9",
              app: accountsData.device?.app || "com.upi.axispay",
              capability: accountsData.device?.capability || "011001",
              gcmid: accountsData.device?.gcmid || "",
              geocode: accountsData.device?.geocode || "123.456.255",
              version: accountsData.device?.version || "1.0",
              telecom: accountsData.device?.telecom || "Idea"
            }
          }
        }
      };
    }

    // Make API request to Axis Bank
    const response = await axios({
      method: 'POST',
      url: AXIS_API_UPI_FETCH_ACCOUNTS_URL,
      headers: {
        'X-IBM-Client-Id': AXIS_CLIENT_ID,
        'X-IBM-Client-Secret': AXIS_CLIENT_SECRET,
        'X-AXIS-TEST-ID': testId.toString(),
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: payload
    });

    return response.data;
  } catch (error) {
    // Handle error
    console.error('Axis Bank Fetch Accounts API Error:', error.response?.data || error.message);
    
    // Throw a formatted error
    throw {
      status: error.response?.status || 500,
      message: error.response?.data?.message || 'Failed to fetch customer accounts from Axis Bank',
      error: error.response?.data || error.message
    };
  }
}

/**
 * Fetch token from Axis Bank UPI service
 * @param {Object} params - Token request parameters
 * @param {string} params.customerId - Unique identifier of the customer
 * @param {string} params.type - Type of token (INITIAL or ROTATE)
 * @param {string} params.challenge - Challenge string
 * @param {number} params.testId - Test ID for response type (1=Success, 2=No records found, 90=Invalid Input, 91=Backend Failure)
 * @param {string} params.requestUUID - Unique request UUID
 * @param {string} params.serviceRequestId - Service request ID
 * @param {string} params.serviceRequestVersion - Service request version
 * @param {string} params.channelId - Channel ID
 * @returns {Promise<Object>} Token response
 */
async function getToken(params) {
  try {
    const {
      customerId,
      type,
      challenge,
      testId = 1,
      requestUUID,
      serviceRequestId,
      serviceRequestVersion,
      channelId
    } = params;

    // Define API URL for get-token
    const apiUrl = `${AXIS_API_BASE_URL}/get-token`;

    // Construct query parameters
    const queryParams = new URLSearchParams({
      customerId,
      type,
      challenge
    }).toString();

    // Make API request to Axis Bank
    const response = await axios({
      method: 'GET',
      url: `${apiUrl}?${queryParams}`,
      headers: {
        'X-IBM-Client-Id': AXIS_CLIENT_ID,
        'X-IBM-Client-Secret': AXIS_CLIENT_SECRET,
        'X-AXIS-TEST-ID': testId.toString(),
        'X-AXIS-serviceRequestId': serviceRequestId,
        'X-AXIS-serviceRequestVersion': serviceRequestVersion,
        'X-AXIS-channelId': channelId,
        'X-Axis-requestUUID': requestUUID,
        'Accept': 'application/json'
      }
    });

    // If successful, generate a formatted response based on the API response
    const responseData = {
      GetTokenResponse: {
        SubHeader: {
          requestUUID,
          serviceRequestId,
          serviceRequestVersion,
          channelId
        },
        GetTokenResponseBody: {
          code: "00",
          result: "success",
          data: response.data?.GetTokenResponse?.GetTokenResponseBody?.data || 
                // Generate mock token data for test responses based on testId
                testId === 1 
                  ? `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${Buffer.from(JSON.stringify({
                      customerId,
                      type,
                      timestamp: new Date().toISOString()
                    })).toString('base64').replace(/=/g, '')}.mockSignature`
                  : ""
        }
      }
    };

    // Handle different test cases
    if (testId === 2) {
      // No records found
      responseData.GetTokenResponse.GetTokenResponseBody.code = "01";
      responseData.GetTokenResponse.GetTokenResponseBody.result = "no_records_found";
      responseData.GetTokenResponse.GetTokenResponseBody.data = "";
    } else if (testId === 90) {
      // Invalid input
      responseData.GetTokenResponse.GetTokenResponseBody.code = "90";
      responseData.GetTokenResponse.GetTokenResponseBody.result = "invalid_input";
      responseData.GetTokenResponse.GetTokenResponseBody.data = "";
    } else if (testId === 91) {
      // Backend failure
      responseData.GetTokenResponse.GetTokenResponseBody.code = "91";
      responseData.GetTokenResponse.GetTokenResponseBody.result = "backend_failure";
      responseData.GetTokenResponse.GetTokenResponseBody.data = "";
    }

    return responseData;
  } catch (error) {
    // Handle error
    console.error('Axis Bank Get Token API Error:', error.response?.data || error.message);
    
    // Throw a formatted error
    throw {
      status: error.response?.status || 500,
      message: error.response?.data?.message || 'Failed to fetch token from Axis Bank',
      error: error.response?.data || error.message
    };
  }
}

/**
 * Set VPA via Axis Bank UPI service
 * @param {Object} requestData - Complete request data including SubHeader and SetVPARequestBody
 * @param {number} testId - Test ID for response type (1=Success, 2=No records found, 90=Invalid Input, 91=Backend Failure)
 * @returns {Promise<Object>} Set VPA response
 */
async function setVpa(requestData, testId = 1) {
  try {
    // Define API URL for set-vpa
    const apiUrl = process.env.AXIS_API_UPI_SET_VPA_URL || 'https://apiportal.axisbank.com/gateway/openapi/v2/upi/vpa/set-vpa';

    // Make API request to Axis Bank
    const response = await axios({
      method: 'POST',
      url: apiUrl,
      headers: {
        'X-IBM-Client-Id': AXIS_CLIENT_ID,
        'X-IBM-Client-Secret': AXIS_CLIENT_SECRET,
        'X-AXIS-TEST-ID': testId.toString(),
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: requestData
    });

    // If successful, return the response data or generate a mock response if needed
    if (response.data) {
      return response.data;
    }

    // Generate a mock response based on testId if no actual response is received
    return generateSetVpaResponse(requestData, testId);
  } catch (error) {
    // Handle error
    console.error('Axis Bank Set VPA API Error:', error.response?.data || error.message);
    
    // Throw a formatted error
    throw {
      status: error.response?.status || 500,
      message: error.response?.data?.message || 'Failed to set VPA with Axis Bank',
      error: error.response?.data || error.message
    };
  }
}

/**
 * Helper function to generate a mock Set VPA response
 * @param {Object} requestData - The original request data
 * @param {number} testId - Test ID for response type
 * @returns {Object} A mock Set VPA response
 */
function generateSetVpaResponse(requestData, testId) {
  const subHeader = requestData.SubHeader || {
    requestUUID: uuidv4(),
    serviceRequestId: "NB.GEN.PDT.ELIG",
    serviceRequestVersion: "1.0",
    channelId: "TEST"
  };

  // Default success response
  const response = {
    SubHeader: subHeader,
    SetVPAResponseBody: {
      code: "00",
      result: "Success",
      data: ""
    }
  };

  // Modify response based on testId
  if (testId === 2) {
    // No records found
    response.SetVPAResponseBody.code = "01";
    response.SetVPAResponseBody.result = "No records found";
  } else if (testId === 90) {
    // Invalid input
    response.SetVPAResponseBody.code = "90";
    response.SetVPAResponseBody.result = "Invalid Input";
  } else if (testId === 91) {
    // Backend failure
    response.SetVPAResponseBody.code = "91";
    response.SetVPAResponseBody.result = "Backend Failure";
  }

  return response;
}

/**
 * Check VPA availability via Axis Bank UPI service
 * @param {Object} params - VPA availability request parameters
 * @param {string} params.customerId - Unique identifier of the customer (optional)
 * @param {string} params.vpa - Virtual Primary Address (optional)
 * @param {string} params.applicationID - Application unique ID (optional)
 * @param {number} params.testId - Test ID for response type (1=Success, 2=No records found, 90=Invalid Input, 91=Backend Failure)
 * @param {string} params.requestUUID - Unique request UUID
 * @param {string} params.serviceRequestId - Service request ID
 * @param {string} params.serviceRequestVersion - Service request version
 * @param {string} params.channelId - Channel ID
 * @returns {Promise<Object>} VPA availability response
 */
async function checkVpaAvailability(params) {
  try {
    const {
      customerId,
      vpa,
      applicationID,
      testId = 1,
      requestUUID,
      serviceRequestId,
      serviceRequestVersion,
      channelId
    } = params;

    // Define API URL for vpa-availability
    const apiUrl = process.env.AXIS_API_UPI_VPA_AVAILABILITY_URL || 'https://apiportal.axisbank.com/gateway/openapi/v2/upi/vpa/vpa-availibility';

    // Construct query parameters
    const queryParams = new URLSearchParams();
    if (customerId) queryParams.append('customerId', customerId);
    if (vpa) queryParams.append('vpa', vpa);
    if (applicationID) queryParams.append('applicationID', applicationID);

    // Make API request to Axis Bank
    const response = await axios({
      method: 'GET',
      url: `${apiUrl}?${queryParams.toString()}`,
      headers: {
        'X-IBM-Client-Id': AXIS_CLIENT_ID,
        'X-IBM-Client-Secret': AXIS_CLIENT_SECRET,
        'X-AXIS-TEST-ID': testId.toString(),
        'X-AXIS-serviceRequestId': serviceRequestId,
        'X-AXIS-serviceRequestVersion': serviceRequestVersion,
        'X-AXIS-channelId': channelId,
        'X-Axis-requestUUID': requestUUID,
        'Accept': 'application/json'
      }
    });

    // If successful, return the response data or generate a mock response if needed
    if (response.data) {
      return response.data;
    }

    // Generate a mock response based on testId if no actual response is received
    return generateVpaAvailabilityResponse(params, testId);
  } catch (error) {
    // Handle error
    console.error('Axis Bank VPA Availability API Error:', error.response?.data || error.message);
    
    // Throw a formatted error
    throw {
      status: error.response?.status || 500,
      message: error.response?.data?.message || 'Failed to check VPA availability with Axis Bank',
      error: error.response?.data || error.message
    };
  }
}

/**
 * Helper function to generate a mock VPA Availability response
 * @param {Object} params - The original request parameters
 * @param {number} testId - Test ID for response type
 * @returns {Object} A mock VPA Availability response
 */
function generateVpaAvailabilityResponse(params, testId) {
  const {
    customerId,
    vpa,
    requestUUID,
    serviceRequestId,
    serviceRequestVersion,
    channelId
  } = params;

  // Default success response
  const response = {
    CheckVPAAvailibilityResponse: {
      SubHeader: {
        requestUUID: requestUUID || uuidv4(),
        serviceRequestId: serviceRequestId || "NB.GEN.PDT.ELIG",
        serviceRequestVersion: serviceRequestVersion || "1.0",
        channelId: channelId || "TEST"
      },
      CheckVPAAvailibilityResponseBody: {
        code: "00",
        result: "Success",
        data: {
          mobilenumber: customerId || "919010852345",
          vpa: vpa 
            ? [vpa] 
            : ["user1@axis", "user2@axis"]
        }
      }
    }
  };

  // Modify response based on testId
  if (testId === 2) {
    // No records found
    response.CheckVPAAvailibilityResponse.CheckVPAAvailibilityResponseBody.code = "01";
    response.CheckVPAAvailibilityResponse.CheckVPAAvailibilityResponseBody.result = "No records found";
    response.CheckVPAAvailibilityResponse.CheckVPAAvailibilityResponseBody.data = {};
  } else if (testId === 90) {
    // Invalid input
    response.CheckVPAAvailibilityResponse.CheckVPAAvailibilityResponseBody.code = "90";
    response.CheckVPAAvailibilityResponse.CheckVPAAvailibilityResponseBody.result = "Invalid Input";
    response.CheckVPAAvailibilityResponse.CheckVPAAvailibilityResponseBody.data = {};
  } else if (testId === 91) {
    // Backend failure
    response.CheckVPAAvailibilityResponse.CheckVPAAvailibilityResponseBody.code = "91";
    response.CheckVPAAvailibilityResponse.CheckVPAAvailibilityResponseBody.result = "Backend Failure";
    response.CheckVPAAvailibilityResponse.CheckVPAAvailibilityResponseBody.data = {};
  }

  return response;
}

/**
 * Verify VPA via Axis Bank UPI service
 * @param {Object} requestData - Complete request data including SubHeader and VerifyVPARequestBody
 * @param {number} testId - Test ID for response type (1=P2P Success, 2=P2M Success, 90=Invalid Input, others=Backend Failure)
 * @returns {Promise<Object>} Verify VPA response
 */
async function verifyVpa(requestData, testId = 1) {
  try {
    // Define API URL for verify-vpa
    const apiUrl = process.env.AXIS_API_UPI_VERIFY_VPA_URL || 'https://apiportal.axisbank.com/gateway/openapi/v2/upi/vpa/verify';

    // Make API request to Axis Bank
    const response = await axios({
      method: 'POST',
      url: apiUrl,
      headers: {
        'X-IBM-Client-Id': AXIS_CLIENT_ID,
        'X-IBM-Client-Secret': AXIS_CLIENT_SECRET,
        'X-AXIS-TEST-ID': testId.toString(),
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: requestData
    });

    // If successful, return the response data or generate a mock response if needed
    if (response.data) {
      return response.data;
    }

    // Generate a mock response based on testId if no actual response is received
    return generateVerifyVpaResponse(requestData, testId);
  } catch (error) {
    // Handle error
    console.error('Axis Bank Verify VPA API Error:', error.response?.data || error.message);
    
    // Throw a formatted error
    throw {
      status: error.response?.status || 500,
      message: error.response?.data?.message || 'Failed to verify VPA with Axis Bank',
      error: error.response?.data || error.message
    };
  }
}

/**
 * Helper function to generate a mock Verify VPA response
 * @param {Object} requestData - The original request data
 * @param {number} testId - Test ID for response type
 * @returns {Object} A mock Verify VPA response
 */
function generateVerifyVpaResponse(requestData, testId) {
  const subHeader = requestData.SubHeader || {
    requestUUID: uuidv4(),
    serviceRequestId: "NB.GEN.PDT.ELIG",
    serviceRequestVersion: "1.0",
    channelId: "TEST"
  };
  
  const { vpa, customerid } = requestData.VerifyVPARequestBody || {};

  // Default P2P success response (testId = 1)
  const response = {
    VerifyVPAResponse: {
      SubHeader: subHeader,
      VerifyVPAResponseBody: {
        code: "00",
        result: "Success",
        data: {
          name: "John Doe",
          accType: "SAVINGS",
          vpa: vpa || "user@axis",
          accountnumber: "",
          ifsc: "",
          mcc: "0000",
          customerId: customerid || "9087654321",
          merchantName: "",
          merchantCategory: ""
        }
      }
    }
  };

  // Modify response based on testId
  if (testId === 2) {
    // P2M Success
    response.VerifyVPAResponse.VerifyVPAResponseBody.data.merchantName = "Test Merchant";
    response.VerifyVPAResponse.VerifyVPAResponseBody.data.merchantCategory = "Retail";
  } else if (testId === 90) {
    // Invalid input
    response.VerifyVPAResponse.VerifyVPAResponseBody.code = "90";
    response.VerifyVPAResponse.VerifyVPAResponseBody.result = "Invalid Input";
    response.VerifyVPAResponse.VerifyVPAResponseBody.data = {};
  } else if (testId !== 1) {
    // Backend failure
    response.VerifyVPAResponse.VerifyVPAResponseBody.code = "91";
    response.VerifyVPAResponse.VerifyVPAResponseBody.result = "Backend Failure";
    response.VerifyVPAResponse.VerifyVPAResponseBody.data = {};
  }

  return response;
}

/**
 * Set/Reset MPIN for UPI
 * @param {Object} payload - Request payload
 * @param {string} testId - Test ID to determine response type
 * @returns {Object} Response data
 * @throws {Object} Error with statusCode
 */
async function setResetMpin(payload, testId) {
  try {
    // Get client credentials from environment variables
    const clientId = process.env.AXIS_CLIENT_ID || '078d5c0393e264476debb8b6721b3628';
    const clientSecret = process.env.AXIS_CLIENT_SECRET || '9a11abd2ba1dac20755e87d76343cb31';

    // Base URL for Axis Bank API
    const baseUrl = process.env.AXIS_BASE_URL || 'https://apiportal.axisbank.com/gateway/openapi';
    const endpoint = '/v1/upi/accountregistration/v1/setresetmpinrequest';

    // Construct request URL
    const requestUrl = `${baseUrl}${endpoint}`;

    // Create headers
    const headers = {
      'X-IBM-Client-Id': clientId,
      'X-IBM-Client-Secret': clientSecret,
      'X-AXIS-TEST-ID': testId,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    // For testing purposes, return mock responses based on test ID
    if (process.env.NODE_ENV === 'test' || process.env.MOCK_AXIS_API === 'true') {
      return getMockSetResetMpinResponse(testId, payload);
    }

    // Make actual API call to Axis Bank
    const response = await axios({
      method: 'POST',
      url: requestUrl,
      headers: headers,
      data: payload
    });

    return response.data;
  } catch (error) {
    console.error('Error in setResetMpin service:', error);
    
    // Check if it's an Axios error with response
    if (error.response) {
      throw {
        message: 'Error from Axis Bank API',
        statusCode: error.response.status,
        errors: error.response.data
      };
    }

    // For other errors
    throw {
      message: error.message || 'Internal server error',
      statusCode: 500
    };
  }
}

/**
 * Get mock response for UPI Set Reset MPIN API
 * @param {string} testId - Test ID for response
 * @param {Object} payload - Request payload
 * @returns {Object} Mock response
 */
function getMockSetResetMpinResponse(testId, payload) {
  // Extract SubHeader from the request payload
  const subHeader = payload.SetResetMPINRequest?.SubHeader || {
    requestUUID: '97f6b07e-b82d-4fed-9c57-80088ba23e30',
    serviceRequestId: 'NB.GEN.PDT.ELIG',
    serviceRequestVersion: '1.0',
    channelId: 'TEST'
  };

  // Success response
  if (testId === '1') {
    return {
      SubHeader: subHeader,
      SetResetMPINResponseBody: {
        code: '00',
        Status: 'Success'
      }
    };
  }
  
  // Customer Accounts not found
  if (testId === '3') {
    return {
      SubHeader: subHeader,
      SetResetMPINResponseBody: {
        code: '01',
        Status: 'Customer Accounts Not Found'
      }
    };
  }

  // Default case - Invalid test ID
  return {
    SubHeader: subHeader,
    SetResetMPINResponseBody: {
      code: '99',
      Status: 'Invalid Test ID'
    }
  };
}

module.exports = {
  registerCustomer,
  requestOtp,
  fetchCustomerAccounts,
  getToken,
  setVpa,
  checkVpaAvailability,
  verifyVpa,
  setResetMpin
}; 











// The real code for making UPI customer registration requests to Axis Bank in production would be almost identical to what we've already implemented. The key differences would be:
// Using real customer data instead of test data
// Not using the test ID parameter in production
// Handling the actual response from Axis Bank's production system
// Here's a sample code snippet showing how a real production API call would be made:


// // In your application code where you need to register a customer:
// const axios = require('axios');
// const { v4: uuidv4 } = require('uuid');

// async function registerCustomerWithAxisBank(customerData) {
//   try {
//     // Generate a unique request UUID for this transaction
//     const requestUUID = uuidv4();
    
//     // Prepare the actual request payload with real customer data
//     const payload = {
//       CustomerRegistrationRequest: {
//         SubHeader: {
//           requestUUID,
//           serviceRequestId: "NB.GEN.JDT",
//           serviceRequestVersion: "1.0",
//           channelId: "PROD" // May change to a production channel ID
//         },
//         CustomerRegistrationRequestBody: {
//           customerId: customerData.mobileNumber,
//           deviceInfo: {
//             app: customerData.deviceInfo.app,
//             capacity: customerData.deviceInfo.capacity,
//             gcmid: customerData.deviceInfo.gcmid,
//             geocode: customerData.deviceInfo.geocode,
//             id: customerData.deviceInfo.deviceId,
//             ip: customerData.deviceInfo.ip,
//             location: customerData.deviceInfo.location,
//             mobile: customerData.mobileNumber,
//             os: customerData.deviceInfo.os,
//             type: customerData.deviceInfo.deviceModel,
//             version: customerData.deviceInfo.appVersion,
//             telecom: customerData.deviceInfo.telecom
//           },
//           mobilenumber: customerData.mobileNumber,
//           name: customerData.name,
//           action: "register",
//           vpa: customerData.vpa,
//           type: customerData.accountType, // "Customer" or "Merchant"
//           smstext: "Welcome to UPI service",
//           aggregator: customerData.aggregator || ""
//         }
//       }
//     };

//     // Make the actual API call to Axis Bank
//     const response = await axios({
//       method: 'POST',
//       url: 'https://apiportal.axisbank.com/gateway/openapi/v2/upi/customerregistration/customer-registration',
//       headers: {
//         'X-IBM-Client-Id': process.env.AXIS_CLIENT_ID,
//         'X-IBM-Client-Secret': process.env.AXIS_CLIENT_SECRET,
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//       },
//       data: payload
//     });

//     // Process the real response from Axis Bank
//     if (response.data.CustomerRegistrationResponse?.CustomerRegistrationResponseBody?.code === "00") {
//       // Registration successful
//       return {
//         success: true,
//         customerDetails: response.data.CustomerRegistrationResponse.CustomerRegistrationResponseBody.data,
//         message: "Customer registered successfully with UPI"
//       };
//     } else {
//       // Registration failed with specific error
//       return {
//         success: false,
//         errorCode: response.data.CustomerRegistrationResponse?.CustomerRegistrationResponseBody?.code,
//         errorMessage: response.data.CustomerRegistrationResponse?.CustomerRegistrationResponseBody?.result
//       };
//     }
//   } catch (error) {
//     // Handle network or unexpected errors
//     console.error("UPI Registration Error:", error.message);
//     throw {
//       success: false,
//       message: "Failed to register customer with UPI",
//       error: error.response?.data || error.message
//     };
//   }
// }

// // Example usage with real customer data
// async function onboardCustomer(customerData) {
//   try {
//     // Collect customer data from your application
//     const customer = {
//       name: "Pratik Sharma",
//       mobileNumber: "9198765432",
//       vpa: "pratik@yourbank",
//       accountType: "Customer",
//       deviceInfo: {
//         app: "com.yourcompany.upi",
//         deviceId: "A45B7C23D98E",
//         deviceModel: "SM-G998B",
//         appVersion: "2.3.1",
//         os: "Android 13",
//         ip: customerIpAddress, // Dynamically captured
//         location: "Bangalore", 
//         gcmid: customerFcmToken, // Firebase Cloud Messaging token
//         geocode: "12.9716,77.5946", // Actual location coordinates
//         telecom: "Airtel",
//         capacity: "128GB"
//       }
//     };
    
//     // Register with Axis Bank UPI
//     const registrationResult = await registerCustomerWithAxisBank(customer);
    
//     if (registrationResult.success) {
//       // Update your database with UPI registration status
//       await updateCustomerUpiStatus(customer.mobileNumber, true, registrationResult.customerDetails);
//       return {
//         success: true,
//         message: "UPI registration successful",
//         vpa: customer.vpa
//       };
//     } else {
//       // Handle registration failure
//       await logUpiRegistrationFailure(customer.mobileNumber, registrationResult.errorCode, registrationResult.errorMessage);
//       throw new Error(`UPI registration failed: ${registrationResult.errorMessage}`);
//     }
//   } catch (error) {
//     console.error("Customer onboarding failed:", error);
//     throw error;
//   }
// }



