const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('./models/User');
const UserProfile = require('./models/UserProfile');
const UserProgress = require('./models/UserProgress');
const UserBookmarks = require('./models/UserBookmarks');
const UserActivity = require('./models/UserActivity');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sahaay')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('Connection Error:', err));

async function createDemoAccount() {
  try {
    const email = 'testuser@example.com';
    const password = 'testpass123';
    const name = 'Test User';

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('✓ Demo account already exists');
      process.exit(0);
    }

    // Create user
    const userId = crypto.randomBytes(8).toString('hex');
    const hash = await bcrypt.hash(password, 10);

    const user = new User({
      id: userId,
      name,
      email,
      passwordHash: hash,
      verified: true,
      createdAt: new Date(),
      lastLogin: new Date()
    });
    await user.save();
    console.log('✓ Demo user created');

    // Create profile
    const profile = new UserProfile({
      userId,
      name,
      email,
      phone: '+91-9876543210',
      location: 'India',
      language: 'en',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
      bio: 'This is a test demo account for SAHAAY',
      skills: ['Technology', 'Learning'],
      interests: ['Education', 'Opportunities'],
      joinedDate: new Date(),
      isActive: true
    });
    await profile.save();
    console.log('✓ Demo profile created');

    // Create progress
    const progress = new UserProgress({
      userId,
      education: { lessonsCompleted: 0, currentModule: '' },
      market: { browsingHistory: [] },
      civic: { servicesViewed: [] },
      translate: { history: [] }
    });
    await progress.save();
    console.log('✓ Demo progress initialized');

    // Create bookmarks
    const bookmarks = new UserBookmarks({
      userId,
      market: [],
      education: [],
      civic: []
    });
    await bookmarks.save();
    console.log('✓ Demo bookmarks initialized');

    // Create activity
    const activity = new UserActivity({
      userId,
      type: 'account_created',
      description: 'Demo account created for testing',
      timestamp: new Date(),
      page: 'setup'
    });
    await activity.save();
    console.log('✓ Demo activity logged');

    console.log('\n✅ Demo Account Created Successfully!');
    console.log('==========================================');
    console.log('Email:    testuser@example.com');
    console.log('Password: testpass123');
    console.log('==========================================');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating demo account:', error);
    process.exit(1);
  }
}

createDemoAccount();
