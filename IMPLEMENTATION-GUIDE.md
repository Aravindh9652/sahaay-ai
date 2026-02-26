# SAHAAY - AWS Full Stack Implementation Guide

**Document Date**: February 26, 2026  
**Status**: Production Ready  
**Tech Stack**: React 18 + Express 4.18 + AWS (Bedrock, DynamoDB, S3)

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [AWS Services Setup](#aws-services-setup)
4. [Backend Implementation](#backend-implementation)
5. [Frontend Implementation](#frontend-implementation)
6. [API Endpoints](#api-endpoints)
7. [Running Locally](#running-locally)
8. [Deployment](#deployment)
9. [Testing](#testing)

---

## 🎯 Project Overview

**SAHAAY** is a civic AI platform that helps Indian citizens discover and access government schemes using AWS-powered AI.

### Key Features
- 🤖 AI-powered scheme recommendations using Claude 3 Haiku
- 🌍 Multilingual support (English, Hindi, Tamil, Telugu, Bengali)
- 📚 Query history and bookmarking via DynamoDB
- 📄 Document storage and retrieval via S3
- 🔄 RAG (Retrieval-Augmented Generation) pipeline
- ⚡ Serverless architecture ready for AWS Lambda

### User Journey
```
User Query (in any language)
    ↓
Frontend sends to /api/aws/query
    ↓
Backend RAG ENGINE
    ├─ Intent Recognition (using Bedrock)
    ├─ Document Retrieval (from S3)
    ├─ Context Building
    └─ Response Generation (using Bedrock)
    ↓
Store in DynamoDB (query history)
    ↓
Return result with sources
```

---

## 🏗️ Architecture

### System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND LAYER                         │
│                                                               │
│  React 18 + Vite  (Port 5173)                              │
│  ├─ Home (Hero + Features)                                 │
│  ├─ CivicHub (Schemes Directory)                           │
│  ├─ Dashboard (User Profile)                               │
│  └─ AI Query Interface                                     │
│                                                               │
│  AWS Service Client (awsServiceClient.js)                  │
│  useAWSService Hook (Custom React Hook)                    │
└──────────────────────────┬──────────────────────────────────┘
                           │
                      HTTP/REST
                           │
┌──────────────────────────┴──────────────────────────────────┐
│                      EXPRESS SERVER                         │
│                                                               │
│  Node.js 18 + Express 4.18  (Port 5000)                   │
│                                                               │
│  ┌──────────────────────────────────────────────────┐      │
│  │              AWS MODULES                         │      │
│  ├─ bedrockClient.js (LLM)                         │      │
│  ├─ dynamodbClient.js (Persistence)               │      │
│  ├─ s3Client.js (Document Storage)                │      │
│  ├─ ragEngine.js (RAG Pipeline Orchestrator)      │      │
│  ├─ awsServiceUtils.js (Utilities)                │      │
│  ├─ awsServiceContext.js (Service Context)        │      │
│  └─ awsConfig.js (Configuration Loader)           │      │
│  └─────────────────────────────────────────────────┘      │
│                                                               │
│  API ENDPOINTS: /api/aws/                                 │
│  ├─ POST /query (main query)                             │
│  ├─ POST /query/multilingual                            │
│  ├─ GET /health (service health)                        │
│  ├─ GET /info (service info)                           │
│  └─ POST /auth/* (authentication)                       │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
    AWS Bedrock          DynamoDB             S3
    (Claude 3 Haiku)    (3 Tables)      (Documents)
        │                  │                  │
    ┌───┴───────┐      ┌───┴──────┐      ┌──┴────┐
    │  LLM Calls│      │ Queries  │      │Schemes│
    │ & Intent  │      │ Users    │      │Metadata
    │Recognition│      │Bookmarks │      │
    └───────────┘      └──────────┘      └───────┘
```

### Data Flow

#### 1. Query Processing Flow
```
1. User submits query in frontend
   ↓
2. Frontend calls: POST /api/aws/query
   {userId, query, language, context}
   ↓
3. Express Server routes to RAG Engine
   ↓
4. RAG Engine Pipeline:
   a) invokeBedrockModel() → Intent Recognition
   b) searchSchemesByKeyword() → Get matching schemes from S3
   c) buildAugmentedContext() → Combine results
   d) invokeBedrockModel() → Generate final answer
   ↓
5. storeQuery() → Save to DynamoDB
   ↓
6. Return {answer, sources, queryId}
   ↓
7. Frontend displays results
```

#### 2. Multilingual Query Flow
```
User Query (in any language)
   ↓
detectLanguage() → [Hindi, Tamil, Telugu, Bengali, English]
   ↓
Process with Bedrock + DynamoDB + S3
   ↓
Translate results to targetLanguage
   ↓
Return response in target language
```

---

## ⚙️ AWS Services Setup

### 1. AWS Bedrock Setup

**What it does**: Provides Claude 3 Haiku LLM for queries

#### Steps:
```bash
# 1. Go to AWS Console → Bedrock
# 2. Enable the model:
#    - Click "Request Model Access"
#    - Select: anthropic.claude-3-haiku-20240307-v1:0
#    - Click "Request"

# 3. Wait for activation (usually instant)
# 4. Verify it's available:
aws bedrock list-foundation-models --region us-east-1
```

**Environment Variables**:
```env
BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
BEDROCK_REGION=us-east-1
```

**Usage**:
- Intent recognition from user queries
- Generating human-friendly responses
- Multilingual awareness and translation cues

---

### 2. AWS DynamoDB Setup

**What it does**: Stores queries, users, and bookmarks

#### Table 1: sahaay-queries
```
Primary Key: queryId (String)
Sort Key: timestamp (Number)

Attributes:
- userId (String)
- query (String)
- response (String)
- language (String)
- intent (String)
- sources (List)
- ttl (Number) - 90 days auto-delete
```

#### Table 2: sahaay-users
```
Primary Key: userId (String)

Attributes:
- email (String)
- name (String)
- language_preference (String)
- created_at (Number)
- last_activity (Number)
```

#### Table 3: sahaay-saved-schemes
```
Primary Key: userId (String)
Sort Key: schemeId (String)

Attributes:
- scheme_name (String)
- category (String)
- saved_at (Number)
- notes (String)
```

#### Steps:
```bash
# 1. Go to AWS Console → DynamoDB

# 2. Create table 1:
#    Name: sahaay-queries
#    Primary key: queryId (String)
#    Sort key: timestamp (Number)
#    TTL: queryId, 7776000 (90 days)
#    Billing: On-demand

# 3. Repeat for sahaay-users and sahaay-saved-schemes
```

**Environment Variables**:
```env
DYNAMODB_QUERIES_TABLE=sahaay-queries
DYNAMODB_USERS_TABLE=sahaay-users
DYNAMODB_SAVED_SCHEMES_TABLE=sahaay-saved-schemes
DYNAMODB_REGION=us-east-1
```

---

### 3. AWS S3 Setup

**What it does**: Stores government scheme documents

#### Bucket Structure:
```
sahaay-documents/
├─ metadata/
│  ├─ schemes.json (list of all schemes)
│  ├─ categories.json (category mapping)
│  └─ keywords.json (keyword index)
│
├─ schemes/
│  ├─ agriculture/
│  │  ├─ pm-kisan/document.pdf
│  │  └─ metadata.json
│  ├─ health/
│  ├─ education/
│  └─ ...
│
└─ search-index/
   └─ scheme-keywords.json (for efficient search)
```

#### Steps:
```bash
# 1. Go to AWS Console → S3

# 2. Create bucket:
#    Name: sahaay-documents
#    Region: us-east-1
#    Block Public Access: ON (all)
#    Versioning: ON

# 3. Upload sample schemes from /data/schemes/

# 4. Create IAM policy (AWS-IAM-POLICY.json)
```

**Environment Variables**:
```env
AWS_S3_BUCKET=sahaay-documents
AWS_S3_REGION=us-east-1
```

---

### 4. IAM Role Setup

**What it does**: Grants permissions to access AWS services

#### Required Permissions:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "bedrock:InvokeModel",
      "Resource": "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-haiku*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:Query",
        "dynamodb:UpdateItem"
      ],
      "Resource": "arn:aws:dynamodb:us-east-1:ACCOUNT_ID:table/sahaay-*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket",
        "s3:PutObject"
      ],
      "Resource": [
        "arn:aws:s3:::sahaay-documents",
        "arn:aws:s3:::sahaay-documents/*"
      ]
    }
  ]
}
```

#### Steps:
```bash
# 1. Go to AWS Console → IAM → Roles

# 2. Create role:
#    - Trusted entity: EC2, Lambda, or your user
#    - Attach policy: AWS-IAM-POLICY.json

# 3. Assign to EC2 instance or Lambda function
```

---

## 🖥️ Backend Implementation

### Project Structure
```
server/
├─ config/
│  ├─ awsConfig.js (AWS configuration loader)
│  └─ database.js (MongoDB connection)
│
├─ aws/
│  ├─ bedrockClient.js (Claude 3 Haiku invocation)
│  ├─ dynamodbClient.js (Query/User/Bookmark storage)
│  ├─ s3Client.js (Document retrieval)
│  ├─ ragEngine.js (RAG pipeline orchestrator)
│  ├─ awsServiceUtils.js (AWS utilities & retry logic)
│  ├─ awsServiceContext.js (Service context for frontend)
│  └─ awsConfig.js (Configuration management)
│
├─ routes/
│  └─ auth.js (Authentication)
│
├─ services/
│  ├─ aiProvider.js (Legacy AI provider)
│  └─ [other services]
│
├─ index.js (EXPRESS SERVER - Main entry point)
├─ lambda.js (AWS Lambda wrapper)
├─ package.json (Dependencies - AWS SDK only)
├─ .env.example (Environment variables template)
└─ .env (Local environment configuration)
```

### Key Files Explained

#### 1. `server/index.js` (Express Server)
```javascript
// Entry point for Express server
// Exports:
//  - GET / → Health check
//  - POST /api/auth/* → Authentication flows
//  - POST /api/aws/query → Main query endpoint
//  - POST /api/aws/query/multilingual → Multilingual queries
//  - GET /api/aws/health → Service health check
//  - GET /api/aws/info → Service information
```

**Ports**:
- Development: `localhost:5000`
- Production: Configure via `PORT` env var

#### 2. `server/aws/ragEngine.js` (RAG Pipeline)
```javascript
// Orchestrates the RAG pipeline
// Main function: processQuery({userId, query, language, context})
// Returns: {answer, sources, queryId, metadata}

// Pipeline steps:
// 1. Intent Recognition (Bedrock)
// 2. Document Retrieval (S3)
// 3. Context Building
// 4. Response Generation (Bedrock)
// 5. Storage (DynamoDB)
```

#### 3. `server/aws/bedrockClient.js` (LLM)
```javascript
// Wrapper for AWS Bedrock Claude 3 Haiku
// Exports:
// - invokeBedrockModel(prompt, options)
// - generateSchemeExplanation(scheme, language)
// - recognizeIntent(query)
// - translateWithBedrock(text, targetLanguage)
```

#### 4. `server/aws/dynamodbClient.js` (Database)
```javascript
// DynamoDB client for persistence
// Exports:
// - storeQuery(userId, query, response, language)
// - getQueryHistory(userId, limit = 10)
// - storeUserProfile(userId, userdata)
// - getUserProfile(userId)
// - saveScheme(userId, schemeId, scheme)
// - getSavedSchemes(userId)
```

#### 5. `server/aws/s3Client.js` (Document Storage)
```javascript
// S3 client for scheme documents
// Exports:
// - getSchemeDocument(schemeId)
// - listAvailableSchemes()
// - searchSchemesByKeyword(keyword)
// - getSchemeDocumentSignedUrl(schemeId)
```

---

## 🎨 Frontend Implementation

### Project Structure
```
client/src/
├─ components/
│  └─ [UI components]
│
├─ hooks/
│  └─ useAWSService.js (AWS query hook)
│
├─ pages/
│  ├─ Home.jsx (Hero + Features - AWS integrated)
│  ├─ CivicHub.jsx (Schemes directory - AWS powered)
│  ├─ Dashboard.jsx (User dashboard)
│  ├─ Login.jsx (Authentication)
│  ├─ Signup.jsx (Registration)
│  └─ [other pages]
│
├─ services/
│  └─ awsServiceClient.js (AWS API client)
│
├─ i18n/
│  ├─ LanguageContext.jsx (Language state)
│  └─ translations.js (Translations)
│
├─ styles/
│  ├─ home.css (Home page styles)
│  └─ [other styles]
│
├─ App.jsx (Main App component)
├─ main.jsx (Vite entry point)
└─ vite.config.js (Vite configuration)
```

### Key Files Explained

#### 1. `client/src/services/awsServiceClient.js`
```javascript
// Frontend AWS API client
// Methods:
// - query(userId, query, language)
// - queryMultilingual(userId, query, targetLanguage)
// - health() → service health check
// - getServiceInfo() → service information

// Usage:
// import awsServiceClient from './services/awsServiceClient'
// const result = await awsServiceClient.query(userId, question, language)
```

#### 2. `client/src/hooks/useAWSService.js`
```javascript
// Custom React hook for AWS service client
// Returns {
//   loading, error, success, lastResponse,
//   query, queryMultilingual, checkHealth, getServiceInfo,
//   getErrorMessage, clearError, clearResponse
// }

// Usage:
// const { query, loading, error } = useAWSService(userId)
// await query("Tell me about farmer schemes", "en")
```

#### 3. `client/src/pages/Home.jsx`
```javascript
// Landing page with hero section
// Features:
// - Service readiness check
// - Demo query interface
// - Features showcase
// - Technology stack display
// - Call-to-action buttons
```

#### 4. `client/src/pages/CivicHub.jsx`
```javascript
//Government schemes directory
// Features:
// - AI-powered scheme search
// - Category filtering
// - Scheme details modal
// - Bookmarking (localStorage)
// - Multilingual support
```

---

## 📡 API Endpoints

### Base URL
- Development: `http://localhost:5000`
- Production: `https://your-domain.com` or `https://lambda-url.amazonaws.com`

### Available Endpoints

#### 1. Query Scheme (Main Endpoint)
```http
POST /api/aws/query
Content-Type: application/json

Request Body:
{
  "userId": "user_123",
  "query": "What schemes are available for farmers?",
  "language": "en",
  "context": {} // optional
}

Response:
{
  "ok": true,
  "data": {
    "queryId": "user_123#1708971234567",
    "answer": "Based on your query, here are relevant schemes...",
    "sources": [
      {
        "schemeId": "pm-kisan",
        "name": "PM Kisan Samman Nidhi",
        "category": "Agriculture",
        "relevance": 0.95
      }
    ],
    "metadata": {
      "processingTime": 245,
      "confidenceScore": 0.87,
      "modelsUsed": ["bedrock-claude", "s3-retrieval"]
    }
  }
}
```

#### 2. Multilingual Query
```http
POST /api/aws/query/multilingual
Content-Type: application/json

Request Body:
{
  "userId": "user_123",
  "query": "किसानों के लिए कौन सी योजनाएं उपलब्ध हैं?",
  "targetLanguage": "hi"
}

Response:
{
  "ok": true,
  "data": {
    "queryId": "user_123#1708971234567",
    "detectedLanguage": "hi",
    "answer": "आपके प्रश्न के आधार पर, यहाँ प्रासंगिक योजनाएं हैं...",
    "sources": [...]
  }
}
```

#### 3. Health Check
```http
GET /api/aws/health

Response:
{
  "ok": true,
  "checks": {
    "bedrock": "✓ ok",
    "dynamodb": "✓ ok",
    "s3": "✓ ok",
    "credentials": "✓ ok"
  },
  "timestamp": "2026-02-26T10:15:30.123Z"
}
```

#### 4. Service Information
```http
GET /api/aws/info

Response:
{
  "service": "SAHAAY AWS Civic AI Assistant",
  "version": "1.0.0",
  "deployment": "AWS Lambda + Express",
  "features": {
    "bedrock": "Claude 3 Haiku...",
    "dynamodb": "User queries and session...",
    "s3": "Government scheme documents",
    "rag": "Retrieval-Augmented Generation",
    "multilingual": "5 languages supported"
  },
  "aws": {
    "region": "us-east-1",
    "bedrockModel": "anthropic.claude-3-haiku-20240307-v1:0"
  }
}
```

---

## 🚀 Running Locally

### Prerequisites
```
- Node.js 18+
- npm 9+
- AWS Account with credentials
- Git
```

### Step 1: Clone & Install

```bash
# Clone repository
git clone <repo-url>
cd Ai_For_Bharat

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Step 2: Configure Environment

```bash
# Server configuration
cd server

# Copy example env file
cp .env.example .env

# Edit .env with your AWS credentials
nano .env
```

**Minimal .env Configuration**:
```env
# AWS Credentials
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key_here
AWS_SECRET_ACCESS_KEY=your_secret_here

# AWS Services
BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
DYNAMODB_QUERIES_TABLE=sahaay-queries
DYNAMODB_USERS_TABLE=sahaay-users
DYNAMODB_SAVED_SCHEMES_TABLE=sahaay-saved-schemes
AWS_S3_BUCKET=sahaay-documents

# Server
NODE_ENV=development
PORT=5000
```

### Step 3: Start Servers

```bash
# Terminal 1: Backend Server
cd server
npm start
# Output: Server listening on 5000

# Terminal 2: Frontend Development Server
cd client
npm run dev
# Output: VITE ⚡ ready in XXX ms
```

### Step 4: Access Application

```
Frontend: http://localhost:5173
Backend:  http://localhost:5000
```

### Step 5: Test AWS Integration

```bash
# Check health
curl http://localhost:5000/api/aws/health

# Test query
curl -X POST http://localhost:5000/api/aws/query \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test_user",
    "query": "What schemes are for farmers?",
    "language": "en"
  }'
```

---

## 🌐 Deployment

### Option 1: AWS Lambda + API Gateway (Recommended)

#### Step 1: Create Lambda Function
```bash
# Package backend
cd server
zip -r lambda-deployment.zip . -x "node_modules/*" ".env*"

# Upload to Lambda manually or via CLI:
aws lambda create-function \
  --function-name sahaay-civic-ai \
  --zip-file fileb://lambda-deployment.zip \
  --handler lambda.handler \
  --runtime nodejs18.x \
  --role arn:aws:iam::ACCOUNT_ID:role/lambda-role \
  --timeout 60 \
  --memory-size 512
```

#### Step 2: Create API Gateway
```bash
# Create REST API
aws apigateway create-rest-api \
  --name sahaay-api \
  --description "SAHAAY Civic AI API"

# Integrate with Lambda (use AWS Console for simplicity)
```

#### Step 3: Deploy Frontend to S3 + CloudFront
```bash
# Build frontend
cd client
npm run build

# Upload to S3
aws s3 sync dist/ s3://sahaay-frontend/ --acl public-read

# Create CloudFront distribution (AWS Console)
```

### Option 2: EC2 + Docker

#### Step 1: Create EC2 Instance
```bash
# Launch Ubuntu 22.04 instance
# Security group: Allow 5000 (backend), 443 (HTTPS)
```

#### Step 2: Deploy via Docker
```bash
# SSH into EC2
ssh -i key.pem ubuntu@instance-ip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Clone and deploy
git clone <repo>
cd Ai_For_Bharat
docker-compose up -d
```

#### Step 3: Configure Domain
```bash
# Point domain to EC2 Elastic IP
# Install SSL certificate (Let's Encrypt)
```

### Option 3: Traditional VPS

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and install
git clone <repo>
cd Ai_For_Bharat/server
npm install --production

# Start with PM2
sudo npm install -g pm2
pm2 start index.js --name "sahaay-api"
pm2 startup
pm2 save

# Configure Nginx as reverse proxy
```

---

## ✅ Testing

### Local Testing

```bash
# 1. Check backend is running
curl http://localhost:5000/

# 2. Check AWS services
curl http://localhost:5000/api/aws/health

# 3. Test query endpoint
curl -X POST http://localhost:5000/api/aws/query \
  -H "Content-Type: application/json" \
  -d '{"userId":"test","query":"Tell me about PM Kisan","language":"en"}'

# 4. Test multilingual
curl -X POST http://localhost:5000/api/aws/query/multilingual \
  -H "Content-Type: application/json" \
  -d '{"userId":"test","query":"किसान योजना क्या है?","targetLanguage":"hi"}'
```

### Frontend Testing

```bash
# 1. Check home page loads
# Navigate to http://localhost:5173

# 2. Try demo query
# Click "Try Demo" and submit a query

# 3. Check CivicHub
# Click "Explore Schemes" tab

# 4. Test multilingual
# Select different language from dropdown
```

### AWS Services Testing

```bash
# Test Bedrock
aws bedrock-runtime invoke-model \
  --model-id anthropic.claude-3-haiku-20240307-v1:0 \
  --body '{"messages":[{"role":"user","content":"Hello"}]}' \
  response.json

# Test DynamoDB
aws dynamodb list-tables --region us-east-1

# Test S3
aws s3 ls s3://sahaay-documents/
```

---

## 📊 Monitoring & Logging

### CloudWatch Setup

```bash
# View Express logs
aws logs tail /aws/lambda/sahaay-civic-ai

# Create custom metric
aws cloudwatch put-metric-data \
  --metric-name QueryLatency \
  --value 245 \
  --namespace SAHAAY
```

### Application Logging

```javascript
// In any Express route
console.log('[AWS RAG] Processing query...')

// Environment variable to control log level
LOG_LEVEL=debug npm start
```

---

## 🔒 Security Best Practices

1. **Never commit .env file**
   ```bash
   echo ".env" >> .gitignore
   ```

2. **Use IAM roles instead of access keys** (when on AWS)

3. **Rotate credentials regularly**

4. **Enable AWS CloudTrail** for audit logs

5. **Use HTTPS** in production

6. **Validate all user inputs**

7. **Rate limit API endpoints**

---

## 💰 Cost Estimation

### Monthly Costs (10,000 queries/month)
- **Bedrock**: ~$2.50 (at $0.25/M input tokens)
- **DynamoDB**: ~$1.25 (on-demand pricing)
- **S3**: ~$0.10 (storage + requests)
- **Lambda**: ~$0.20 (if serverless)
- **Total**: **~$4 - $5/month for MVP**

### Scaling to 1M queries/month
- **Estimated**: $50-100/month (with reserved capacity)

---

## 📚 Additional Resources

- [AWS Bedrock Docs](https://docs.aws.amazon.com/bedrock/)
- [DynamoDB Pricing](https://aws.amazon.com/dynamodb/pricing/)
- [S3 Best Practices](https://docs.aws.amazon.com/s3/latest/userguide/)
- [Express.js Guide](https://expressjs.com/)
- [React 18 Docs](https://react.dev/)

---

## 🆘 Troubleshooting

### "AWS credentials not found"
```bash
# Solution 1: Set environment variables
export AWS_ACCESS_KEY_ID=xxx
export AWS_SECRET_ACCESS_KEY=xxx

# Solution 2: Configure AWS CLI
aws configure
# Enter your credentials when prompted

# Solution 3: Use IAM Role (EC2/Lambda)
# Attach role with proper permissions
```

### "DynamoDB table not found"
```bash
# Check table exists
aws dynamodb list-tables --region us-east-1

# Create if missing
aws dynamodb create-table \
  --table-name sahaay-queries \
  --attribute-definitions AttributeName=queryId,AttributeType=S \
  --key-schema AttributeName=queryId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST
```

### "S3 bucket access denied"
```bash
# Check IAM policy allows S3 access
# Review AWS-IAM-POLICY.json

# Verify bucket exists and is accessible
aws s3 ls s3://sahaay-documents/

# Check bucket policy allows your role
aws s3api get-bucket-policy --bucket sahaay-documents
```

### "Bedrock model not available"
```bash
# Verify model is enabled
aws bedrock list-foundation-models --region us-east-1 | grep claude-3-haiku

# If not, request access:
# AWS Console → Bedrock → Model access → Request access
```

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review AWS service documentation
3. Check CloudWatch logs
4. Create GitHub issue with error details

---

**Last Updated**: February 26, 2026  
**Version**: 1.0.0  
**Maintained By**: SAHAAY Team
