const mongoose = require('mongoose');
const User = require('./models/User');
const UserProfile = require('./models/UserProfile');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sahaay')
  .then(() => console.log('Test: MongoDB Connected'))
  .catch(err => console.error('Test: MongoDB Connection Error:', err));

async function testDatabaseOperations() {
  try {
    console.log('\n=== Testing Database Operations ===');

    // Test 1: Create a test user
    console.log('1. Creating test user...');
    const userId = crypto.randomBytes(8).toString('hex');
    const hash = await bcrypt.hash('testpassword', 10);

    const testUser = new User({
      id: userId,
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: hash,
      verified: false,
      createdAt: new Date(),
      lastLogin: new Date()
    });
    await testUser.save();
    console.log('✓ Test user created');

    // Test 2: Create user profile
    console.log('2. Creating user profile...');
    const testProfile = new UserProfile({
      userId: userId,
      name: 'Test User',
      email: 'test@example.com',
      phone: '+1234567890',
      location: 'Test City',
      language: 'en',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
      bio: 'Test bio',
      skills: ['JavaScript', 'React'],
      interests: ['Technology', 'Education'],
      joinedDate: new Date(),
      isActive: true
    });
    await testProfile.save();
    console.log('✓ User profile created');

    // Test 3: Find user by email
    console.log('3. Finding user by email...');
    const foundUser = await User.findOne({ email: 'test@example.com' });
    console.log('✓ User found:', foundUser.name);

    // Test 4: Update user profile
    console.log('4. Updating user profile...');
    await UserProfile.findOneAndUpdate(
      { userId: userId },
      { bio: 'Updated test bio' }
    );
    console.log('✓ User profile updated');

    // Test 5: Clean up test data
    console.log('5. Cleaning up test data...');
    await UserProfile.deleteOne({ userId: userId });
    await User.deleteOne({ id: userId });
    console.log('✓ Test data cleaned up');

    console.log('\n=== All Database Tests Passed! ===');
    process.exit(0);

  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

// Run tests after connection
mongoose.connection.once('open', () => {
  testDatabaseOperations();
});