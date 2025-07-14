const dotenv = require('dotenv');
const axios = require('axios');
dotenv.config();

// Get credentials from environment variables
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

console.log('Testing Upstash Redis REST API connection...');
console.log(`URL: ${UPSTASH_URL ? UPSTASH_URL.substring(0, 10) + '...' : 'Not set'}`);
console.log(`Token: ${UPSTASH_TOKEN ? UPSTASH_TOKEN.substring(0, 10) + '...' : 'Not set'}`);

// Initialize axios instance for Upstash REST API
const upstashApi = axios.create({
  baseURL: UPSTASH_URL,
  headers: {
    'Authorization': `Bearer ${UPSTASH_TOKEN}`,
    'Content-Type': 'application/json'
  },
  timeout: 5000
});

// Test functions
async function pingTest() {
  try {
    console.log('\n1. Testing PING command...');
    const response = await upstashApi.get('/ping');
    console.log('Response:', response.status, response.data);
    return true;
  } catch (error) {
    console.error('Error with PING:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

async function setTest() {
  try {
    console.log('\n2. Testing SET command...');
    // Debug the URL being constructed
    const setUrl = '/set/test_key';
    console.log('Request URL:', UPSTASH_URL + setUrl);
    console.log('Request body:', { value: 'test_value' });
    
    const response = await upstashApi.post(setUrl, {
      value: 'test_value'
    });
    console.log('Response:', response.status, response.data);
    return true;
  } catch (error) {
    console.error('Error with SET:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

async function getTest() {
  try {
    console.log('\n3. Testing GET command...');
    const response = await upstashApi.get('/get/test_key');
    console.log('Response:', response.status, response.data);
    return true;
  } catch (error) {
    console.error('Error with GET:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

async function expireTest() {
  try {
    console.log('\n4. Testing EXPIRE command...');
    // TTL should be specified in the URL path, not in the request body for Upstash
    const ttl = 60; // 60 seconds
    const response = await upstashApi.post(`/expire/test_key/${ttl}`);
    console.log('Response:', response.status, response.data);
    return true;
  } catch (error) {
    console.error('Error with EXPIRE:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

async function runTests() {
  const pingResult = await pingTest();
  const setResult = await setTest();
  const getResult = await getTest();
  const expireResult = await expireTest();
  
  console.log('\n----- TEST RESULTS -----');
  console.log('PING test:', pingResult ? 'PASSED' : 'FAILED');
  console.log('SET test:', setResult ? 'PASSED' : 'FAILED');
  console.log('GET test:', getResult ? 'PASSED' : 'FAILED');
  console.log('EXPIRE test:', expireResult ? 'PASSED' : 'FAILED');
}

// Run the tests
runTests().catch(console.error); 