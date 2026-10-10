const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');
    
    const Inspector = require('./models/Inspector');
    
    // Get all inspectors (without password)
    const inspectors = await Inspector.find().select('name email');
    
    console.log('📋 All Inspectors in Database:');
    console.log('================================');
    inspectors.forEach((insp, i) => {
      console.log(`${i + 1}. Name: ${insp.name}`);
      console.log(`   Email: ${insp.email}\n`);
    });
    
    if (inspectors.length === 0) {
      console.log('❌ No inspectors found! Run: node scripts/seed.js');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

connectDB();