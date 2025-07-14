const bcrypt = require('bcrypt');
const { generateOTP, hashOTP, compareOTP } = require('../src/utils/otpGenerator');

// Direct test of bcrypt hash and compare
async function testBcrypt() {
  try {
    console.log('\n===== TESTING BCRYPT =====');
    
    // Generate a test OTP
    const testOtp = '123456';
    console.log('Test OTP:', testOtp);
    
    // Hash it
    const hash = await bcrypt.hash(testOtp, 10);
    console.log('Hash:', hash);
    
    // Compare (should be true)
    const compareResult = await bcrypt.compare(testOtp, hash);
    console.log('Comparison result (should be true):', compareResult);
    
    // Compare with an incorrect OTP (should be false)
    const incorrectCompare = await bcrypt.compare('654321', hash);
    console.log('Incorrect comparison (should be false):', incorrectCompare);
    
    // Test with quotes around the hash
    const quotedHash = `"${hash}"`;
    console.log('Hash with quotes:', quotedHash);
    
    // Compare with quotes (should fail)
    const compareWithQuotes = await bcrypt.compare(testOtp, quotedHash);
    console.log('Comparison with quotes (should be false):', compareWithQuotes);
    
    // Remove quotes and compare again
    const unquotedHash = quotedHash.substring(1, quotedHash.length - 1);
    console.log('Hash with quotes removed:', unquotedHash);
    
    const compareUnquoted = await bcrypt.compare(testOtp, unquotedHash);
    console.log('Comparison after removing quotes (should be true):', compareUnquoted);
  } catch (error) {
    console.error('Bcrypt test error:', error);
  }
}

// Test our utility functions
async function testOtpUtils() {
  try {
    console.log('\n===== TESTING OTP UTILITIES =====');
    
    // Generate OTP
    const otp = generateOTP();
    console.log('Generated OTP:', otp);
    
    // Hash OTP
    const hashedOtp = await hashOTP(otp);
    console.log('Hashed OTP:', hashedOtp);
    
    // Compare OTP (should be true)
    const compareResult = await compareOTP(otp, hashedOtp);
    console.log('Comparison result (should be true):', compareResult);
    
    // Add quotes to the hash
    const quotedHash = `"${hashedOtp}"`;
    console.log('Hash with quotes:', quotedHash);
    
    // Compare with quotes (should fail)
    const compareWithQuotes = await compareOTP(otp, quotedHash);
    console.log('Comparison with quotes (should be false):', compareWithQuotes);
  } catch (error) {
    console.error('OTP utils test error:', error);
  }
}

// Run tests
async function runTests() {
  await testBcrypt();
  await testOtpUtils();
}

runTests().catch(console.error); 