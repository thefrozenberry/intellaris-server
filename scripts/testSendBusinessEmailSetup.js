const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

// MongoDB connection for employee lookup
const mongoConnection = require('../src/config/mongodb');
const Employee = require('../src/models/employee/Employee');

async function main() {
    try {
        // Connect to MongoDB
        await mongoConnection.connect();
        console.log('MongoDB connected.');

        // Test data (change as needed)
        const enCode = process.argv[2] || '005';
        const businessEmail = process.argv[3] || 'ramanuz@ondust.com';
        const password = process.argv[4] || 'Ramanuz@781028';

        // Lookup employee for info
        const employee = await Employee.findOne({ enCode });
        if (!employee) {
            console.error(`No employee found for enCode: ${enCode}`);
            process.exit(1);
        }
        console.log(`Testing business email setup for: ${employee.fullName} <${employee.email}>`);

        // Call the API
        const apiUrl = `https://stack.intellaris.co/api/send-business-email-setup`;
        console.log('Calling API:', apiUrl);
        
        const response = await axios.post(apiUrl, 
            { enCode, businessEmail, password },
            {
                headers: {
                    'x-api-password': process.env.API_PASSWORD,
                    'x-access-code': process.env.ACCESS_CODE,
                    'x-client-id': process.env.CLIENT_ID,
                    'x-client-secret': process.env.CLIENT_SECRET,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('API response:', response.data);
    } catch (error) {
        if (error.response) {
            console.error('API error:', error.response.data);
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
        } else if (error.request) {
            console.error('No response received. Is the server running?');
            console.error('Request error:', error.message);
        } else {
            console.error('Error:', error.message);
        }
    } finally {
        await mongoose.disconnect();
        console.log('MongoDB disconnected.');
    }
}

main(); 