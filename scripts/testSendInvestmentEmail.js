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
        const enCode = process.argv[2] || '001';
        const amount = process.argv[3] || '15,200';
        const date = process.argv[4] || new Date().toISOString().slice(0, 10);

        // Lookup employee for info
        const employee = await Employee.findOne({ enCode });
        if (!employee) {
            console.error(`No employee found for enCode: ${enCode}`);
            process.exit(1);
        }
        console.log(`Testing investment email for: ${employee.fullName} <${employee.email}>`);

        // Call the API
        const apiUrl = `https://stack.intellaris.co/api/send-investment-email`;
        const response = await axios.post(apiUrl, 
            { enCode, amount, date },
            {
                headers: {
                    'x-api-password': process.env.API_PASSWORD,
                    'x-access-code': process.env.ACCESS_CODE,
                    'x-client-id': process.env.CLIENT_ID,
                    'x-client-secret': process.env.CLIENT_SECRET
                }
            }
        );
        console.log('API response:', response.data);
    } catch (error) {
        if (error.response) {
            console.error('API error:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    } finally {
        await mongoose.disconnect();
        console.log('MongoDB disconnected.');
    }
}

main(); 