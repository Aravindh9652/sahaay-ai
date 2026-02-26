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

async function setupDemoAccounts() {
  try {
    // Demo account 1: Primary demo account
    const primaryEmail = 'demo@sahaay.com';
    const primaryPassword = 'demo123';

    // Check and create primary demo account
    let user = await User.findOne({ email: primaryEmail });
    if (!user) {
      const userId = crypto.randomBytes(8).toString('hex');
      const hash = await bcrypt.hash(primaryPassword, 10);

      user = new User({
        id: userId,
        name: 'Demo User',
        email: primaryEmail,
        passwordHash: hash,
        verified: true,
        createdAt: new Date(),
        lastLogin: new Date()
      });
      await user.save();

      // Create profile
      const profile = new UserProfile({
        userId,
        name: 'Demo User',
        email: primaryEmail,
        phone: '+91-9876543210',
        location: 'India',
        language: 'en',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
        bio: 'Official SAHAAY Demo Account',
        skills: ['Technology', 'Learning', 'Civil Tech'],
        interests: ['Education', 'Opportunities', 'Civic Engagement'],
        joinedDate: new Date(),
        isActive: true
      });
      await profile.save();

      // Create progress
      const progress = new UserProgress({
        userId,
        education: { lessonsCompleted: 0, currentModule: '' },
        market: { browsingHistory: [] },
        civic: { servicesViewed: [] },
        translate: { history: [] }
      });
      await progress.save();

      // Create bookmarks
      const bookmarks = new UserBookmarks({
        userId,
        market: [],
        education: [],
        civic: []
      });
      await bookmarks.save();

      // Create activity
      const activity = new UserActivity({
        userId,
        type: 'account_created',
        description: 'Official demo account created',
        timestamp: new Date(),
        page: 'setup'
      });
      await activity.save();

      console.log('✓ Primary demo account created: demo@sahaay.com');
    } else {
      console.log('✓ Primary demo account already exists');
    }

    // Demo account 2: Keep old test account for backward compatibility
    const secondaryEmail = 'testuser@example.com';
    const secondaryPassword = 'testpass123';

    user = await User.findOne({ email: secondaryEmail });
    if (!user) {
      const userId = crypto.randomBytes(8).toString('hex');
      const hash = await bcrypt.hash(secondaryPassword, 10);

      user = new User({
        id: userId,
        name: 'Test User',
        email: secondaryEmail,
        passwordHash: hash,
        verified: true,
        createdAt: new Date(),
        lastLogin: new Date()
      });
      await user.save();

      // Create profile
      const profile = new UserProfile({
        userId,
        name: 'Test User',
        email: secondaryEmail,
        phone: '+91-9876543210',
        location: 'India',
        language: 'en',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
        bio: 'Test account for development',
        skills: ['Testing'],
        interests: ['Development'],
        joinedDate: new Date(),
        isActive: true
      });
      await profile.save();

      // Create progress
      const progress = new UserProgress({
        userId,
        education: { lessonsCompleted: 0, currentModule: '' },
        market: { browsingHistory: [] },
        civic: { servicesViewed: [] },
        translate: { history: [] }
      });
      await progress.save();

      // Create bookmarks
      const bookmarks = new UserBookmarks({
        userId,
        market: [],
        education: [],
        civic: []
      });
      await bookmarks.save();

      console.log('✓ Backup demo account created: testuser@example.com');
    } else {
      console.log('✓ Backup demo account already exists');
    }

    console.log('\n✅ Demo Accounts Setup Complete!');
    console.log('==========================================');
    console.log('PRIMARY DEMO ACCOUNT (Use this one):');
    console.log('  Email:    demo@sahaay.com');
    console.log('  Password: demo123');
    console.log('');
    console.log('BACKUP DEMO ACCOUNT (Also works):');
    console.log('  Email:    testuser@example.com');
    console.log('  Password: testpass123');
    console.log('==========================================');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up demo accounts:', error);
    process.exit(1);
  }
}

setupDemoAccounts();
