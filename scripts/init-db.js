const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Script to initialize the database using Prisma
 */
async function initializeDatabase() {
  try {
    console.log('🔵 Checking Prisma schema...');
    
    // Check if prisma directory and schema exist
    const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
    if (!fs.existsSync(schemaPath)) {
      console.error('❌ Prisma schema not found. Make sure prisma/schema.prisma exists.');
      process.exit(1);
    }
    
    console.log('✅ Prisma schema found.');
    console.log('🔵 Generating Prisma client...');
    
    // Generate Prisma client
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    console.log('✅ Prisma client generated.');
    console.log('🔵 Running database migrations...');
    
    // Run migrations
    execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });
    
    console.log('✅ Database migrations completed.');
    console.log('🎉 Database initialization complete!');
    
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    process.exit(1);
  }
}

// Run the initialization
initializeDatabase(); 