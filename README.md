# AI For Bharat - SAHAAY Platform

A comprehensive full-stack web application providing education, civic engagement, resource discovery, and economic opportunities for users across India with multi-language support.

## Overview

AI For Bharat (SAHAAY) is an inclusive digital platform combining:
- **Civic Hub**: Government schemes, applications, and civic information
- **Education**: Curated courses with YouTube video integration (8+ courses)
- **Market Hub**: Job opportunities, internships, grants, and scholarships with career page links
- **Resource Library**: Location-based discovery of books, libraries, learning centers, and online platforms
- **User Dashboard**: Progress tracking and personalized recommendations
- **Multi-Language Support**: English, Hindi, Tamil, Telugu, Bengali

## Current Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Vite 5.x/7.x** - Lightning-fast build tool and dev server
- **React Router v6** - Client-side routing
- **React Context API** - State management & internationalization (i18n)
- **CSS3** - Responsive design with animations
- **Google Maps Embed API** - Location visualization
- **Web Speech API** - Geolocation for nearby resources

### Backend
- **Node.js 16+** - JavaScript runtime
- **Express.js 4.x** - RESTful API framework
- **bcryptjs** - Password hashing (10 salt rounds)
- **jsonwebtoken (JWT)** - Session management (7-day expiration)
- **cors** - Cross-origin request handling

### Data Storage - Dual Mode
**AWS Option (Production):**
- **Amazon S3** - User data persistence (JSON files with auto-versioning)
- **AWS SDK** - Official AWS integration
- **Environment-based switching** - Automatic S3 fallback

**Non-AWS Option (Development/Offline):**
- **Local File System** - JSON file storage at `server/data/users.json`
- **Auto-detection** - Falls back when AWS credentials unavailable
- **No database required** - Flat-file data persistence

## Project Structure

```
Ai_For_Bharat/
├── client/                          # React frontend application
│   ├── src/
│   │   ├── pages/                   # Page components
│   │   │   ├── Home.jsx             # Landing page
│   │   │   ├── Dashboard.jsx        # User dashboard
│   │   │   ├── Education.jsx        # Education page with lessons
│   │   │   ├── CivicHub.jsx         # Civic engagement
│   │   │   ├── Market.jsx           # Marketplace
│   │   │   ├── Profile.jsx          # User profile
│   │   │   ├── Login.jsx            # Login page
│   │   │   └── Signup.jsx           # Signup page
│   │   ├── routes/                  # Route components
│   │   │   └── AIConsole.jsx        # AI console
│   │   ├── i18n/                    # Internationalization
│   │   │   ├── LanguageContext.jsx  # Language context provider
│   │   │   └── translations.js      # Translation strings
│   │   ├── App.jsx                  # Main app component
│   │   ├── main.jsx                 # Entry point
│   │   ├── App.css                  # App styles
│   │   └── styles.css               # Global styles
│   ├── index.html                   # HTML template
│   ├── vite.config.js               # Vite configuration
│   └── package.json                 # Dependencies
│
└── server/                          # Express backend application
    ├── routes/
    │   └── auth.js                  # Authentication routes
    ├── services/
    │   └── aiProvider.js            # AI provider service
    ├── index.js                     # Server entry point
    └── package.json                 # Dependencies
```

## Features

- **Multi-Language Support**: Built-in internationalization for regional languages
- **Education Platform**: Browse and track lessons across different categories
- **User Authentication**: Secure login and signup functionality
- **User Dashboard**: Personalized dashboard for tracking progress
- **Marketplace**: Buy and sell products and services
- **Civic Engagement**: Community-focused features and discussions
- **AI Console**: AI-powered tools and assistance
- **Progress Tracking**: Monitor learning progress with visual indicators

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Install Server Dependencies**
```bash
cd server
npm install
```

2. **Install Client Dependencies**
```bash
cd ../client
npm install
```

### Running the Application

1. **Start the Server**
```bash
cd server
npm start
```
The server will run on `http://localhost:3000` (or your configured port)

2. **Start the Client (in another terminal)**
```bash
cd client
npm run dev
```
The client will run on `http://localhost:5173` (Vite default)

## Available Pages & Features

### Public Routes
- **Home** (`/`) - Landing page with platform overview
- **Login** (`/login`) - Email/password authentication
- **Signup** (`/signup`) - User registration with auto-login
- **Translate** (`/translate`) - Multi-language translation tool

### Authenticated Routes
- **Dashboard** (`/dashboard`) - User activity, progress, and recommendations
- **Civic Hub** (`/civic`) - 6 government schemes with verified URLs:
  - PM Kisan Samman Nidhi
  - Ayushman Bharat
  - Skill India
  - Swachh Bharat
  - Startup India
  - Digital India
- **Education** (`/education`) - 8 curated courses with YouTube video embeds
- **Market** (`/market`) - 8 opportunities (jobs, internships, grants, scholarships) with:
  - Company career page links
  - Embedded Google Maps location
  - Salary/prize information
- **Resources** (`/resources`) - Location-based resource discovery:
  - 20+ libraries, learning centers, books, online platforms
  - Geolocation detection
  - Adjustable search radius (5-200 km)
  - Embedded Google Maps for each location
  - Categorized by resource type
- **Profile** (`/profile`) - User account settings

### Integrated External Services
- **Google Maps Embed** - Location visualization and navigation
- **YouTube Embed** - Educational video streaming
- **LinkedIn Jobs** - Job/internship links
- **Government Portals** - Official scheme applications
- **Coursera/Online Platforms** - External course access

## Configuration

### Server Environment Variables (`.env`)
```bash
# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRY=7d

# AWS (Optional - for S3 storage)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=your-bucket-name

# Data Storage (auto-detects: use local if AWS creds missing)
USE_LOCAL_STORE=true  # Set to true to force local storage
```

### Client Environment Variables (Optional)
```bash
# Vite runs on localhost:5173 by default
VITE_API_URL=http://localhost:5000
```

### Running with AWS vs Non-AWS
**With AWS S3:**
- Set all AWS_* variables in `.env`
- User data persists to S3  
- Auto-versioning enabled

**Without AWS (Development):**
- Leave AWS credentials empty
- System auto-falls back to `server/data/users.json`
- Perfect for local development

## Scripts & Startup

### Client Scripts
```bash
cd client
npm install
npm run dev          # Start Vite dev server (http://localhost:5173)
npm run build        # Production build
npm run preview      # Preview production bundle
```

### Server Scripts
```bash
cd server
npm install
node index.js        # Start Express server (http://localhost:5000)
```

### Full Stack Startup (Recommended)
```bash
# Terminal 1 - Backend
cd server
node index.js

# Terminal 2 - Frontend (in new terminal)
cd client
npm run dev -- --host
```

### Demo Credentials
```
Email: demo@sahaay.com
Password: demo123
```
(Auto-created on startup with bcrypt-hashed password)

## Key Implementation Details

### Authentication Flow
1. User signs up → password hashed with bcrypt → user created in S3/local storage
2. User logs in → credentials verified → JWT token generated → stored in localStorage
3. Protected routes → JWT verified via `/api/auth/verify` endpoint
4. Token expiry → automatic logout after 7 days

### Multi-Language Support
- 5 languages: English, Hindi, Tamil, Telugu, Bengali
- Context API for i18n state management
- Dynamic document language (`lang` attribute) and direction (LTR/RTL)
- All UI text translated through `t()` hook

### External Integrations
- **Google Maps**: Embedded for resource locations and job locations
- **YouTube**: Embedded course videos with autoplay
- **Government URLs**: Direct links to official scheme applications
- **LinkedIn Jobs**: Search-based job/internship feeds
- **Coursera/Khan Academy**: Links to external learning platforms

### Data Persistence
- **User Data**: S3 (with local fallback) as JSON documents
- **Nested User Structure**: Profile, progress, bookmarks, activity
- **No migrations needed**: Flat-file JSON schema
- **S3 Versioning**: Enabled for data recovery

## Contributing

1. Create a feature branch
2. Test both AWS and non-AWS configurations
3. Ensure translations are added for all 5 languages
4. Verify responsive design on mobile
5. Submit pull request with test evidence
