const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

// In-memory user store (replace with MongoDB in production)
const users = {}

function signToken(user){
  const secret = process.env.JWT_SECRET || 'dev-secret'
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, secret, { expiresIn: '7d' })
}

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing name, email, or password' })
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' })
    
    // Check if user already exists
    if (users[email]) {
      return res.status(400).json({ error: 'Email already registered', userExists: true })
    }
    
    // Hash password
    const hash = await bcrypt.hash(password, 10)
    const userId = crypto.randomBytes(8).toString('hex')
    
    // Create user
    users[email] = {
      id: userId,
      name,
      email,
      passwordHash: hash,
      verified: false,
      createdAt: new Date()
    }
    
    console.log('User created:', email)
    const token = signToken(users[email])
    
    res.json({ ok: true, token, user: { id: userId, email, name } })
  } catch (err) {
    console.error('Signup error:', err)
    res.status(500).json({ error: 'Server error during signup' })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Missing email or password' })
    
    // Check if user exists
    const user = users[email]
    if (!user) {
      return res.status(401).json({ error: 'User not found. Please create an account.', userNotFound: true })
    }
    
    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.passwordHash)
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid password. Please check and try again.' })
    }
    
    const token = signToken(user)
    res.json({ ok: true, token, user: { id: user.id, email: user.email, name: user.name } })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Server error during login' })
  }
})

// Verify account
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body
    if (!token) return res.status(400).json({ error: 'Missing token' })
    res.json({ ok: true, verified: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
