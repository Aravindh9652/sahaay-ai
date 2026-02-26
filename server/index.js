const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
// const connectDB = require('./config/database') // disabled (using S3 storage)
const aiProvider = require('./services/aiProvider')

// AWS Integration modules - OPTIONAL
let ragEngine, s3Client, dynamodbClient
try {
  ragEngine = require('./aws/ragEngine')
  s3Client = require('./aws/s3Client')
  dynamodbClient = require('./aws/dynamodbClient')
  console.log('[AWS] Integration modules loaded successfully')
} catch (err) {
  console.log('[AWS] AWS modules not available - using local storage fallback')
  // AWS modules are optional - we'll use local JSON storage fallback
}

dotenv.config()

// Connect to database (disabled - using S3 instead)
// connectDB()

const app = express()
app.use(cors())
app.use(express.json())

// ==================== INITIALIZE DEMO USER ====================
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const { loadUsers, saveUsers } = require('./services/userStore')

async function ensureDemoUser() {
  try {
    const users = await loadUsers()
    const demoExists = Object.values(users).find(u => u.email === 'demo@sahaay.com')
    if (demoExists) return
    
    const hash = await bcrypt.hash('demo123', 10)
    const demoUser = {
      id: 'demo_user_001',
      name: 'Demo User',
      email: 'demo@sahaay.com',
      passwordHash: hash,
      verified: true,
      createdAt: new Date(),
      lastLogin: new Date(),
      profile: {
        name: 'Demo User',
        email: 'demo@sahaay.com',
        phone: '+91-9999999999',
        location: 'India',
        language: 'en',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo_user_001',
        bio: 'Welcome to SAHAAY! Explore government schemes and services.',
        skills: ['Research', 'Learning'],
        interests: ['Government Schemes', 'Education', 'Healthcare'],
        joinedDate: new Date(),
        isActive: true
      },
      progress: { education: {}, market: {}, civic: {}, translate: { history: [] } },
      bookmarks: { market: [], education: [], civic: [] },
      activity: [{ type: 'signup', description: 'Demo account created', timestamp: new Date() }]
    }
    users['demo_user_001'] = demoUser
    await saveUsers(users)
    console.log('[Init] Demo user created: demo@sahaay.com / demo123')
  } catch (err) {
    console.error('[Init] Failed to create demo user:', err.message)
  }
}

ensureDemoUser()

// ==================== HEALTH CHECK ENDPOINTS ====================
app.get('/', (req, res) => {
  res.json({
    ok: true,
    message: 'SAHAAY server running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// ==================== AUTHENTICATION ROUTES ====================
app.use('/api/auth', require('./routes/auth'))

// ==================== LEGACY AI ROUTES ====================
// Keep for backward compatibility with existing clients
app.post('/api/ai/query', async (req, res) => {
  const { query, provider, options } = req.body || {}
  if (!query) return res.status(400).json({ error: 'Missing query' })
  try {
    const r = await aiProvider.handleQuery({ query, provider, options })
    res.json({ ok: true, response: r })
  } catch (err) {
    console.error('AI query error:', err)
    res.status(500).json({ error: 'AI error' })
  }
})

// ==================== TRANSLATION ROUTES ====================
app.post('/api/translate/translate', async (req, res) => {
  const { text, target, source, useAI } = req.body
  if (!text || !target) return res.status(400).json({ error: 'Missing text or target language' })

  const dictionary = {
    'hi': {
      'hello': 'नमस्ते', 'hi': 'नमस्ते', 'hey': 'अरे',
      'goodbye': 'अलविदा', 'bye': 'अलविदा',
      'thank you': 'धन्यवाद', 'thanks': 'धन्यवाद',
      'yes': 'हाँ', 'ok': 'ठीक है', 'okay': 'ठीक है',
      'no': 'नहीं', 'nope': 'नहीं',
      'good morning': 'सुप्रभात', 'morning': 'सुप्रभात',
      'good afternoon': 'नमस्ते', 'afternoon': 'दोपहर',
      'good evening': 'शुभ संध्या', 'evening': 'शाम',
      'good night': 'शुभ रात्रि', 'night': 'रात',
      'how are you': 'आप कैसे हैं', 'how': 'कैसे', 'are': 'हैं', 'you': 'आप',
      'i am fine': 'मैं ठीक हूँ', 'fine': 'ठीक',
      'good': 'अच्छा', 'bad': 'बुरा', 'love': 'प्यार',
      'water': 'पानी', 'food': 'खाना', 'help': 'मदद',
      'friend': 'दोस्त', 'family': 'परिवार', 'home': 'घर',
      'listen': 'सुनिए', 'speak': 'बोलिए', 'translate': 'अनुवाद करें'
    },
    'ta': {
      'hello': 'வணக்கம்', 'hi': 'வணக்கம்', 'hey': 'ஆய்',
      'goodbye': 'பிறகு சந்திப்போம்', 'bye': 'பிறகு சந்திப்போம்',
      'thank you': 'நன்றி', 'thanks': 'நன்றி',
      'yes': 'ஆம்', 'ok': 'சரி', 'okay': 'சரி',
      'no': 'இல்லை', 'nope': 'இல்லை',
      'good morning': 'காலைநலம்', 'morning': 'காலை',
      'good afternoon': 'பிற்பகல் வணக்கம்', 'afternoon': 'பிற்பகல்',
      'good evening': 'மாலை வணக்கம்', 'evening': 'மாலை',
      'good night': 'இரவு வணக்கம்', 'night': 'இரவு',
      'how are you': 'நீ எப்படி இருக்கிறாய்', 'how': 'எப்படி', 'are': 'இருக்கிறாய்', 'you': 'நீ',
      'i am fine': 'நான் நன்றாக இருக்கிறேன்', 'fine': 'நன்றாக',
      'good': 'நல்ல', 'bad': 'கெட்ட', 'love': 'அன்பு',
      'water': 'நீர்', 'food': 'உணவு', 'help': 'உதவி',
      'friend': 'நண்பன்', 'family': 'குடும்பம்', 'home': 'வீடு',
      'listen': 'கேளுங்கள்', 'speak': 'பேசுங்கள்', 'translate': 'மொழிபெயர்ப்பு செய்யுங்கள்'
    },
    'te': {
      'hello': 'హలో', 'hi': 'హలో', 'hey': 'ఓయ్',
      'goodbye': 'సరే', 'bye': 'దీక్ష',
      'thank you': 'ధన్యవాదాలు', 'thanks': 'ధన్యవాదాలు',
      'yes': 'అవును', 'ok': 'సరే', 'okay': 'సరే',
      'no': 'లేదు', 'nope': 'లేదు',
      'good morning': 'శుభోదయం', 'shubodayam': 'శుభోదయం', 'morning': 'ఉదయం',
      'good afternoon': 'శుభ మధ్యాహ్నం', 'afternoon': 'మధ్యాహ్నం',
      'good evening': 'శుభ సంధ్య', 'evening': 'సంధ్య',
      'good night': 'శుభ రాత్రి', 'night': 'రాత్రి',
      'how are you': 'మీరు ఎలా ఉన్నారు', 'how': 'ఎలా', 'are': 'ఉన్నారు', 'you': 'మీరు',
      'i am fine': 'నేను బాగున్నాను', 'fine': 'బాగు',
      'good': 'మంచి', 'bad': 'చెడ్డ', 'love': 'ప్రేమ',
      'water': 'నీరు', 'food': 'ఆహారం', 'help': 'సహాయం',
      'friend': 'స్నేహితుడు', 'family': 'కుటుంబం', 'home': 'ఇల్లు',
      'listen': 'వినండి', 'speak': 'మాట్లాడండి', 'translate': 'అనువాదం చేయండి'
    },
    'bn': {
      'hello': 'হ্যালো', 'hi': 'হ্যালো', 'hey': 'ওয়েই',
      'goodbye': 'বিদায়', 'bye': 'পুনরায় দেখা হবে',
      'thank you': 'ধন্যবাদ', 'thanks': 'ধন্যবাদ',
      'yes': 'হ্যাঁ', 'ok': 'ঠিক আছে', 'okay': 'ঠিক আছে',
      'no': 'না', 'nope': 'না',
      'good morning': 'শুভ সকাল', 'morning': 'সকাল',
      'good afternoon': 'শুভ অপরাহ্ন', 'afternoon': 'অপরাহ্ন',
      'good evening': 'শুভ সন্ধ্যা', 'evening': 'সন্ধ্যা',
      'good night': 'শুভ রাত্রি', 'night': 'রাত',
      'how are you': 'আপনি কেমন আছেন', 'how': 'কেমন', 'are': 'আছেন', 'you': 'আপনি',
      'i am fine': 'আমি ভালো আছি', 'fine': 'ভালো',
      'good': 'ভাল', 'bad': 'খারাপ', 'love': 'ভালোবাসা',
      'water': 'পানি', 'food': 'খাবার', 'help': 'সাহায্য',
      'friend': 'বন্ধু', 'family': 'পরিবার', 'home': 'বাড়ি',
      'listen': 'শুনুন', 'speak': 'কথা বলুন', 'translate': 'অনুবাদ করুন'
    }
  }

  try {
    const lowerText = text.toLowerCase().trim()
    console.log(`[Translation] Input: "${text}" (${lowerText}), Target: ${target}`)

    // Try exact match in dictionary first
    if (dictionary[target] && dictionary[target][lowerText]) {
      const result = dictionary[target][lowerText]
      console.log(`[Translation] Exact match found: "${result}"`)
      return res.json({ translated: result, language: target })
    }

    // Try partial dictionary match
    if (dictionary[target]) {
      for (let key in dictionary[target]) {
        if (lowerText.includes(key) || key.includes(lowerText)) {
          const result = dictionary[target][key]
          console.log(`[Translation] Partial match found: "${key}" -> "${result}"`)
          return res.json({ translated: result, language: target })
        }
      }
    }

    // Final fallback - return the original text
    console.log(`[Translation] No match found, returning original text`)
    return res.json({ translated: text, language: target })

  } catch (err) {
    console.error('[Translation] Endpoint error:', err.message)
    res.json({ translated: text, language: target })
  }
})

// ==================== AWS RAG ENDPOINTS (PRIMARY) ====================

// POST /api/aws/query - Government scheme queries with Claude 3 Haiku + RAG
app.post('/api/aws/query', async (req, res) => {
  try {
    const { userId, query, language = 'en', context } = req.body

    if (!userId || !query) {
      return res.status(400).json({
        error: 'Missing required fields: userId, query',
        code: 'INVALID_REQUEST'
      })
    }

    console.log(`[AWS RAG] Processing query from ${userId}: "${query.substring(0, 50)}..."`)

    // Process through RAG pipeline
    const result = await ragEngine.processQuery({
      userId,
      query,
      language,
      context
    })

    res.json({
      ok: true,
      data: result
    })

  } catch (error) {
    console.error('[AWS RAG] Query error:', error)
    res.status(500).json({
      error: 'Query processing failed',
      message: error.message,
      code: 'RAG_ERROR'
    })
  }
})

// POST /api/aws/query/multilingual - Multilingual queries
app.post('/api/aws/query/multilingual', async (req, res) => {
  try {
    const { userId, query, targetLanguage = 'en' } = req.body

    if (!userId || !query) {
      return res.status(400).json({
        error: 'Missing userId or query'
      })
    }

    const result = await ragEngine.processMultilingualQuery({
      userId,
      query,
      targetLanguage
    })

    res.json({
      ok: true,
      data: result
    })

  } catch (error) {
    console.error('[AWS RAG] Multilingual error:', error)
    res.status(500).json({
      error: 'Multilingual query failed',
      message: error.message
    })
  }
})

// GET /api/aws/health - Health check for all AWS services
app.get('/api/aws/health', async (req, res) => {
  try {
    const health = await ragEngine.healthCheck()
    res.json({
      ok: health.healthy,
      checks: health.checks,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message
    })
  }
})

// GET /api/aws/info - Service information and configuration
app.get('/api/aws/info', (req, res) => {
  res.json({
    service: 'SAHAAY AWS Civic AI Assistant',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    deployment: 'AWS Lambda + Express',
    features: {
      bedrock: 'Claude 3 Haiku for multilingual conversational AI',
      dynamodb: 'User queries and session storage with TTL',
      s3: 'Government scheme documents and metadata',
      rag: 'Retrieval-Augmented Generation pipeline',
      multilingual: 'Hindi, Tamil, Telugu, Bengali, English (5 languages)'
    },
    aws: {
      region: process.env.AWS_REGION || 'us-east-1',
      bedrockModel: process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-haiku-20240307-v1:0',
      s3Bucket: process.env.AWS_S3_BUCKET || 'sahaay-documents',
      dynamodbTables: {
        queries: process.env.DYNAMODB_QUERIES_TABLE || 'sahaay-queries',
        users: process.env.DYNAMODB_USERS_TABLE || 'sahaay-users',
        schemes: process.env.DYNAMODB_SAVED_SCHEMES_TABLE || 'sahaay-saved-schemes'
      }
    }
  })
})

// ==================== ERROR HANDLING ====================
app.use((err, req, res, next) => {
  console.error('[ERROR] Unhandled error:', err)
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
  })
})

// ==================== SERVER STARTUP ====================
const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║                SAHAAY AWS SERVER STARTED               ║
╠════════════════════════════════════════════════════════╣
║ Server:         http://localhost:${PORT}                   
║ Environment:    ${process.env.NODE_ENV || 'development'}
║ AWS Region:     ${process.env.AWS_REGION || 'us-east-1'}
║ Bedrock Model:  Claude 3 Haiku                        
║ Database:       DynamoDB (3 tables)                   
║ Storage:        S3 (${process.env.AWS_S3_BUCKET || 'sahaay-documents'})
╠════════════════════════════════════════════════════════╣
║ Available Endpoints:                                   
║  POST   /api/aws/query            (Query assistant)   
║  POST   /api/aws/query/multilingual (Multilingual)    
║  GET    /api/aws/health           (Health check)
║  GET    /api/aws/info             (Service info)
║  POST   /api/auth/*               (Authentication)    
║  POST   /api/translate/translate   (Translation)      
╚════════════════════════════════════════════════════════╝
  `)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[SERVER] SIGTERM received, gracefully shutting down...')
  server.close(() => {
    console.log('[SERVER] Server closed')
    process.exit(0)
  })
})

module.exports = app
