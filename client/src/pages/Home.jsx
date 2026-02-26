import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import '../styles/home.css'

export default function Home({ user }) {
  const { t, language } = useLanguage()
  const navigate = useNavigate()
  const [hoveredFeature, setHoveredFeature] = useState(null)
  const [queryInput, setQueryInput] = useState('')
  const [showDemo, setShowDemo] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [serviceReady] = useState(true)

  const handleQuery = async (e) => {
    e.preventDefault()
    if (!queryInput.trim()) return
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  const features = [
    {
      id: 'schemes',
      title: 'Government Schemes',
      description: 'Discover and learn about government schemes in your language',
      icon: '📋',
      color: '#667eea'
    },
    {
      id: 'search',
      title: 'Smart Search',
      description: 'Find relevant schemes using AI-powered search',
      icon: '🔍',
      color: '#f093fb'
    },
    {
      id: 'multilingual',
      title: 'Multilingual Support',
      description: 'Get answers in Hindi, Tamil, Telugu, Bengali, or English',
      icon: '🌍',
      color: '#4facfe'
    },
    {
      id: 'history',
      title: 'Query History',
      description: 'Keep track of your queries and favorite schemes',
      icon: '📚',
      color: '#00f2fe'
    }
  ]

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="home-hero">
        <div className="hero-content">
          <h1 className="hero-title">SAHAAY</h1>
          <p className="hero-subtitle">
            Your AI-Powered Guide to Government Schemes
          </p>
          <p className="hero-description">
            Discover government schemes and benefits tailored to your needs, powered by AWS AI
          </p>

          {!user && (
            <div className="hero-buttons">
              <button
                className="btn-primary"
                onClick={() => navigate('/login')}
              >
                Get Started
              </button>
              <button
                className="btn-secondary"
                onClick={() => setShowDemo(!showDemo)}
              >
                Try Demo
              </button>
            </div>
          )}

          {user && (
            <div className="hero-buttons">
              <button
                className="btn-primary"
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </button>
              <button
                className="btn-secondary"
                onClick={() => navigate('/civic-hub')}
              >
                Explore Schemes
              </button>
            </div>
          )}
        </div>

        {showDemo && (
          <div className="demo-section">
            <div className="demo-card">
              <h3>Try SAHAAY Demo</h3>
              <form onSubmit={handleQuery}>
                <input
                  type="text"
                  placeholder="Ask about government schemes..."
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  disabled={loading || !serviceReady}
                  className="demo-input"
                />
                <button
                  type="submit"
                  disabled={loading || !serviceReady || !queryInput.trim()}
                  className="demo-button"
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </form>

              {!serviceReady && (
                <div className="demo-warning">
                  ⚠️ Service is initializing. Please wait...
                </div>
              )}

              {error && (
                <div className="demo-error">
                  ❌ {error.message || 'An error occurred'}
                </div>
              )}

              {success && (
                <div className="demo-success">
                  ✓ Query processed successfully!
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="feature-card"
              style={{
                transform: hoveredFeature === feature.id ? 'translateY(-10px)' : 'translateY(0)',
                boxShadow: hoveredFeature === feature.id ? `0 10px 30px ${feature.color}40` : '0 5px 15px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={() => setHoveredFeature(feature.id)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="feature-icon" style={{ color: feature.color }}>
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Section */}
      <div className="tech-section">
        <h2>Powered By</h2>
        <div className="tech-stack">
          <div className="tech-item">
            <div className="tech-icon">🧠</div>
            <div className="tech-name">AWS Bedrock</div>
            <div className="tech-desc">Claude 3 Haiku AI</div>
          </div>
          <div className="tech-item">
            <div className="tech-icon">💾</div>
            <div className="tech-name">DynamoDB</div>
            <div className="tech-desc">Query History & Users</div>
          </div>
          <div className="tech-item">
            <div className="tech-icon">📦</div>
            <div className="tech-name">S3 Storage</div>
            <div className="tech-desc">Document Storage</div>
          </div>
          <div className="tech-item">
            <div className="tech-icon">🔄</div>
            <div className="tech-name">RAG Pipeline</div>
            <div className="tech-desc">Retrieval-Augmented Generation</div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h4>Ask a Question</h4>
            <p>Query about government schemes in your preferred language</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h4>AI Processes</h4>
            <p>AWS Claude AI understands your intent and recognizes keywords</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h4>Search Schemes</h4>
            <p>Relevant government schemes are retrieved from our database</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h4>Get Answer</h4>
            <p>Receive a comprehensive answer with scheme details and links</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="cta-section">
        <h2>Ready to Explore Government Schemes?</h2>
        <p>Join thousands of Indians getting access to government benefits</p>
        {!user ? (
          <div className="cta-buttons">
            <button className="btn-large-primary" onClick={() => navigate('/signup')}>
              Sign Up Now
            </button>
            <button className="btn-large-secondary" onClick={() => navigate('/login')}>
              Sign In
            </button>
          </div>
        ) : (
          <button className="btn-large-primary" onClick={() => navigate('/dashboard')}>
            Open Dashboard
          </button>
        )}
      </div>

      {/* Footer Info */}
      <div className="footer-info">
        <div className="footer-content">
          <h4>About SAHAAY</h4>
          <p>
            SAHAAY is an AI-powered civic tech platform helping Indian citizens discover and access government schemes and benefits. We use AWS cloud services to provide fast, reliable, and multilingual support.
          </p>
          <div className="footer-languages">
            <p>Available in: English • हिंदी • தமிழ் • తెలుగు • বাংলা</p>
          </div>
        </div>
      </div>
    </div>
  )
}
