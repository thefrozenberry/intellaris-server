const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');
const { apiAccess } = require('./middlewares/authMiddleware');
const fileStorage = require('./utils/fileStorage');

// MongoDB connection for employee management
const mongoConnection = require('./config/mongodb');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Prisma client (for existing APIs)
const prisma = new PrismaClient();

// Initialize MongoDB connection (for employee management)
mongoConnection.connect().catch(err => {
  console.error('Failed to connect to MongoDB:', err);
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Serve static files from uploads directory
app.use('/uploads', express.static(fileStorage.UPLOAD_DIR));

// Health check endpoint - not protected
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
    databases: {
      postgresql: 'connected',
      mongodb: mongoConnection.getConnectionStatus().isConnected ? 'connected' : 'disconnected'
    }
  });
});

// API Access Control middleware for existing API routes (exclude employee routes)
app.use('/api', (req, res, next) => {
  // Skip API access control for employee management routes
  if (req.path.startsWith('/v1/employee')) {
    return next();
  }
  return apiAccess(req, res, next);
});

// Existing Routes (Prisma/PostgreSQL)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/user'));
app.use('/api/axis', require('./routes/axis'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/v1/mandate', require('./routes/mandate'));
app.use('/api/gamification', require('./routes/gamification'));
app.use('/api/location', require('./routes/location'));

// Employee Management Routes (MongoDB) - No API access control needed
app.use('/api/v1/employee', require('./routes/employee'));

// New investment email route
app.use('/api', require('./routes/investmentEmail'));

// New task assignment email route
app.use('/api', require('./routes/taskAssignmentEmail'));

// New business email setup route
app.use('/api', require('./routes/businessEmailSetup'));

// Command execution routes
app.use('/api/commands', require('./routes/commandRoutes'));

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

// Start the server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  console.log('Databases:');
  console.log('- PostgreSQL (Prisma): Ready for existing APIs');
  console.log('- MongoDB: Ready for employee management');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = app; 