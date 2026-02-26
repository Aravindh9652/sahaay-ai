# SAHAAY - Final Tech Stack (Simplified & AWS-Focused)

## ✅ Approved Tech Stack

Your proposed stack is **excellent for production**. Here's the final, simplified architecture:

---

## 📐 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Client)                     │
│                                                         │
│  React 18 + Vite (Dev Server)                         │
│  ├─ HTML5 (structure)                                 │
│  ├─ CSS3 (styling)                                    │
│  └─ i18n (Hindi, Tamil, Telugu, Bengali, English)    │
│                                                         │
│  Hosted: Firebase Hosting OR Vercel OR Traditional    │
└─────────────────────────────────────────────────────────┘
                         ↓ (API Calls)
┌─────────────────────────────────────────────────────────┐
│                    BACKEND (Server)                      │
│                                                         │
│  Node.js 18+ Runtime                                  │
│  ├─ Express 4.18 (REST API framework)                │
│  ├─ AWS SDK v3 (AWS integration)                     │
│  └─ dotenv (Configuration management)                │
│                                                         │
│  Deployment: AWS Lambda + API Gateway                │
│  OR Traditional: EC2 / Self-hosted                    │
└─────────────────────────────────────────────────────────┘
                         ↓ (SDK Calls)
┌─────────────────────────────────────────────────────────┐
│              AWS CLOUD SERVICES                          │
│                                                         │
│  1. Amazon Bedrock                                    │
│     └─ Claude 3 Haiku (LLM/GenAI model)              │
│        • Fast (200-300ms per request)                │
│        • Cost-effective ($0.25/M input tokens)       │
│        • Best for government scheme explanations     │
│                                                         │
│  2. Amazon DynamoDB                                  │
│     └─ NoSQL Database                                │
│        • Store user queries & responses              │
│        • Store user profiles & preferences           │
│        • Auto-scaling on demand                      │
│        • Per-request billing (pay for what you use)  │
│                                                         │
│  3. Amazon S3                                        │
│     └─ Object Storage                                │
│        • Store government scheme documents (PDFs)    │
│        • Static website hosting (optional)           │
│        • CloudFront CDN for fast delivery            │
│                                                         │
│  4. AWS Lambda (Serverless Compute)                  │
│     └─ Run Express app without managing servers      │
│        • Auto-scaling                                │
│        • Pay per invocation                          │
│        • No idle costs                               │
│                                                         │
│  5. API Gateway                                      │
│     └─ REST API endpoint                             │
│        • Route requests to Lambda                    │
│        • Rate limiting & throttling                  │
│        • CORS handling                               │
│                                                         │
│  6. CloudWatch (Optional but Recommended)            │
│     └─ Logging, metrics, monitoring                  │
│                                                         │
│  7. IAM (Identity & Access Management)               │
│     └─ Security and permissions                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Final Tech Stack (Simplified)

### Frontend Layer
```
React 18
├─ Vite (build tool & dev server)
├─ HTML5 (semantic markup)
├─ CSS3 (responsive design)
├─ React Router v6 (navigation)
└─ Custom i18n (translations)

Dev Environment:
├─ Node.js 18+
├─ npm (package manager)
└─ VSCode (editor)

Deployment:
├─ Build: npm run build → dist/
└─ Host: Firebase Hosting OR AWS S3 + CloudFront
```

### Backend Layer
```
Node.js Runtime
├─ Express 4.18 (HTTP server)
├─ dotenv (env configuration)
├─ CORS (cross-origin requests)
├─ body-parser (JSON parsing)
└─ AWS SDK v3
    ├─ @aws-sdk/client-bedrock-runtime
    ├─ @aws-sdk/client-dynamodb
    ├─ @aws-sdk/client-s3
    └─ @aws-sdk/s3-request-presigner

Deployment:
├─ Local: npm start (port 5000)
├─ Lambda: serverless-http wrapper
└─ Traditional: Node on EC2/Server
```

### AI/LLM Layer
```
Amazon Bedrock
└─ Claude 3 Haiku (anthropic.claude-3-haiku-20240307-v1:0)
   ├─ Input: $0.25 per M tokens
   ├─ Output: $1.25 per M tokens
   ├─ Speed: 100–200ms latency
   └─ Capabilities:
       ├─ Text understanding
       ├─ Scheme explanation
       ├─ Intent classification
       └─ Multilingual response
```

### Database Layer
```
Amazon DynamoDB (NoSQL)
├─ Table 1: sahaay-queries
│   └─ Store user Q&A pairs with TTL (90 days)
├─ Table 2: sahaay-users
│   └─ Store user profiles & language preferences
└─ Table 3: sahaay-saved-schemes
    └─ Store bookmarked schemes per user

Pricing:
├─ On-demand: Pay per read/write (recommended for MVP)
└─ Free tier: 25 GB storage + 200M RCU/WCU
```

### Document Storage Layer
```
Amazon S3 (Object Storage)
├─ Bucket: sahaay-documents
├─ Structure: schemes/{schemeId}/document.{txt|pdf|json}
├─ Use: Store government scheme documents for RAG
└─ Features:
    ├─ Versioning (track changes)
    ├─ Lifecycle policies (archive old docs)
    ├─ Server-side encryption
    └─ CloudFront CDN integration
```

### AWS Support Services
```
API Gateway
└─ REST API endpoint for Lambda/Express
   ├─ Route /api/* → Lambda function
   ├─ CORS policies
   └─ Request validation

CloudWatch (Logging & Monitoring)
├─ Application logs
├─ Request metrics
├─ Error tracking
└─ Cost monitoring

IAM (Security)
├─ Bedrock invoke permissions
├─ DynamoDB read/write
├─ S3 object access
└─ CloudWatch logs creation

CloudFront (CDN) - Optional
├─ Cache S3 documents
├─ Global edge locations
└─ Reduce S3 bandwidth cost
```

---

## 📊 Tech Stack Comparison Matrix

### What You Keep ✅
| Component | Technology | Choice | Status |
|-----------|-----------|--------|--------|
| **Frontend** | React 18 + Vite | Keep ✅ | Production-ready |
| **Frontend Build** | HTML + CSS | Keep ✅ | No frameworks needed |
| **Backend Runtime** | Node.js 18+ | Keep ✅ | Stable LTS |
| **HTTP Server** | Express 4.18 | Keep ✅ | Standard industry |
| **AI Model** | Claude 3 Haiku | Keep ✅ | Best for schemes |
| **Database** | DynamoDB | Keep ✅ | NoSQL, serverless |
| **Storage** | S3 | Keep ✅ | Scalable documents |
| **Deployment** | AWS Lambda | Keep ✅ | Serverless, auto-scale |

### What You REMOVE ❌
| Component | Technology | Reason | Status |
|-----------|-----------|--------|--------|
| **Alternative LLM** | Groq / OpenAI | Not needed, Bedrock is enough | ❌ Remove |
| **Alternative DB** | Firebase / MongoDB | DynamoDB is solid choice | ❌ Remove |
| **Alternative Storage** | Firebase Storage | S3 is proven, works great | ❌ Remove |
| **Multi-provider setup** | Firebase modules | Adds complexity, use AWS only | ❌ Remove |
| **Complex routing** | Multiple endpoints | Simplify: just /api/query endpoints | ❌ Remove |

### What You DON'T NEED
- ❌ MongoDB (use DynamoDB)
- ❌ Firebase (use AWS entirely)
- ❌ Groq / OpenAI (Bedrock Claude is excellent)
- ❌ Complex multi-LLM switching logic
- ❌ Multiple storage providers
- ❌ Firebase Authentication (use Lambda IAM or simple JWT)

---

## 🔧 Simplified Backend Structure

```javascript
// server/index.js - Only AWS, nothing else

const express = require('express')
const { BedrockRuntimeClient } = require('@aws-sdk/client-bedrock-runtime')
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3')

const app = express()

// Initialize AWS clients
const bedrockClient = new BedrockRuntimeClient({ region: process.env.AWS_REGION })
const dynamodbClient = new DynamoDBClient({ region: process.env.AWS_REGION })
const s3Client = new S3Client({ region: process.env.AWS_REGION })

// Routes
app.post('/api/query', async (req, res) => {
  // 1. Get scheme documents from S3
  // 2. Query Bedrock (Claude 3 Haiku)
  // 3. Store result in DynamoDB
  // 4. Return response
})

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'SAHAAY AWS Backend' })
})

module.exports = app  // For Lambda wrapper
```

---

## 📦 Dependencies (Minimal)

### Required
```json
{
  "express": "^4.18.2",           // HTTP server
  "dotenv": "^16.6.1",            // Environment config
  "cors": "^2.8.5",               // Cross-origin requests
  "@aws-sdk/client-bedrock-runtime": "^3.555.0",  // Claude
  "@aws-sdk/client-dynamodb": "^3.555.0",         // Database
  "@aws-sdk/client-s3": "^3.555.0"                // Storage
}
```

### Optional (for Lambda deployment)
```json
{
  "serverless-http": "^3.2.0",    // Express -> Lambda adapter
  "serverless": "^3.38.0"         // Serverless Framework
}
```

### NOT Needed (Remove)
- ❌ firebase-admin
- ❌ openai
- ❌ groq-sdk
- ❌ mongoose (using DynamoDB, not MongoDB)

---

## 🚀 Deployment Architecture

### Option A: Traditional Server (Simple, Best for Learning)
```
EC2 Instance (Ubuntu 22.04)
  ├─ Node.js 18
  ├─ npm install
  ├─ npm start (port 5000)
  └─ Nginx reverse proxy

Cost: $5-15/month
Pros: Simple, full control
Cons: Manual scaling, manual deployment
```

### Option B: AWS Lambda (Recommended, Serverless)
```
API Gateway
  ├─ REST endpoint: /api/*
  └─ Routes to Lambda function

Lambda Function
  ├─ Express app wrapped with serverless-http
  ├─ Auto-scales (handles 1000s concurrent)
  └─ Cold start: ~1 second

Cost: Free tier + $0.0000002 per request
Pros: Auto-scale, pay-per-invocation, no servers
Cons: Cold-start latency, slightly complex setup
```

### Option C: Docker + ECR + ECS (Enterprise)
```
Docker Container
  └─ Node.js + Express app

ECR (Elastic Container Registry)
  └─ Store Docker image

ECS (Elastic Container Service)
  ├─ Run Docker containers
  ├─ Auto-scaling policy
  └─ CloudWatch integration

Cost: EC2 instance + container overhead
Pros: Portable, enterprise-standard
Cons: More complex, higher cost
```

**RECOMMENDATION for MVP**: Option B (Lambda) - simplest serverless, most cost-effective

---

## 💰 Cost Estimation (10K Users, 100K Queries/Month)

### Worst Case (Always Running)
```
DynamoDB:
  ├─ 300K reads @ $0.25/M = $0.08
  ├─ 100K writes @ $1.25/M = $0.13
  └─ Storage: Free (25GB free tier)

Bedrock (Claude 3 Haiku):
  ├─ Input: 100K queries × 200 tokens = 20B tokens
  └─ Cost: 20B ÷ 1M × $0.25 = $5.00

S3:
  ├─ Storage: 100 docs × 1MB = 100MB (free)
  └─ Transfer: 1GB = $0.09

Lambda: Free tier covers most
API Gateway: ~$0.35

─────────────────────────
Total Monthly: ~$5.65/month ✅
```

### At Scale (1M Queries/Month)
```
DynamoDB: ~$1.30/month
Bedrock: ~$50/month
S3: ~$1/month
Lambda: ~$3/month
API Gateway: ~$4/month
─────────────────────────
Total: ~$59/month
```

**Still very affordable! ✅**

---

## 🔐 Security Setup

### AWS IAM Policy (For Lambda Execution Role)
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "bedrock:InvokeModel",
      "Resource": "arn:aws:bedrock:*:*:foundation-model/anthropic.claude-3-haiku*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": [
        "arn:aws:dynamodb:*:*:table/sahaay-queries",
        "arn:aws:dynamodb:*:*:table/sahaay-users",
        "arn:aws:dynamodb:*:*:table/sahaay-saved-schemes"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::sahaay-documents",
        "arn:aws:s3:::sahaay-documents/*"
      ]
    }
  ]
}
```

### Environment Variables Required
```bash
# AWS Configuration
AWS_REGION=us-east-1

# Bedrock Configuration
BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0

# DynamoDB Configuration
DYNAMODB_QUERIES_TABLE=sahaay-queries
DYNAMODB_USERS_TABLE=sahaay-users
DYNAMODB_SCHEMES_TABLE=sahaay-saved-schemes

# S3 Configuration
S3_BUCKET=sahaay-documents
S3_SCHEMES_PREFIX=schemes/

# Server Configuration
PORT=5000
NODE_ENV=production
```

---

## 📋 Implementation Checklist

### Phase 1: Core Setup (Week 1)
- [ ] AWS account created
- [ ] IAM role with Bedrock + DynamoDB + S3 permissions
- [ ] Bedrock access enabled
- [ ] DynamoDB tables created (3 tables)
- [ ] S3 bucket created with sample documents
- [ ] Express backend with AWS SDK
- [ ] Health check endpoint working
- [ ] React frontend communicating with backend

### Phase 2: Production Ready (Week 2)
- [ ] Error handling comprehensive
- [ ] CloudWatch logging enabled
- [ ] Rate limiting configured
- [ ] Security headers added
- [ ] CORS properly configured
- [ ] Input validation on all endpoints
- [ ] Database TTL policies set
- [ ] S3 lifecycle policies configured

### Phase 3: Optimization (Week 3)
- [ ] Lambda deployment tested
- [ ] API Gateway configured
- [ ] CloudFront CDN enabled for S3
- [ ] Cost optimization reviewed
- [ ] Performance benchmarks recorded
- [ ] Load testing completed
- [ ] Monitoring dashboards created

### Phase 4: Launch (Week 4)
- [ ] Documentation finalized
- [ ] Team trained
- [ ] Runbooks created
- [ ] Disaster recovery plan
- [ ] Go-live date confirmed
- [ ] Monitoring 24/7 ready

---

## 🎯 What to Build First

### Day 1: Create Core Endpoints
```javascript
app.post('/api/query', async (req, res) => {
  const { query, userId } = req.body
  
  // 1. Query S3 for scheme documents
  const schemes = await queryS3Schemes(query)
  
  // 2. Call Bedrock to generate response
  const response = await invokeBedrock(query, schemes)
  
  // 3. Store in DynamoDB
  await storeDynamoDB({ userId, query, response })
  
  // 4. Return to client
  res.json({ ok: true, response })
})
```

### Day 2: Add Persistence
```javascript
// DynamoDB operations
- Save user queries
- Save user profiles
- Track query history
- Auto-cleanup old queries (TTL)
```

### Day 3: Multi-language Support
```javascript
// Extend Bedrock prompt to:
- Detect user language
- Respond in same language
- Store language preference
```

### Day 4: Error Handling & Monitoring
```javascript
// Add:
- Try-catch blocks
- CloudWatch logs
- Health checks
- Error responses
```

---

## 📊 System Reliability

### Uptime & Performance
```
Expected Uptime:     99.9% (AWS SLA)
Query Latency:       1-3 seconds
Cold Start (Lambda): ~1 second (consider provisioned concurrency)
Database Latency:    < 100ms
LLM Latency:         200-500ms
```

### Fallback Strategy
```
If Bedrock fails:
  └─→ Return cached response OR generic message

If DynamoDB fails:
  └─→ Still return answer (don't store)

If S3 fails:
  └─→ Use in-memory document cache
```

---

## 🎓 Learning Path

### Prerequisites
1. AWS fundamentals (1 hour)
2. Node.js + Express basics (2 hours)
3. REST API design (1 hour)
4. Environment variables & .env (30 min)

### Build Order
1. Local Express server with mock data
2. Connect to AWS Bedrock (test invocation)
3. Connect to DynamoDB (test CRUD)
4. Connect to S3 (test retrieval)
5. Integrate all 3 (full RAG pipeline)
6. Deploy to Lambda
7. Deploy frontend
8. Performance testing
9. Cost optimization

### Estimated Time
- Beginner: 2-3 weeks
- Intermediate: 1 week
- Advanced: 2-3 days

---

## ✨ Final Recommendations

### ✅ KEEP (AWS-Focused)
1. **React + Vite** (frontend) - It's fast and simple
2. **Express** (backend) - Standard, familiar
3. **Claude 3 Haiku** (AI) - Fast, cheap, great quality
4. **DynamoDB** (database) - NoSQL, serverless, scales
5. **S3** (storage) - Reliable, cost-effective
6. **Lambda** (deployment) - Serverless, pay-per-use

### ❌ REMOVE (Simplify)
1. **Firebase modules** - Not needed, AWS is enough
2. **Groq/OpenAI integration** - Bedrock is sufficient
3. **MongoDB** - DynamoDB is better for this use case
4. **Multi-provider logic** - Adds unnecessary complexity
5. **Complex routing** - Keep it simple: just /api/query

### 📈 Future Additions (If Needed)
- CloudFront CDN (for global fast delivery)
- ElastiCache (for caching frequent queries)
- SageMaker (if you want to fine-tune Claude)
- Event-driven architecture (SNS/SQS for async tasks)

---

## 🎉 You're Ready!

Your tech stack is **production-grade**:
- ✅ Proven technologies
- ✅ Cost-effective ($5-60/month)
- ✅ Highly scalable
- ✅ Secure by default
- ✅ Simple enough to maintain

**Start with the AWS modules you already have.** You have everything needed!

---

## 📞 Quick Reference

**Frontend**: http://localhost:5173 (Vite)
**Backend**: http://localhost:5000 (Express)
**AWS Region**: us-east-1 (or your closest region)
**DB**: DynamoDB (us-east-1)
**AI**: Bedrock Claude 3 Haiku (us-east-1)
**Storage**: S3 sahaay-documents

**Deploy**:
```bash
# Frontend
npm run build  # Creates dist/
# Upload to Firebase Hosting or S3 + CloudFront

# Backend
# Option 1: Lambda (serverless-http wrapper)
serverless deploy

# Option 2: Traditional EC2
scp dist/* user@server:/var/app/
npm start
```

---

**SAHAAY: Government Schemes for Every Indian**

Simple. Powerful. AWS-Native.

Ready to build? Start with `AWS-DEPLOYMENT.md` 🚀
