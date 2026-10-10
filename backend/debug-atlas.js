const mongoose = require('mongoose');
require('dotenv').config();

console.log('\n🔍 Debugging MongoDB Connection...\n');

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error('❌ ERROR: MONGO_URI not found in .env file!');
  console.error('Please create .env file in backend directory with:');
  console.error('MONGO_URI=mongodb+srv://admin:PASSWORD@cluster0.xxxxx.mongodb.net/vehicle-inspection?retryWrites=true&w=majority');
  process.exit(1);
}

console.log('✓ Connection String Found');
console.log('✓ Attempting to connect...\n');

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log('✅ SUCCESS! MongoDB Atlas connected!\n');
    console.log('Database:', mongoose.connection.db.databaseName);
    console.log('Host:', mongoose.connection.host);
    console.log('\n✅ You can now seed the database!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ CONNECTION FAILED\n');
    console.error('Error:', error.message);
    console.error('Code:', error.codeName || 'Unknown');
    
    if (error.message.includes('authentication failed') || error.codeName === 'AtlasError') {
      console.error('\n⚠️  AUTHENTICATION ERROR - Fix these:');
      console.error('   1. Go to https://cloud.mongodb.com/');
      console.error('   2. Click "Database Access" → check your admin user exists');
      console.error('   3. Click "Network Access" → check your IP is whitelisted');
      console.error('   4. Try: "Allow from Anywhere" (0.0.0.0/0) temporarily');
      console.error('   5. Verify password in .env matches Atlas exactly');
      console.error('   6. If password has special chars, URL encode them');
    }
    
    process.exit(1);
  }
};

connectDB();