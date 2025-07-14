const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load env variables
dotenv.config();

/**
 * Script to run the application in development mode
 * with proper environment checks
 */
async function runDev() {
  try {
    console.log('🔵 Checking environment...');
    
    // Check if .env file exists
    const envPath = path.join(__dirname, '../.env');
    if (!fs.existsSync(envPath)) {
      console.warn('⚠️ No .env file found. Creating from .env.sample...');
      
      // Check if .env.sample exists
      const sampleEnvPath = path.join(__dirname, '../.env.sample');
      if (fs.existsSync(sampleEnvPath)) {
        // Copy sample env to .env
        fs.copyFileSync(sampleEnvPath, envPath);
        console.log('✅ Created .env file from sample.');
      } else {
        console.error('❌ No .env.sample file found. Please create an .env file manually.');
        process.exit(1);
      }
    }
    
    console.log('✅ Environment file found.');
    
    // Check if database URL is set
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL not set in .env file.');
      process.exit(1);
    }
    
    // Check if Redis URL is set
    if (!process.env.REDIS_URL) {
      console.error('❌ REDIS_URL not set in .env file.');
      process.exit(1);
    }
    
    console.log('✅ Required environment variables found.');
    console.log('🔵 Generating Prisma client...');
    
    // Generate Prisma client
    const prismaGenerate = spawn('npx', ['prisma', 'generate'], { stdio: 'inherit' });
    
    prismaGenerate.on('close', (code) => {
      if (code !== 0) {
        console.error('❌ Failed to generate Prisma client.');
        process.exit(1);
      }
      
      console.log('✅ Prisma client generated.');
      console.log('🚀 Starting development server...');
      
      // Start the server using nodemon
      const nodemon = spawn('npx', ['nodemon', 'src/index.js'], { stdio: 'inherit' });
      
      nodemon.on('close', (code) => {
        if (code !== 0) {
          console.error(`❌ Development server exited with code ${code}`);
          process.exit(code);
        }
      });
    });
    
  } catch (error) {
    console.error('❌ Error running development server:', error.message);
    process.exit(1);
  }
}

// Run the development server
runDev(); 