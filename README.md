# AI For Bharat

A full-stack web application designed to provide education, civic engagement, and market opportunities for users in India.

## Overview

AI For Bharat is a comprehensive platform that combines:
- **Education**: Digital skills, business courses, career development, and more
- **Civic Hub**: Community engagement and civic participation
- **Market**: Marketplace for buying and selling products and services
- **Dashboard**: User dashboard for tracking progress and activities
- **Translations**: Multi-language support for accessibility

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and development server
- **CSS** - Styling with responsive design
- **React Context API** - State management and internationalization

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Authentication** - User authentication and authorization

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
├── server/                          # Express backend application
│   ├── routes/
│   │   └── auth.js                  # Authentication routes
│   ├── services/
│   │   └── aiProvider.js            # AI provider service
│   ├── index.js                     # Server entry point
│   └── package.json                 # Dependencies
│
└── .kiro/specs/                     # Design & Requirements Documentation
    ├── design.md                    # UI/UX design specifications
    └── requirements.md              # Functional & technical requirements
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

## Available Pages

- **Home** (`/`) - Landing page
- **Dashboard** (`/dashboard`) - User dashboard
- **Education** (`/education`) - Learning courses and lessons
- **Civic Hub** (`/civichub`) - Community engagement
- **Market** (`/market`) - Marketplace
- **Profile** (`/profile`) - User profile
- **Login** (`/login`) - User login
- **Signup** (`/signup`) - User registration
- **Translate** (`/translate`) - Translation tools
- **AI Console** (`/aiconsole`) - AI-powered console

## Configuration

### Environment Variables

Create a `.env` file in the server directory with the following variables:
```
PORT=3000
NODE_ENV=development
```

Create a `.env.local` file in the client directory if needed for API endpoints:
```
VITE_API_URL=http://localhost:3000
```

## Scripts

### Client
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Server
- `npm start` - Start the server
- `npm run dev` - Start with nodemon (if configured)

## Hackathon Submission

This project is submitted for hackathon evaluation. Design and technical specification documents are available in the `.kiro/specs` directory:

- **Design Specifications** - UI/UX design and component specifications
- **Requirements Documentation** - Functional and technical requirements

These files contain detailed information about the project's architecture, design decisions, and implementation requirements.

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or suggestions, please contact the development team or open an issue in the repository.

---

**Last Updated**: February 2026
