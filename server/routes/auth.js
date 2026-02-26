const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

// MongoDB Models
const User = require('../models/User')
const UserProfile = require('../models/UserProfile')
const UserProgress = require('../models/UserProgress')
const UserBookmarks = require('../models/UserBookmarks')
const UserActivity = require('../models/UserActivity')

function signToken(user){
  const secret = process.env.JWT_SECRET || 'dev-secret'
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, secret, { expiresIn: '7d' })
}

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  jwt.verify(token, process.env.JWT_SECRET || 'dev-secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' })
    }
    req.user = user
    next()
  })
}

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phone, location, language } = req.body
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing name, email, or password' })
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' })

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered', userExists: true })
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10)
    const userId = crypto.randomBytes(8).toString('hex')

    // Create user
    const user = new User({
      id: userId,
      name,
      email,
      passwordHash: hash,
      verified: false,
      createdAt: new Date(),
      lastLogin: new Date()
    })
    await user.save()

    // Create user profile
    const profile = new UserProfile({
      userId,
      name,
      email,
      phone: phone || '',
      location: location || '',
      language: language || 'en',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
      bio: '',
      skills: [],
      interests: [],
      joinedDate: new Date(),
      isActive: true
    })
    await profile.save()

    // Initialize user progress and bookmarks
    const progress = new UserProgress({
      userId,
      education: {},
      market: {},
      civic: {},
      translate: { history: [] }
    })
    await progress.save()

    const bookmarks = new UserBookmarks({
      userId,
      market: [],
      education: [],
      civic: []
    })
    await bookmarks.save()

    // Log signup activity
    const activity = new UserActivity({
      userId,
      type: 'signup',
      description: 'Account created successfully'
    })
    await activity.save()

    console.log('User created:', email)
    const token = signToken(user)

    res.json({
      ok: true,
      user: { id: userId, name, email },
      token
    })
  } catch (err) {
    console.error('Signup error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Missing email or password' })

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.passwordHash)
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Log login activity
    const activity = new UserActivity({
      userId: user.id,
      type: 'login',
      description: 'User logged in'
    })
    await activity.save()

    const token = signToken(user)
    res.json({
      ok: true,
      user: { id: user.id, name: user.name, email: user.email },
      token
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.user.id })
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' })
    }
    res.json({ profile })
  } catch (err) {
    console.error('Profile fetch error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, phone, location, language, bio, skills, interests } = req.body
    const profile = await UserProfile.findOne({ userId: req.user.id })

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' })
    }

    // Update profile
    if (name) profile.name = name
    if (phone !== undefined) profile.phone = phone
    if (location !== undefined) profile.location = location
    if (language) profile.language = language
    if (bio !== undefined) profile.bio = bio
    if (skills) profile.skills = skills
    if (interests) profile.interests = interests

    await profile.save()

    // Update user name if changed
    if (name) {
      await User.findOneAndUpdate({ id: req.user.id }, { name })
    }

    // Log activity
    const activity = new UserActivity({
      userId: req.user.id,
      type: 'profile_update',
      description: 'Profile updated'
    })
    await activity.save()

    res.json({ ok: true, profile })
  } catch (err) {
    console.error('Profile update error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Get user progress
router.get('/progress', authenticateToken, async (req, res) => {
  try {
    let progress = await UserProgress.findOne({ userId: req.user.id })
    if (!progress) {
      progress = new UserProgress({
        userId: req.user.id,
        education: {},
        market: {},
        civic: {},
        translate: { history: [] }
      })
      await progress.save()
    }
    res.json({ progress })
  } catch (err) {
    console.error('Progress fetch error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Update user progress
router.put('/progress', authenticateToken, async (req, res) => {
  try {
    const { type, data } = req.body
    let progress = await UserProgress.findOne({ userId: req.user.id })

    if (!progress) {
      progress = new UserProgress({
        userId: req.user.id,
        education: {},
        market: {},
        civic: {},
        translate: { history: [] }
      })
    }

    if (type === 'education') {
      progress.education = { ...progress.education, ...data }
    } else if (type === 'market') {
      progress.market = { ...progress.market, ...data }
    } else if (type === 'civic') {
      progress.civic = { ...progress.civic, ...data }
    } else if (type === 'translate') {
      progress.translate = { ...progress.translate, ...data }
    }

    await progress.save()

    // Log activity
    const activity = new UserActivity({
      userId: req.user.id,
      type: 'progress_update',
      description: `Updated ${type} progress`
    })
    await activity.save()

    res.json({ ok: true, progress })
  } catch (err) {
    console.error('Progress update error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Get user bookmarks
router.get('/bookmarks', authenticateToken, async (req, res) => {
  try {
    let bookmarks = await UserBookmarks.findOne({ userId: req.user.id })
    if (!bookmarks) {
      bookmarks = new UserBookmarks({
        userId: req.user.id,
        market: [],
        education: [],
        civic: []
      })
      await bookmarks.save()
    }
    res.json({ bookmarks })
  } catch (err) {
    console.error('Bookmarks fetch error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Update user bookmarks
router.put('/bookmarks', authenticateToken, async (req, res) => {
  try {
    const { type, itemId, action } = req.body
    let bookmarks = await UserBookmarks.findOne({ userId: req.user.id })

    if (!bookmarks) {
      bookmarks = new UserBookmarks({
        userId: req.user.id,
        market: [],
        education: [],
        civic: []
      })
    }

    if (action === 'add') {
      if (!bookmarks[type].includes(itemId)) {
        bookmarks[type].push(itemId)
      }
    } else if (action === 'remove') {
      bookmarks[type] = bookmarks[type].filter(id => id !== itemId)
    }

    await bookmarks.save()

    // Log activity
    const activity = new UserActivity({
      userId: req.user.id,
      type: 'bookmark',
      description: `${action === 'add' ? 'Added' : 'Removed'} ${type} bookmark`
    })
    await activity.save()

    res.json({ ok: true, bookmarks })
  } catch (err) {
    console.error('Bookmarks update error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Get user activity
router.get('/activity', authenticateToken, async (req, res) => {
  try {
    const activities = await UserActivity.find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .limit(50)

    res.json({ activity: activities })
  } catch (err) {
    console.error('Activity fetch error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Verify token and user
router.post('/verify', authenticateToken, async (req, res) => {
  try {
    // If authenticateToken middleware passed, token is valid
    const user = await User.findOne({ id: req.user.id })
    if (!user) {
      return res.status(401).json({ ok: false, error: 'User not found' })
    }
    res.json({ 
      ok: true, 
      verified: true,
      user: { id: user.id, email: user.email, name: user.name }
    })
  } catch (err) {
    console.error('Verification error:', err)
    res.status(401).json({ ok: false, error: 'Token invalid' })
  }
})

module.exports = router
