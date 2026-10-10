const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');
    
    const Inspector = require('./models/Inspector');
    
    // Find the user with password
    const inspector = await Inspector.findOne({ email: 'john@test.com' }).select('+password');
    
    if (!inspector) {
      console.log('❌ User john@test.com NOT FOUND in database');
      process.exit(1);
    }
    
    console.log('✅ User found:');
    console.log('   Name:', inspector.name);
    console.log('   Email:', inspector.email);
    console.log('   Password Hash:', inspector.password.substring(0, 20) + '...');
    console.log('   Password Length:', inspector.password.length);
    
    // Test password match
    console.log('\n🧪 Testing password match...');
    const bcrypt = require('bcryptjs');
    const isMatch = await bcrypt.compare('password123', inspector.password);
    console.log('   Password matches "password123":', isMatch);
    
    if (!isMatch) {
      console.log('\n❌ Password does NOT match!');
      console.log('   This means password was not hashed correctly during seeding');
    } else {
      console.log('\n✅ Password matches correctly!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

connectDB();