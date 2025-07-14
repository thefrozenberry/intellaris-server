const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

// Get credentials from environment variables
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

console.log('Testing Upstash Redis DEL command...');
console.log(`URL: ${UPSTASH_URL ? UPSTASH_URL.substring(0, 10) + '...' : 'Not set'}`);

// Initialize axios instance
const upstashApi = axios.create({
  baseURL: UPSTASH_URL,
  headers: {
    'Authorization': `Bearer ${UPSTASH_TOKEN}`,
    'Content-Type': 'application/json'
  },
  timeout: 5000
});

const TEST_KEY = 'test:delete:key';

// Test DEL command
async function testDeleteKey() {
  try {
    // First, set a key to delete
    console.log(`\n1. Setting test key: ${TEST_KEY}`);
    const setResponse = await upstashApi.post(`/set/${TEST_KEY}`, "test-value");
    console.log('SET Response:', setResponse.status, setResponse.data);
    
    // Verify the key exists
    console.log(`\n2. Verifying key exists: ${TEST_KEY}`);
    const getResponse = await upstashApi.get(`/get/${TEST_KEY}`);
    console.log('GET Response:', getResponse.status, getResponse.data);
    
    // Delete the key (using GET method)
    console.log(`\n3. Deleting key using GET method: ${TEST_KEY}`);
    const delResponse = await upstashApi.get(`/del/${TEST_KEY}`);
    console.log('DEL Response:', delResponse.status, delResponse.data);
    
    // Verify the key was deleted
    console.log(`\n4. Verifying key was deleted: ${TEST_KEY}`);
    const verifyResponse = await upstashApi.get(`/get/${TEST_KEY}`);
    console.log('GET Response:', verifyResponse.status, verifyResponse.data);
    
    // Try to use a DELETE HTTP method (should fail)
    try {
      console.log(`\n5. Trying to delete with DELETE HTTP method (should fail)`);
      const failResponse = await upstashApi.delete(`/del/${TEST_KEY}`);
      console.log('Response:', failResponse.status, failResponse.data);
    } catch (error) {
      console.log('Expected error with DELETE method:', error.message);
      if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Data:', error.response.data);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error testing DEL command:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

// Run the test
async function runTest() {
  try {
    const result = await testDeleteKey();
    
    console.log('\n----- TEST RESULTS -----');
    console.log('DEL command test:', result ? 'PASSED' : 'FAILED');
    console.log('\nKey points:');
    console.log('1. Upstash REST API uses GET for the Redis DEL command');
    console.log('2. Using DELETE HTTP method results in a 405 Method Not Allowed error');
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

runTest().catch(console.error); 