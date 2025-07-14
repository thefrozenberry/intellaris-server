/**
 * Transaction Service for handling payment operations
 */

/**
 * Process a UPI payment request
 * 
 * @param {Object} payRequestData - Pay request data
 * @param {number} testId - Test ID for response simulation
 * @returns {Object} Payment response
 */
async function processPayRequest(payRequestData, testId) {
  // In a real implementation, this would call the Axis Bank API
  // For now, we'll simulate different responses based on testId
  
  try {
    // Log the request for debugging (should be removed in production)
    console.log(`Processing payment request with testId: ${testId}`);
    
    if (testId === 1) {
      // Success response
      return {
        PayResponse: {
          SubHeader: {
            responseUUID: "d8e8fca2-dc0f-11e9-96d7-1fb272eff6c5",
            serviceResponseId: "NB.GEN.PDT.PAY",
            serviceResponseVersion: "1.0",
            channelId: "TEST"
          },
          PayResponseBody: {
            result: "SUCCESS",
            txnId: payRequestData.PayRequest.PayRequestBody.txnId,
            rrn: "12345678901234",
            upiTransactionId: "UPI12345678901234",
            npciTransactionId: "NPCI12345678901234",
            customerId: payRequestData.PayRequest.PayRequestBody.customerId,
            amount: payRequestData.PayRequest.PayRequestBody.amount,
            txnStatus: "COMPLETED",
            txnApprovalDateTime: new Date().toISOString(),
            responseCode: "00",
            responseDesc: "Transaction successful"
          }
        }
      };
    } else if (testId === 3) {
      // Invalid input error
      throw {
        status: 400,
        message: "Invalid input parameters",
        error: {
          errors: [
            {
              errorCode: "E40001",
              errorMessage: "Mandatory field missing",
              errorDescription: "One or more mandatory fields are missing or invalid"
            }
          ]
        }
      };
    } else {
      // Invalid test ID error
      throw {
        status: 400,
        message: "Invalid test ID",
        error: {
          errors: [
            {
              errorCode: "E40002",
              errorMessage: "Invalid test ID",
              errorDescription: "The provided test ID is not supported"
            }
          ]
        }
      };
    }
  } catch (error) {
    // Rethrow the error to be handled by the controller
    throw error;
  }
}

/**
 * Process a UPI collect request
 * 
 * @param {Object} collectRequestData - Collect request data
 * @param {number} testId - Test ID for response simulation
 * @returns {Object} Collect response
 */
async function processCollectRequest(collectRequestData, testId) {
  // In a real implementation, this would call the Axis Bank API
  // For now, we'll simulate different responses based on testId
  
  try {
    // Log the request for debugging (should be removed in production)
    console.log(`Processing collect request with testId: ${testId}`);
    
    if (testId === 1) {
      // Success response
      return {
        SubHeader: {
          requestUUID: collectRequestData.CollectRequest.SubHeader.requestUUID,
          serviceRequestId: collectRequestData.CollectRequest.SubHeader.serviceRequestId,
          serviceRequestVersion: collectRequestData.CollectRequest.SubHeader.serviceRequestVersion,
          channelId: collectRequestData.CollectRequest.SubHeader.channelId
        },
        CollectResponseBody: {
          code: "00",
          status: "Success",
          data: Buffer.from(JSON.stringify({
            txnId: collectRequestData.CollectRequest.CollectRequestBody.txnId,
            collectRefId: "COLL" + Math.random().toString(36).substring(2, 15),
            payerVpa: collectRequestData.CollectRequest.CollectRequestBody.payerVpa,
            vpa: collectRequestData.CollectRequest.CollectRequestBody.vpa,
            amount: collectRequestData.CollectRequest.CollectRequestBody.amount,
            requestTimestamp: new Date().toISOString()
          })).toString('base64')
        }
      };
    } else if (testId === 3) {
      // Invalid input error
      throw {
        status: 400,
        message: "Invalid input parameters",
        error: {
          errors: [
            {
              errorCode: "E40001",
              errorMessage: "Mandatory field missing",
              errorDescription: "One or more mandatory fields are missing or invalid"
            }
          ]
        }
      };
    } else {
      // Invalid test ID error
      throw {
        status: 400,
        message: "Invalid test ID",
        error: {
          errors: [
            {
              errorCode: "E40002",
              errorMessage: "Invalid test ID",
              errorDescription: "The provided test ID is not supported"
            }
          ]
        }
      };
    }
  } catch (error) {
    // Rethrow the error to be handled by the controller
    throw error;
  }
}

/**
 * Process a UPI collect approve request
 * 
 * @param {Object} collectApproveRequestData - Collect approve request data
 * @param {number} testId - Test ID for response simulation
 * @returns {Object} Collect approve response
 */
async function processCollectApprove(collectApproveRequestData, testId) {
  // In a real implementation, this would call the Axis Bank API
  // For now, we'll simulate different responses based on testId
  
  try {
    // Log the request for debugging (should be removed in production)
    console.log(`Processing collect approve request with testId: ${testId}`);
    
    if (testId === 1) {
      // Success response
      return {
        SubHeader: {
          requestUUID: collectApproveRequestData.CollectApproveRequest.SubHeader.requestUUID,
          serviceRequestId: collectApproveRequestData.CollectApproveRequest.SubHeader.serviceRequestId,
          serviceRequestVersion: collectApproveRequestData.CollectApproveRequest.SubHeader.serviceRequestVersion,
          channelId: collectApproveRequestData.CollectApproveRequest.SubHeader.channelId
        },
        CollectApproveResponseBody: {
          code: "00",
          status: "Success",
          data: Buffer.from(JSON.stringify({
            txnId: collectApproveRequestData.CollectApproveRequest.CollectApproveRequestBody.txnId,
            customerId: collectApproveRequestData.CollectApproveRequest.CollectApproveRequestBody.customerId,
            approvalTimestamp: new Date().toISOString(),
            status: "APPROVED",
            rrn: "RRN" + Math.random().toString(36).substring(2, 10),
            upiTransactionId: "UPI" + Math.random().toString(36).substring(2, 10)
          })).toString('base64')
        }
      };
    } else if (testId === 3) {
      // Invalid input error
      throw {
        status: 400,
        message: "Invalid input parameters",
        error: {
          errors: [
            {
              errorCode: "E40001",
              errorMessage: "Mandatory field missing",
              errorDescription: "One or more mandatory fields are missing or invalid"
            }
          ]
        }
      };
    } else {
      // Invalid test ID error
      throw {
        status: 400,
        message: "Invalid test ID",
        error: {
          errors: [
            {
              errorCode: "E40002",
              errorMessage: "Invalid test ID",
              errorDescription: "The provided test ID is not supported"
            }
          ]
        }
      };
    }
  } catch (error) {
    // Rethrow the error to be handled by the controller
    throw error;
  }
}

/**
 * Process a UPI collect decline request
 * 
 * @param {Object} collectDeclineRequestData - Collect decline request data
 * @param {number} testId - Test ID for response simulation
 * @returns {Object} Collect decline response
 */
async function processCollectDecline(collectDeclineRequestData, testId) {
  // In a real implementation, this would call the Axis Bank API
  // For now, we'll simulate different responses based on testId
  
  try {
    // Log the request for debugging (should be removed in production)
    console.log(`Processing collect decline request with testId: ${testId}`);
    
    if (testId === 1) {
      // Success response
      return {
        SubHeader: {
          requestUUID: collectDeclineRequestData.CollectDeclineRequest.SubHeader.requestUUID,
          serviceRequestId: collectDeclineRequestData.CollectDeclineRequest.SubHeader.serviceRequestId,
          serviceRequestVersion: collectDeclineRequestData.CollectDeclineRequest.SubHeader.serviceRequestVersion,
          channelId: collectDeclineRequestData.CollectDeclineRequest.SubHeader.channelId
        },
        CollectDeclineResponseBody: {
          code: "00",
          status: "Success",
          data: Buffer.from(JSON.stringify({
            txnid: collectDeclineRequestData.CollectDeclineRequest.CollectDeclineRequestBody.txnid,
            payerVpa: collectDeclineRequestData.CollectDeclineRequest.CollectDeclineRequestBody.payerVpa,
            payeeVpa: collectDeclineRequestData.CollectDeclineRequest.CollectDeclineRequestBody.payeeVpa,
            mobile: collectDeclineRequestData.CollectDeclineRequest.CollectDeclineRequestBody.mobile,
            status: "DECLINED",
            declineTimestamp: new Date().toISOString()
          })).toString('base64')
        }
      };
    } else if (testId === 3) {
      // Invalid input error
      throw {
        status: 400,
        message: "Invalid input parameters",
        error: {
          errors: [
            {
              errorCode: "E40001",
              errorMessage: "Mandatory field missing",
              errorDescription: "One or more mandatory fields are missing or invalid"
            }
          ]
        }
      };
    } else {
      // Invalid test ID error
      throw {
        status: 400,
        message: "Invalid test ID",
        error: {
          errors: [
            {
              errorCode: "E40002",
              errorMessage: "Invalid test ID",
              errorDescription: "The provided test ID is not supported"
            }
          ]
        }
      };
    }
  } catch (error) {
    // Rethrow the error to be handled by the controller
    throw error;
  }
}

/**
 * Process a UPI self payment request
 * 
 * @param {Object} selfPayRequestData - Self payment request data
 * @param {string} testId - Test ID for response simulation
 * @returns {Object} Self payment response
 */
async function processSelfPay(selfPayRequestData, testId) {
  // In a real implementation, this would call the Axis Bank API
  // For now, we'll simulate different responses based on testId
  
  try {
    // Log the request for debugging (should be removed in production)
    console.log(`Processing self payment request with testId: ${testId}`);
    
    if (testId === '1') {
      // Success response
      return {
        SubHeader: {
          requestUUID: selfPayRequestData.SelfPayRequest.SubHeader.requestUUID,
          serviceRequestId: selfPayRequestData.SelfPayRequest.SubHeader.serviceRequestId,
          serviceRequestVersion: selfPayRequestData.SelfPayRequest.SubHeader.serviceRequestVersion,
          channelId: selfPayRequestData.SelfPayRequest.SubHeader.channelId
        },
        SelfPayResponseBody: {
          code: "00",
          status: "Success",
          data: Buffer.from(JSON.stringify({
            txnId: selfPayRequestData.SelfPayRequest.SelfPayRequestBody.txnId,
            customerId: selfPayRequestData.SelfPayRequest.SelfPayRequestBody.customerId,
            amount: selfPayRequestData.SelfPayRequest.SelfPayRequestBody.amount,
            sourceAccount: selfPayRequestData.SelfPayRequest.SelfPayRequestBody.ac.accRefNumber,
            destinationAccount: selfPayRequestData.SelfPayRequest.SelfPayRequestBody.payeeAccount || 
                               (selfPayRequestData.SelfPayRequest.SelfPayRequestBody.payees && 
                                selfPayRequestData.SelfPayRequest.SelfPayRequestBody.payees[0] && 
                                selfPayRequestData.SelfPayRequest.SelfPayRequestBody.payees[0].accRefNumber),
            status: "COMPLETED",
            timestamp: new Date().toISOString(),
            rrn: "RRN" + Math.random().toString(36).substring(2, 10),
            upiTransactionId: "UPI" + Math.random().toString(36).substring(2, 10)
          })).toString('base64')
        }
      };
    } else if (testId === '3') {
      // Invalid input error
      throw {
        status: 400,
        message: "Invalid input parameters",
        error: {
          errors: [
            {
              errorCode: "E40001",
              errorMessage: "Mandatory field missing",
              errorDescription: "One or more mandatory fields are missing or invalid"
            }
          ]
        }
      };
    } else {
      // Invalid test ID error
      throw {
        status: 400,
        message: "Invalid test ID",
        error: {
          errors: [
            {
              errorCode: "E40002",
              errorMessage: "Invalid test ID",
              errorDescription: "The provided test ID is not supported"
            }
          ]
        }
      };
    }
  } catch (error) {
    // Rethrow the error to be handled by the controller
    throw error;
  }
}

/**
 * Get the status of a UPI transaction
 * 
 * @param {Object} transactionStatusRequestData - Transaction status request data
 * @param {number} testId - Test ID for response simulation
 * @returns {Object} Transaction status response
 */
async function getTransactionStatus(transactionStatusRequestData, testId) {
  // In a real implementation, this would call the Axis Bank API
  // For now, we'll simulate different responses based on testId
  
  try {
    // Log the request for debugging (should be removed in production)
    console.log(`Processing transaction status request with testId: ${testId}`);
    
    if (testId === 1) {
      // Success response for a completed transaction
      return {
        SubHeader: {
          responseUUID: "d8e8fca2-dc0f-11e9-96d7-" + Math.random().toString(36).substring(2, 15),
          serviceResponseId: "NB.GEN.UPIAPI.TXNSTATUS",
          serviceResponseVersion: "3.0",
          channelId: transactionStatusRequestData.TransactionStatusRequest.SubHeader.channelId
        },
        TransactionStatusResponseBody: {
          code: "00",
          status: "Success",
          data: Buffer.from(JSON.stringify({
            tranId: transactionStatusRequestData.TransactionStatusRequest.TransactionStatusRequestBody.tranId,
            mobileNumber: transactionStatusRequestData.TransactionStatusRequest.TransactionStatusRequestBody.mobileNumber,
            transactionStatus: "SUCCESS",
            txnType: "PAY",
            amount: "1000.00",
            transactionTimestamp: new Date().toISOString(),
            remitterAccount: {
              accountNumber: "XXXX1234",
              vpa: "sender@upi",
              accountHolder: "John Doe",
              bankName: "Axis Bank"
            },
            beneficiaryAccount: {
              accountNumber: "XXXX5678",
              vpa: "receiver@upi",
              accountHolder: "Jane Smith",
              bankName: "HDFC Bank"
            },
            upiTransactionId: "UPI" + Math.random().toString(36).substring(2, 15),
            npciTransactionId: "NPCI" + Math.random().toString(36).substring(2, 15),
            rrn: "RRN" + Math.random().toString(36).substring(2, 15)
          })).toString('base64')
        }
      };
    } else if (testId === 2) {
      // Success response for a pending transaction
      return {
        SubHeader: {
          responseUUID: "d8e8fca2-dc0f-11e9-96d7-" + Math.random().toString(36).substring(2, 15),
          serviceResponseId: "NB.GEN.UPIAPI.TXNSTATUS",
          serviceResponseVersion: "3.0",
          channelId: transactionStatusRequestData.TransactionStatusRequest.SubHeader.channelId
        },
        TransactionStatusResponseBody: {
          code: "00",
          status: "Success",
          data: Buffer.from(JSON.stringify({
            tranId: transactionStatusRequestData.TransactionStatusRequest.TransactionStatusRequestBody.tranId,
            mobileNumber: transactionStatusRequestData.TransactionStatusRequest.TransactionStatusRequestBody.mobileNumber,
            transactionStatus: "PENDING",
            txnType: "COLLECT",
            amount: "500.00",
            transactionTimestamp: new Date().toISOString(),
            remitterAccount: {
              vpa: "sender@upi"
            },
            beneficiaryAccount: {
              vpa: "receiver@upi"
            },
            upiTransactionId: "UPI" + Math.random().toString(36).substring(2, 15)
          })).toString('base64')
        }
      };
    } else if (testId === 3) {
      // Invalid input error
      throw {
        status: 400,
        message: "Invalid input parameters",
        error: {
          errors: [
            {
              errorCode: "E40001",
              errorMessage: "Mandatory field missing",
              errorDescription: "One or more mandatory fields are missing or invalid"
            }
          ]
        }
      };
    } else if (testId === 4) {
      // Transaction not found error
      throw {
        status: 404,
        message: "Transaction not found",
        error: {
          errors: [
            {
              errorCode: "E40404",
              errorMessage: "Transaction not found",
              errorDescription: "No transaction found with the provided ID"
            }
          ]
        }
      };
    } else {
      // Invalid test ID error
      throw {
        status: 400,
        message: "Invalid test ID",
        error: {
          errors: [
            {
              errorCode: "E40002",
              errorMessage: "Invalid test ID",
              errorDescription: "The provided test ID is not supported"
            }
          ]
        }
      };
    }
  } catch (error) {
    // Rethrow the error to be handled by the controller
    throw error;
  }
}

/**
 * Get UPI transaction history between two dates
 * 
 * @param {string} fromDate - Start date in format dd/MM/yyyy
 * @param {string} toDate - End date in format dd/MM/yyyy
 * @param {Object} requestHeaders - Request headers from API Connect
 * @param {number} testId - Test ID for response simulation
 * @returns {Object} Transaction history response
 */
async function getTransactionHistory(fromDate, toDate, requestHeaders, testId) {
  // In a real implementation, this would call the Axis Bank API
  // For now, we'll simulate different responses based on testId
  
  try {
    // Log the request for debugging (should be removed in production)
    console.log(`Processing transaction history request with testId: ${testId}, fromDate: ${fromDate}, toDate: ${toDate}`);
    
    // Set default dates if not provided
    const startDate = fromDate || '01/01/2023';
    const endDate = toDate || new Date().toLocaleDateString('en-GB'); // Current date in dd/MM/yyyy format
    
    if (testId === 1) {
      // Success response with transaction history
      return {
        SubHeader: {
          requestUUID: requestHeaders.requestUUID || "97f6b07e-b82d-4fed-9c57-80088ba23e30",
          serviceRequestId: requestHeaders.serviceRequestId || "NB.GEN.PDT.ELIG",
          serviceRequestVersion: requestHeaders.serviceRequestVersion || "1.0",
          channelId: requestHeaders.channelId || "TEST"
        },
        TransactionHistoryResponseBody: {
          code: "00",
          status: "Success",
          data: [
            // Pay transaction
            {
              tranid: "AXI2d1af4357f814cfab02e6637cc708142",
              type: "PAY",
              refid: "923415269300",
              dateTime: "22/08/23 09:15:23",
              amount: "500.00",
              debitAccount: "91501005**45397",
              debitVpa: "user@axis",
              debitBankName: "AXIS",
              creditAccount: "",
              creditVpa: "merchant@hdfc",
              creditBankName: "HDFC",
              status: "S",
              remarks: "Payment for groceries",
              query: "null",
              queryStatus: "null",
              queryid: "null",
              querydate: "null",
              expirydateTime: "null",
              queryCloserComment: "null",
              description: "TRANSACTION SUCCESSFUL",
              creditdebittype: "DEBIT",
              remitterName: "John Doe",
              beneficiaryName: "Grocery Store",
              beneReversalRespCode: "null",
              remitterReversalRespCode: "null",
              disputeRc: "null",
              disputeStatus: "null",
              merchantflag: "Y",
              refurl: "http://merchant.com/order/123",
              initMode: "QR",
              purposeCode: "00",
              umn: "null",
              refCategory: "00",
              mcc: "5411"
            },
            // Collect transaction
            {
              tranid: "AXI2d1af4357f814cfab02e6637cc708141",
              type: "COLLECT",
              refid: "923415269299",
              dateTime: "21/08/23 15:52:08",
              amount: "1.00",
              debitAccount: "",
              debitVpa: "pra****@axis",
              debitBankName: "null",
              creditAccount: "91501006**45397",
              creditBankName: "AXIS",
              status: "E",
              remarks: "Request for money",
              query: "null",
              queryStatus: "null",
              queryid: "null",
              querydate: "null",
              expirydateTime: "22/08/23 15:51:08",
              queryCloserComment: "null",
              description: "COLLECT REQUEST HAS BEEN EXPIRED.",
              creditdebittype: "CREDIT",
              remitterName: "null",
              beneficiaryName: "null",
              beneReversalRespCode: "null",
              remitterReversalRespCode: "null",
              disputeRc: "null",
              disputeStatus: "null",
              merchantflag: "null",
              refurl: "http://axisbank.com/upi",
              initMode: "null",
              purposeCode: "null",
              umn: "null",
              refCategory: "00",
              mcc: "1520"
            },
            // Self pay transaction
            {
              tranid: "AXI2d1af4357f814cfab02e6637cc708143",
              type: "SELFPAY",
              refid: "923415269301",
              dateTime: "20/08/23 11:30:45",
              amount: "1000.00",
              debitAccount: "91501005**45397",
              debitVpa: "user@axis",
              debitBankName: "AXIS",
              creditAccount: "91501005**63219",
              creditVpa: "user@axis",
              creditBankName: "AXIS",
              status: "S",
              remarks: "Transfer between own accounts",
              query: "null",
              queryStatus: "null",
              queryid: "null",
              querydate: "null",
              expirydateTime: "null",
              queryCloserComment: "null",
              description: "TRANSACTION SUCCESSFUL",
              creditdebittype: "DEBIT",
              remitterName: "John Doe",
              beneficiaryName: "John Doe",
              beneReversalRespCode: "null",
              remitterReversalRespCode: "null",
              disputeRc: "null",
              disputeStatus: "null",
              merchantflag: "N",
              refurl: "http://axisbank.com/upi",
              initMode: "APP",
              purposeCode: "00",
              umn: "null",
              refCategory: "00",
              mcc: "null"
            }
          ]
        }
      };
    } else if (testId === 3) {
      // Unable to fetch transaction history error
      throw {
        status: 400,
        message: "Unable to fetch Transaction History",
        error: {
          errors: [
            {
              errorCode: "E40003",
              errorMessage: "Unable to fetch Transaction History",
              errorDescription: "System is unable to fetch transaction history at this time"
            }
          ]
        }
      };
    } else {
      // Invalid test ID error
      throw {
        status: 400,
        message: "Invalid test ID",
        error: {
          errors: [
            {
              errorCode: "E40002",
              errorMessage: "Invalid test ID",
              errorDescription: "The provided test ID is not supported"
            }
          ]
        }
      };
    }
  } catch (error) {
    // Rethrow the error to be handled by the controller
    throw error;
  }
}

/**
 * Process a UPI balance inquiry request
 * 
 * @param {Object} balanceInquiryRequestData - Balance inquiry request data
 * @param {number} testId - Test ID for response simulation
 * @returns {Object} Balance inquiry response
 */
async function processBalanceInquiry(balanceInquiryRequestData, testId) {
  // In a real implementation, this would call the Axis Bank API
  // For now, we'll simulate different responses based on testId
  
  try {
    // Log the request for debugging (should be removed in production)
    console.log(`Processing balance inquiry request with testId: ${testId}`);
    
    if (testId === 1) {
      // Success response with account balance
      return {
        SubHeader: {
          responseUUID: "f7e6b03e-c92d-5fed-8c47-70088ba23e40",
          serviceResponseId: "NB.GEN.UPIAPI.BALINQ",
          serviceResponseVersion: "1.0",
          channelId: balanceInquiryRequestData.BalanceInquiryRequest.SubHeader.channelId
        },
        BalanceInquiryResponseBody: {
          code: "00",
          status: "Success",
          data: Buffer.from(JSON.stringify({
            txnId: balanceInquiryRequestData.BalanceInquiryRequest.BalanceInquiryRequestBody.txnId,
            customerId: balanceInquiryRequestData.BalanceInquiryRequest.BalanceInquiryRequestBody.customerId,
            accountDetails: {
              accRefNumber: balanceInquiryRequestData.BalanceInquiryRequest.BalanceInquiryRequestBody.account.accRefNumber,
              maskedAccnumber: balanceInquiryRequestData.BalanceInquiryRequest.BalanceInquiryRequestBody.account.maskedAccnumber || "*****002004",
              type: balanceInquiryRequestData.BalanceInquiryRequest.BalanceInquiryRequestBody.account.type,
              name: balanceInquiryRequestData.BalanceInquiryRequest.BalanceInquiryRequestBody.account.name,
              ifsc: balanceInquiryRequestData.BalanceInquiryRequest.BalanceInquiryRequestBody.account.ifsc || "AXIS0000001",
              vpa: balanceInquiryRequestData.BalanceInquiryRequest.BalanceInquiryRequestBody.account.vpa
            },
            balanceInfo: {
              currentBalance: "25045.75",
              availableBalance: "24500.30",
              currency: "INR",
              balanceAsOf: new Date().toISOString()
            },
            additionalInfo: {
              overdraftLimit: "10000.00",
              overdraftUsed: "0.00",
              holdAmount: "545.45"
            }
          })).toString('base64')
        }
      };
    } else if (testId === 3) {
      // Invalid input error
      throw {
        status: 400,
        message: "Invalid input parameters",
        error: {
          errors: [
            {
              errorCode: "E40001",
              errorMessage: "Mandatory field missing",
              errorDescription: "One or more mandatory fields are missing or invalid"
            }
          ]
        }
      };
    } else {
      // Invalid test ID error
      throw {
        status: 400,
        message: "Invalid test ID",
        error: {
          errors: [
            {
              errorCode: "E40002",
              errorMessage: "Invalid test ID",
              errorDescription: "The provided test ID is not supported"
            }
          ]
        }
      };
    }
  } catch (error) {
    // Rethrow the error to be handled by the controller
    throw error;
  }
}

/**
 * Get UPI pending transaction list
 * 
 * @param {string} customerId - Customer ID
 * @param {string} applicationID - Application ID
 * @param {Object} requestHeaders - Request headers from API Connect
 * @param {number} testId - Test ID for response simulation
 * @returns {Object} Pending transaction list response
 */
async function getPendingTransactionList(customerId, applicationID, requestHeaders, testId) {
  // In a real implementation, this would call the Axis Bank API
  // For now, we'll simulate different responses based on testId
  
  try {
    // Log the request for debugging (should be removed in production)
    console.log(`Processing pending transaction list request with testId: ${testId}, customerId: ${customerId}, applicationID: ${applicationID}`);
    
    if (testId === 1) {
      // Success response with pending transactions
      return {
        SubHeader: {
          requestUUID: requestHeaders.requestUUID || "97f6b07e-b82d-4fed-9c57-80088ba23e30",
          serviceRequestId: requestHeaders.serviceRequestId || "NB.GEN.PDT.ELIG",
          serviceRequestVersion: requestHeaders.serviceRequestVersion || "1.0",
          channelId: requestHeaders.channelId || "TEST"
        },
        PendingTransactionListBody: {
          code: "00",
          result: "Success",
          data: [
            {
              txnid: "AXIFRC4fc72febd4fa3a693d33aaa12d768",
              mobile: "9195****607",
              payeeVpa: "9560****58@axis",
              beneName: "C***DER G**HI",
              amount: "2.00",
              notes: "UPI",
              status: "P",
              expdate: "04-10-2023 12:14:26",
              refid: "927612694054",
              initiatedtime: "03-10-2023 12:15:26",
              merchantflag: "N",
              invoiceurl: "https://axisbank.com/",
              refCategory: "00",
              purpose: "00",
              payeecode: "1520"
            },
            {
              txnid: "AXIFRC4fc72febd4fa3a693d33aaa12d769",
              mobile: "9195****607",
              payeeVpa: "merchant@axisbank",
              beneName: "A*** M***",
              amount: "150.00",
              notes: "Payment for services",
              status: "P",
              expdate: "04-10-2023 14:30:00",
              refid: "927612694055",
              initiatedtime: "03-10-2023 14:30:00",
              merchantflag: "Y",
              invoiceurl: "https://merchant.com/invoice/123",
              refCategory: "00",
              purpose: "00",
              payeecode: "4121"
            },
            {
              txnid: "AXIFRC4fc72febd4fa3a693d33aaa12d770",
              mobile: "9195****607",
              payeeVpa: "friend@okaxis",
              beneName: "S*** K***",
              amount: "50.00",
              notes: "Dinner",
              status: "P",
              expdate: "04-10-2023 18:45:00",
              refid: "927612694056",
              initiatedtime: "03-10-2023 18:45:00",
              merchantflag: "N",
              invoiceurl: "",
              refCategory: "00",
              purpose: "00",
              payeecode: "0000"
            }
          ]
        }
      };
    } else if (testId === 3) {
      // Invalid input error
      throw {
        status: 400,
        message: "Invalid input parameters",
        error: {
          errors: [
            {
              errorCode: "E40001",
              errorMessage: "Mandatory field missing",
              errorDescription: "One or more mandatory fields are missing or invalid"
            }
          ]
        }
      };
    } else {
      // Invalid test ID error
      throw {
        status: 400,
        message: "Invalid test ID",
        error: {
          errors: [
            {
              errorCode: "E40002",
              errorMessage: "Invalid test ID",
              errorDescription: "The provided test ID is not supported"
            }
          ]
        }
      };
    }
  } catch (error) {
    // Rethrow the error to be handled by the controller
    throw error;
  }
}

/**
 * Process a UPI Change MPIN request
 * 
 * @param {Object} changeMPINRequestData - Change MPIN request data
 * @param {string} testId - Test ID for response simulation
 * @returns {Object} Change MPIN response
 */
async function processChangeMPIN(changeMPINRequestData, testId) {
  // In a real implementation, this would call the Axis Bank API
  // For now, we'll simulate different responses based on testId
  
  try {
    // Log the request for debugging (should be removed in production)
    console.log(`Processing change MPIN request with testId: ${testId}`);
    
    if (testId === '1') {
      // Success response
      return {
        SubHeader: {
          responseUUID: "d8e8fca2-dc0f-11e9-96d7-" + Math.random().toString(36).substring(2, 15),
          serviceResponseId: "NB.GEN.UPIAPI.CHANGEMPIN",
          serviceResponseVersion: "1.0",
          channelId: changeMPINRequestData.ChangeMPINRequest.SubHeader.channelId
        },
        SetResetMPINResponseBody: {
          code: "00",
          status: "Success",
          data: Buffer.from(JSON.stringify({
            txnId: changeMPINRequestData.ChangeMPINRequest.SetResetMPINRequestBody.txnId,
            customerId: changeMPINRequestData.ChangeMPINRequest.SetResetMPINRequestBody.customerId,
            bank: changeMPINRequestData.ChangeMPINRequest.SetResetMPINRequestBody.bank,
            account: {
              accRefNumber: changeMPINRequestData.ChangeMPINRequest.SetResetMPINRequestBody.ac.accRefNumber,
              name: changeMPINRequestData.ChangeMPINRequest.SetResetMPINRequestBody.ac.name,
              vpa: changeMPINRequestData.ChangeMPINRequest.SetResetMPINRequestBody.ac.vpa
            },
            status: "MPIN_CHANGED",
            timestamp: new Date().toISOString(),
            message: "UPI MPIN has been changed successfully"
          })).toString('base64')
        }
      };
    } else if (testId === '2') {
      // Incorrect old MPIN error
      throw {
        status: 401,
        message: "Incorrect old MPIN",
        error: {
          errors: [
            {
              errorCode: "E40101",
              errorMessage: "Incorrect old MPIN",
              errorDescription: "The old MPIN provided is incorrect"
            }
          ]
        }
      };
    } else if (testId === '3') {
      // Invalid input error
      throw {
        status: 400,
        message: "Invalid input parameters",
        error: {
          errors: [
            {
              errorCode: "E40001",
              errorMessage: "Mandatory field missing",
              errorDescription: "One or more mandatory fields are missing or invalid"
            }
          ]
        }
      };
    } else if (testId === '4') {
      // MPIN validation error
      throw {
        status: 400,
        message: "MPIN validation failed",
        error: {
          errors: [
            {
              errorCode: "E40004",
              errorMessage: "MPIN validation failed",
              errorDescription: "New MPIN does not meet security requirements"
            }
          ]
        }
      };
    } else {
      // Invalid test ID error
      throw {
        status: 400,
        message: "Invalid test ID",
        error: {
          errors: [
            {
              errorCode: "E40002",
              errorMessage: "Invalid test ID",
              errorDescription: "The provided test ID is not supported"
            }
          ]
        }
      };
    }
  } catch (error) {
    // Rethrow the error to be handled by the controller
    throw error;
  }
}

/**
 * Process a UPI Customer De-Registration request
 * 
 * @param {string} customerId - Customer ID
 * @param {string} applicationId - Application ID
 * @param {Object} requestHeaders - Request headers from API Connect
 * @param {number} testId - Test ID for response simulation
 * @returns {Object} Customer De-Registration response
 */
async function processCustomerDeregistration(customerId, applicationId, requestHeaders, testId) {
  // In a real implementation, this would call the Axis Bank API
  // For now, we'll simulate different responses based on testId
  
  try {
    // Log the request for debugging (should be removed in production)
    console.log(`Processing customer de-registration request with testId: ${testId}, customerId: ${customerId}, applicationId: ${applicationId}`);
    
    if (testId === 1) {
      // Success response
      return {
        SubHeader: {
          requestUUID: requestHeaders.requestUUID || "97f6b07e-b82d-4fed-9c57-80088ba23e30",
          serviceRequestId: requestHeaders.serviceRequestId || "NB.GEN.PDT.ELIG",
          serviceRequestVersion: requestHeaders.serviceRequestVersion || "1.0",
          channelId: requestHeaders.channelId || "TEST"
        },
        CustomerDeregistrationResponseBody: {
          code: "00",
          result: "Success",
          data: "Successfuly De-Registered"
        }
      };
    } else if (testId === 3) {
      // Invalid input error
      throw {
        status: 400,
        message: "Invalid input parameters",
        error: {
          errors: [
            {
              errorCode: "E40001",
              errorMessage: "Mandatory field missing",
              errorDescription: "Customer ID or Application ID is required"
            }
          ]
        }
      };
    } else {
      // Invalid test ID error
      throw {
        status: 400,
        message: "Invalid test ID",
        error: {
          errors: [
            {
              errorCode: "E40002",
              errorMessage: "Invalid test ID",
              errorDescription: "The provided test ID is not supported"
            }
          ]
        }
      };
    }
  } catch (error) {
    // Rethrow the error to be handled by the controller
    throw error;
  }
}

/**
 * Process a UPI Remove Account request
 * 
 * @param {string} customerId - Customer ID
 * @param {string} accountNumber - Account number to be removed
 * @param {string} applicationId - Application ID
 * @param {Object} requestHeaders - Request headers from API Connect
 * @param {number} testId - Test ID for response simulation
 * @returns {Object} Account removal response
 */
async function processRemoveAccount(customerId, accountNumber, applicationId, requestHeaders, testId) {
  // In a real implementation, this would call the Axis Bank API
  // For now, we'll simulate different responses based on testId
  
  try {
    // Log the request for debugging (should be removed in production)
    console.log(`Processing account removal request with testId: ${testId}, customerId: ${customerId}, accountNumber: ${accountNumber}, applicationId: ${applicationId}`);
    
    if (testId === 1) {
      // Success response
      return {
        SubHeader: {
          requestUUID: requestHeaders.requestUUID || "97f6b07e-b82d-4fed-9c57-80088ba23e30",
          serviceRequestId: requestHeaders.serviceRequestId || "NB.GEN.PDT.ELIG",
          serviceRequestVersion: requestHeaders.serviceRequestVersion || "1.0",
          channelId: requestHeaders.channelId || "TEST"
        },
        RemoveAccountReponseBody: {
          code: "00",
          Status: "Success"
        }
      };
    } else if (testId === 3) {
      // Invalid input error
      throw {
        status: 400,
        message: "Invalid input parameters",
        error: {
          errors: [
            {
              errorCode: "E40001",
              errorMessage: "Mandatory field missing",
              errorDescription: "Customer ID is required"
            }
          ]
        }
      };
    } else {
      // Invalid test ID error
      throw {
        status: 400,
        message: "Invalid test ID",
        error: {
          errors: [
            {
              errorCode: "E40002",
              errorMessage: "Invalid test ID",
              errorDescription: "The provided test ID is not supported"
            }
          ]
        }
      };
    }
  } catch (error) {
    // Rethrow the error to be handled by the controller
    throw error;
  }
}

module.exports = {
  processPayRequest,
  processCollectRequest,
  processCollectApprove,
  processCollectDecline,
  processSelfPay,
  getTransactionStatus,
  getTransactionHistory,
  processBalanceInquiry,
  getPendingTransactionList,
  processChangeMPIN,
  processCustomerDeregistration,
  processRemoveAccount
}; 