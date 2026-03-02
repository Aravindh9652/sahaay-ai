const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

// Simple user storage using S3
const { loadUsers, saveUsers } = require('../services/userStore')

// helpers to sign jwt
function signToken(user){
  const secret = process.env.JWT_SECRET || 'dev-secret'
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, secret, { expiresIn: '7d' })
}

// helpers to manipulate user store
async function findUserByEmail(email) {
  const users = await loadUsers()
  return Object.values(users).find(u => u.email === email) || null
}

async function saveUser(user) {
  const users = await loadUsers()
  users[user.id] = user
  await saveUsers(users)
}

async function ensureUserData(userId) {
  const users = await loadUsers()
  if (!users[userId]) return null
  return users[userId]
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

    // check existence
    const existing = await findUserByEmail(email)
    if (existing) return res.status(400).json({ error: 'Email already registered', userExists: true })

    // hash and create user object
    const hash = await bcrypt.hash(password, 10)
    const userId = crypto.randomBytes(8).toString('hex')

    const now = new Date()
    const user = {
      id: userId,
      name,
      email,
      passwordHash: hash,
      verified: false,
      createdAt: now,
      lastLogin: now,
      profile: {
        name,
        email,
        phone: phone || '',
        location: location || '',
        language: language || 'en',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
        bio: '',
        skills: [],
        interests: [],
        joinedDate: now,
        isActive: true
      },
      progress: {
        education: {},
        market: {},
        civic: {},
        translate: { history: [] }
      },
      bookmarks: {
        market: [],
        education: [],
        civic: []
      },
      activity: [
        { type: 'signup', description: 'Account created successfully', timestamp: now }
      ]
    }

    await saveUser(user)

    console.log('User created (S3):', email)
    const token = signToken(user)

    res.json({ ok: true, user: { id: userId, name, email }, token })
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

    const user = await findUserByEmail(email)
    if (!user) return res.status(401).json({ error: 'Invalid email or password' })

    const validPassword = await bcrypt.compare(password, user.passwordHash)
    if (!validPassword) return res.status(401).json({ error: 'Invalid email or password' })

    user.lastLogin = new Date()
    user.activity = user.activity || []
    user.activity.push({ type: 'login', description: 'User logged in', timestamp: new Date() })
    await saveUser(user)

    const token = signToken(user)
    res.json({ ok: true, user: { id: user.id, name: user.name, email: user.email }, token })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const u = await ensureUserData(req.user.id)
    if (!u || !u.profile) return res.status(404).json({ error: 'Profile not found' })
    res.json({ profile: u.profile })
  } catch (err) {
    console.error('Profile fetch error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, phone, location, language, bio, skills, interests } = req.body
    const users = await loadUsers()
    const u = users[req.user.id]
    if (!u) return res.status(404).json({ error: 'Profile not found' })

    const profile = u.profile || {}
    if (name) profile.name = name
    if (phone !== undefined) profile.phone = phone
    if (location !== undefined) profile.location = location
    if (language) profile.language = language
    if (bio !== undefined) profile.bio = bio
    if (skills) profile.skills = skills
    if (interests) profile.interests = interests

    u.profile = profile
    if (name) u.name = name

    u.activity = u.activity || []
    u.activity.push({ type: 'profile_update', description: 'Profile updated', timestamp: new Date() })

    await saveUsers(users)
    res.json({ ok: true, profile })
  } catch (err) {
    console.error('Profile update error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Get user progress
router.get('/progress', authenticateToken, async (req, res) => {
  try {
    const u = await ensureUserData(req.user.id)
    const progress = (u && u.progress) || { education: {}, market: {}, civic: {}, translate: { history: [] } }
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
    const users = await loadUsers()
    const u = users[req.user.id] || {}
    u.progress = u.progress || { education: {}, market: {}, civic: {}, translate: { history: [] } }

    if (type === 'education') {
      u.progress.education = { ...u.progress.education, ...data }
    } else if (type === 'market') {
      u.progress.market = { ...u.progress.market, ...data }
    } else if (type === 'civic') {
      u.progress.civic = { ...u.progress.civic, ...data }
    } else if (type === 'translate') {
      u.progress.translate = { ...u.progress.translate, ...data }
    }

    u.activity = u.activity || []
    u.activity.push({ type: 'progress_update', description: `Updated ${type} progress`, timestamp: new Date() })

    users[req.user.id] = u
    await saveUsers(users)

    res.json({ ok: true, progress: u.progress })
  } catch (err) {
    console.error('Progress update error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Get user bookmarks
router.get('/bookmarks', authenticateToken, async (req, res) => {
  try {
    const u = await ensureUserData(req.user.id)
    const bookmarks = (u && u.bookmarks) || { market: [], education: [], civic: [] }
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
    const users = await loadUsers()
    const u = users[req.user.id] || {}
    u.bookmarks = u.bookmarks || { market: [], education: [], civic: [] }

    if (action === 'add') {
      if (!u.bookmarks[type].includes(itemId)) u.bookmarks[type].push(itemId)
    } else if (action === 'remove') {
      u.bookmarks[type] = u.bookmarks[type].filter(id => id !== itemId)
    }

    u.activity = u.activity || []
    u.activity.push({ type: 'bookmark', description: `${action === 'add' ? 'Added' : 'Removed'} ${type} bookmark`, timestamp: new Date() })

    users[req.user.id] = u
    await saveUsers(users)

    res.json({ ok: true, bookmarks: u.bookmarks })
  } catch (err) {
    console.error('Bookmarks update error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Get user activity
router.get('/activity', authenticateToken, async (req, res) => {
  try {
    const u = await ensureUserData(req.user.id)
    const activities = (u && u.activity) || []
    // sort descending
    activities.sort((a,b)=> new Date(b.timestamp) - new Date(a.timestamp))
    res.json({ activity: activities.slice(0,50) })
  } catch (err) {
    console.error('Activity fetch error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Add custom activity event
router.post('/activity', authenticateToken, async (req, res) => {
  try {
    const { type, description, metadata } = req.body || {}
    if (!description || typeof description !== 'string') {
      return res.status(400).json({ error: 'Description is required' })
    }

    const users = await loadUsers()
    const u = users[req.user.id]
    if (!u) {
      return res.status(404).json({ error: 'User not found' })
    }

    u.activity = u.activity || []
    u.activity.push({
      type: type || 'activity',
      description: description.trim(),
      metadata: metadata || {},
      timestamp: new Date()
    })

    users[req.user.id] = u
    await saveUsers(users)

    res.json({ ok: true })
  } catch (err) {
    console.error('Add activity error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Verify token and user
router.post('/verify', authenticateToken, async (req, res) => {
  try {
    const u = await ensureUserData(req.user.id)
    if (!u) {
      return res.status(401).json({ ok: false, error: 'User not found' })
    }
    res.json({ ok: true, verified: true, user: { id: u.id, email: u.email, name: u.name } })
  } catch (err) {
    console.error('Verification error:', err)
    res.status(401).json({ ok: false, error: 'Token invalid' })
  }
})

module.exports = router
