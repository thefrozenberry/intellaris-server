const mongoose = require('mongoose');
const winston = require('winston');

// Configure logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/mongodb.log' })
    ]
});

class MongoDBConnection {
    static instance = null;

    constructor() {
        if (MongoDBConnection.instance) {
            return MongoDBConnection.instance;
        }
        
        this.isConnected = false;
        MongoDBConnection.instance = this;
    }

    async connect() {
        try {
            if (this.isConnected) {
                logger.info('MongoDB already connected');
                return;
            }

            const mongoUri = process.env.MONGO_URI;
            if (!mongoUri) {
                throw new Error('MONGO_URI environment variable is not set');
            }

            // MongoDB connection options
            const options = {
                maxPoolSize: 10, // Maintain up to 10 socket connections
                serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
                socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            };

            await mongoose.connect(mongoUri, options);
            this.isConnected = true;
            
            logger.info('Successfully connected to MongoDB Atlas');

            // Handle connection events
            mongoose.connection.on('error', (error) => {
                logger.error('MongoDB connection error:', error);
                this.isConnected = false;
            });

            mongoose.connection.on('disconnected', () => {
                logger.warn('MongoDB disconnected');
                this.isConnected = false;
            });

            mongoose.connection.on('reconnected', () => {
                logger.info('MongoDB reconnected');
                this.isConnected = true;
            });

            // Graceful shutdown
            process.on('SIGINT', async () => {
                try {
                    await mongoose.connection.close();
                    logger.info('MongoDB connection closed through app termination');
                    process.exit(0);
                } catch (error) {
                    logger.error('Error during MongoDB shutdown:', error);
                    process.exit(1);
                }
            });

        } catch (error) {
            logger.error('Failed to connect to MongoDB:', error);
            this.isConnected = false;
            throw error;
        }
    }

    async disconnect() {
        try {
            if (!this.isConnected) {
                logger.info('MongoDB already disconnected');
                return;
            }

            await mongoose.connection.close();
            this.isConnected = false;
            logger.info('MongoDB connection closed');
        } catch (error) {
            logger.error('Error disconnecting from MongoDB:', error);
            throw error;
        }
    }

    getConnectionStatus() {
        return {
            isConnected: this.isConnected,
            readyState: mongoose.connection.readyState,
            host: mongoose.connection.host,
            name: mongoose.connection.name
        };
    }
}

module.exports = new MongoDBConnection(); 