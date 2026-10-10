const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    const Inspector = require('../models/Inspector');
    const CustomerUser = require('../models/CustomerUser');
    const Admin = require('../models/Admin');
    const Customer = require('../models/Customer');
    const Vehicle = require('../models/Vehicle');

    // Clear existing data
    await Inspector.deleteMany({});
    await CustomerUser.deleteMany({});
    await Admin.deleteMany({});
    await Customer.deleteMany({});
    await Vehicle.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create Admin
    console.log('👤 Creating admin...');
    const admin = new Admin({
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'admin123',
    });
    await admin.save();
    console.log('   ✅ Created Admin (admin@test.com / admin123)');

    // Create Inspectors
    console.log('👤 Creating inspectors...');
    const inspector1 = new Inspector({
      name: 'John Doe',
      email: 'john@test.com',
      password: 'password123',
      licenseNumber: 'LIC001',
    });
    await inspector1.save();
    console.log('   ✅ Created John Doe (john@test.com / password123)');

    const inspector2 = new Inspector({
      name: 'Jane Smith',
      email: 'jane@test.com',
      password: 'password123',
      licenseNumber: 'LIC002',
    });
    await inspector2.save();
    console.log('   ✅ Created Jane Smith (jane@test.com / password123)');

    // Create Customer Users (already verified for demo)
    console.log('👥 Creating customer users...');
    const customer1 = new CustomerUser({
      name: 'Acme Corporation',
      email: 'acme@test.com',
      password: 'customer123',
      phone: '1234567890',
      companyName: 'Acme Corporation',
      companyAddress: '123 Main St, City, State',
      status: 'approved',
      verifiedBy: admin._id,
      verifiedAt: new Date(),
      approvedBy: admin._id,
      approvedAt: new Date(),
    });
    await customer1.save();
    console.log('   ✅ Created Acme Corp (acme@test.com / customer123)');

    const customer2 = new CustomerUser({
      name: 'Tech Solutions Inc',
      email: 'tech@test.com',
      password: 'customer123',
      phone: '0987654321',
      companyName: 'Tech Solutions Inc',
      companyAddress: '456 Oak Ave, Town, State',
      status: 'approved',
      verifiedBy: admin._id,
      verifiedAt: new Date(),
      approvedBy: admin._id,
      approvedAt: new Date(),
    });
    await customer2.save();
    console.log('   ✅ Created Tech Solutions (tech@test.com / customer123)');

    // Create legacy Customers (for backward compatibility)
    console.log('🏢 Creating customers...');
    const legacyCustomer1 = await Customer.create({
      name: 'Acme Corporation',
      email: 'acme@company.com',
      phone: '1234567890',
      address: '123 Main St, City, State',
    });

    const legacyCustomer2 = await Customer.create({
      name: 'Tech Solutions Inc',
      email: 'tech@company.com',
      phone: '0987654321',
      address: '456 Oak Ave, Town, State',
    });
    console.log(`   ✅ Created 2 legacy customers`);

    // Create vehicles
    console.log('🚗 Creating vehicles...');
    const vehicles = await Vehicle.create([
      {
        customerId: legacyCustomer1._id,
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        vin: 'VIN123456789',
        color: 'Silver',
        mileage: 45000,
      },
      {
        customerId: legacyCustomer1._id,
        make: 'Honda',
        model: 'CR-V',
        year: 2021,
        vin: 'VIN987654321',
        color: 'Black',
        mileage: 32000,
      },
      {
        customerId: legacyCustomer2._id,
        make: 'Ford',
        model: 'F-150',
        year: 2019,
        vin: 'VIN555555555',
        color: 'Red',
        mileage: 67000,
      },
    ]);
    console.log(`   ✅ Created ${vehicles.length} vehicles`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('\n   ADMIN:');
    console.log('   Email: admin@test.com');
    console.log('   Password: admin123');
    console.log('\n   INSPECTOR:');
    console.log('   Email: john@test.com');
    console.log('   Password: password123');
    console.log('\n   CUSTOMER:');
    console.log('   Email: acme@test.com');
    console.log('   Password: customer123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    console.error(error);
    process.exit(1);
  }
};

connectDB().then(seedData);