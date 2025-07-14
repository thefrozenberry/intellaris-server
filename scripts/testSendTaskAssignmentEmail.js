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

        // Lookup employee for info
        const employee = await Employee.findOne({ enCode });
        if (!employee) {
            console.error(`No employee found for enCode: ${enCode}`);
            process.exit(1);
        }
        console.log(`Testing task assignment email for: ${employee.fullName} <${employee.email}>`);

        // Sample task data
        const taskData = {
            taskName: "Implement New Authentication System",
            referenceId: "2025/001",
            assignmentDate: new Date().toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }).replace(/\//g, '-'),
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }).replace(/\//g, '-'),
            priorityLevel: "High",
            department: "Engineering",
            project: "Security Enhancement",
            objective: "Enhance system security by implementing a new authentication system with multi-factor authentication support.",
            details: "The task involves implementing a new authentication system that supports MFA, OAuth2, and JWT tokens. The system should be compatible with our existing user management system and follow security best practices.",
            deliverables: [
                "Complete system design document",
                "Implementation of core authentication modules",
                "Integration with existing user management system",
                "Unit and integration tests",
                "Security audit report"
            ],
            resources: [
                "Authentication System Design Document",
                "Security Requirements Specification",
                "API Documentation",
                "Test Environment Access"
            ],
            acknowledgmentTime: "24",
            teamLead: "John Doe",
            submissionPlatform: "GitHub Repository"
        };

        // Call the API
        const apiUrl = `https://stack.intellaris.co/api/send-task-assignment-email`;
        console.log('Calling API:', apiUrl);
        
        const response = await axios.post(apiUrl, 
            { enCode, taskData },
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