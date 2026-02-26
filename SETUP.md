# SAHAAY - Clean Setup Guide

## 🎯 What You Have

A production-ready civic AI platform for Indians with:
- **Frontend**: React 18 + Vite (fast, modern)
- **Backend**: Node.js + Express (simple, proven)
- **AI**: AWS Bedrock + Claude 3 Haiku (fast, affordable)
- **Database**: DynamoDB (NoSQL, serverless)
- **Storage**: S3 (documents, reliable)

---

## 📁 Project Structure (Clean)

```
Ai_For_Bharat/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── pages/         # UI pages
│   │   ├── i18n/          # Multilingual support
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Backend (Express)
│   ├── aws/               # AWS modules (Bedrock, DynamoDB, S3)
│   │   ├── bedrockClient.js
│   │   ├── dynamodbClient.js
│   │   ├── s3Client.js
│   │   └── ragEngine.js
│   ├── routes/
│   ├── services/
│   ├── index.js           # Main server
│   ├── package.json
│   └── lambda.js          # For AWS Lambda deployment
│
├── FINAL-TECH-STACK.md    # Architecture & setup guide
├── AWS-IAM-POLICY.json    # AWS permissions (copy-paste)
└── README.md              # Project overview
```

---

## 🚀 Quick Start (5 minutes)

### 1. Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2. Configure Environment

Create `server/.env`:
```bash
AWS_REGION=us-east-1
BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
DYNAMODB_QUERIES_TABLE=sahaay-queries
DYNAMODB_USERS_TABLE=sahaay-users
DYNAMODB_SCHEMES_TABLE=sahaay-saved-schemes
S3_BUCKET=sahaay-documents
S3_SCHEMES_PREFIX=schemes/
PORT=5000
NODE_ENV=development
```

### 3. Run Locally

```bash
# Terminal 1 - Backend (http://localhost:5000)
cd server
npm start

# Terminal 2 - Frontend (http://localhost:5173)
cd client
npm run dev
```

---

## 🛠️ API Endpoint

### Single Query Endpoint

```javascript
POST /api/query
Content-Type: application/json

{
  "userId": "user123",
  "query": "What schemes help farmers?"
}

Response:
{
  "ok": true,
  "response": "Based on available schemes...",
  "metadata": {
    "responseTime": "1.2s",
    "documentsUsed": 3
  }
}
```

---

## ☁️ AWS Setup (One-Time)

### 1. Enable Bedrock
```
AWS Console → Bedrock → Request access to Claude 3 Haiku
Wait ~5 minutes for approval
```

### 2. Create DynamoDB Tables
```bash
# Table 1: sahaay-queries
aws dynamodb create-table \
  --table-name sahaay-queries \
  --attribute-definitions AttributeName=userId,AttributeType=S \
  --key-schema AttributeName=userId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST

# Table 2: sahaay-users
aws dynamodb create-table \
  --table-name sahaay-users \
  --attribute-definitions AttributeName=userId,AttributeType=S \
  --key-schema AttributeName=userId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST

# Table 3: sahaay-saved-schemes
aws dynamodb create-table \
  --table-name sahaay-saved-schemes \
  --attribute-definitions AttributeName=userId,AttributeType=S \
  --key-schema AttributeName=userId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST
```

### 3. Create S3 Bucket
```bash
aws s3 mb s3://sahaay-documents --region us-east-1
aws s3 cp scheme1.pdf s3://sahaay-documents/schemes/pm-kisan/document.pdf
```

### 4. Setup IAM Role
Copy policy from `AWS-IAM-POLICY.json` to your Lambda execution role

---

## 📊 Cost

| Usage | Monthly Cost |
|-------|-------------|
| 10K queries | **$5.65** |
| 100K queries | **$56.50** |
| 1M queries | **$565** |

All on AWS free tier except Bedrock.

---

## 🔐 Security Basics

✅ Store AWS credentials in `.env` (never commit)
✅ Use IAM roles for Lambda
✅ DynamoDB on-demand billing (no over-provisioning)
✅ S3 bucket encryption enabled
✅ CORS properly configured

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| **FINAL-TECH-STACK.md** | Complete architecture & implementation guide |
| **AWS-IAM-POLICY.json** | Copy-paste IAM permissions |
| **README.md** | Project overview |

---

## 🧪 Test the API

```bash
# Health check
curl http://localhost:5000/api/health

# Query endpoint
curl -X POST http://localhost:5000/api/query \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user",
    "query": "What schemes help farmers?"
  }'
```

---

## 🚀 Deploy to Production

### Option 1: AWS Lambda (Recommended)
```bash
# Wrap Express with serverless-http
npx serverless deploy

# Creates API Gateway endpoint
# Auto-scales to handle 1000s concurrent users
# Pay only for usage: ~$0.0000002 per request
```

### Option 2: Traditional Server (EC2 / VPS)
```bash
# Deploy to Ubuntu with Nginx
git clone <repo>
cd server
npm install
npm start  # Runs on port 5000
```

### Option 3: Docker
```bash
docker build -t sahaay .
docker run -p 5000:5000 sahaay
```

---

## 🆘 Troubleshooting

### "cannot find module @aws-sdk"
```bash
cd server
npm install @aws-sdk/client-bedrock-runtime @aws-sdk/client-dynamodb @aws-sdk/client-s3
```

### "access denied" to DynamoDB
```bash
# Check AWS credentials
aws sts get-caller-identity

# Ensure IAM policy includes DynamoDB permissions
# See AWS-IAM-POLICY.json
```

### "Bedrock not responding"
```bash
# Verify Bedrock is enabled in your region
# Verify Claude 3 Haiku access request was approved
# Check AWS_REGION in .env matches your Bedrock region
```

### "Port 5000 already in use"
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

---

## ✨ Features

✅ **Multilingual** - Hindi, Tamil, Telugu, Bengali, English
✅ **RAG Pipeline** - Query → Document Retrieval → AI Generation → Storage
✅ **User Profiles** - Track query history and preferences
✅ **Saved Schemes** - Users can bookmark favorite government schemes
✅ **Fast** - Bedrock + DynamoDB: typical response time 1-3 seconds
✅ **Scalable** - AWS auto-scales when needed
✅ **Affordable** - Free tier + $5-60/month depending on usage
✅ **Secure** - IAM, encryption, CORS

---

## 🎯 Next Steps

1. **Develop locally** - Run both frontend and backend
2. **Test endpoints** - Verify all API routes work
3. **Setup AWS** - Create DynamoDB tables, S3 bucket, IAM role
4. **Load sample data** - Upload government scheme documents to S3
5. **Deploy** - Choose Lambda, EC2, or Docker
6. **Monitor** - Setup CloudWatch logging and alerts
7. **Optimize** - Track costs, improve response times

---

## 📖 Full Documentation

For complete setup, architecture, and implementation details:
👉 **See [FINAL-TECH-STACK.md](FINAL-TECH-STACK.md)**

This file contains:
- Complete architecture diagrams
- Step-by-step AWS setup
- IAM policy details
- Code examples
- Cost breakdown
- Deployment options
- Troubleshooting guide

---

## 🎉 You're Ready!

Everything is set up and documented. Start building! 🚀

**Questions?** Refer to FINAL-TECH-STACK.md or check AWS documentation.
