import React, { useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

// Mock government schemes database with verified apply URLs
const civicInitiatives = [
  {
    id: 1,
    name: 'PM Kisan Samman Nidhi',
    category: 'Agriculture',
    icon: '🌾',
    color: '#10b981',
    status: 'Active',
    beneficiaries: '12.5 Crore',
    amount: '₹2000/month',
    description: 'Direct income support to farmer families',
    eligibility: 'Farmers with landholding up to 2 hectares',
    benefits: 'Quarterly cash transfer of ₹2000',
    applyUrl: 'https://pmkisan.gov.in/'
  },
  {
    id: 2,
    name: 'Ayushman Bharat',
    category: 'Healthcare',
    icon: '🏥',
    color: '#ef4444',
    status: 'Active',
    beneficiaries: '50+ Crore',
    amount: '₹5 Lakhs/year',
    description: 'Health insurance for vulnerable families',
    eligibility: 'Families below certain income threshold',
    benefits: 'Free hospitalization up to ₹5 lakhs',
    applyUrl: 'https://pmjay.gov.in/'
  },
  {
    id: 3,
    name: 'Skill India',
    category: 'Education',
    icon: '📚',
    color: '#3b82f6',
    status: 'Active',
    beneficiaries: '40 Lakhs',
    amount: 'Free Training',
    description: 'Vocational training and skill development',
    eligibility: 'Youth aged 15-45 years',
    benefits: 'Free skill training in various trades',
    applyUrl: 'https://www.nsdc.org.in/'
  },
  {
    id: 4,
    name: 'Swachh Bharat',
    category: 'Infrastructure',
    icon: '🧹',
    color: '#f59e0b',
    status: 'Active',
    beneficiaries: '110 Crore',
    amount: 'Varies',
    description: 'Sanitation and clean water initiatives',
    eligibility: 'All households and public spaces',
    benefits: 'Improved sanitation infrastructure',
    applyUrl: 'https://swachhbharat.mygov.in/'
  },
  {
    id: 5,
    name: 'Startup India',
    category: 'Business',
    icon: '🚀',
    color: '#8b5cf6',
    status: 'Active',
    beneficiaries: '89,000+',
    amount: '₹10k-10Cr',
    description: 'Support for startups and entrepreneurs',
    eligibility: 'Registered Indian startups',
    benefits: 'Funding, tax benefits, and mentorship',
    applyUrl: 'https://www.startupindia.gov.in/'
  },
  {
    id: 6,
    name: 'Digital India',
    category: 'Technology',
    icon: '💻',
    color: '#06b6d4',
    status: 'Active',
    beneficiaries: '500+ Million',
    amount: 'Infrastructure',
    description: 'Digital transformation and connectivity',
    eligibility: 'All citizens and businesses',
    benefits: 'Digital infrastructure and services',
    applyUrl: 'https://www.digitalindia.gov.in/'
  }
]

export default function CivicHub({ user }) {
  const { t, language } = useLanguage()

  const [filter, setFilter] = useState('All')
  const [selectedInitiative, setSelectedInitiative] = useState(null)
  const [bookmarked, setBookmarked] = useState({})
  const [searchQuery, setSearchQuery] = useState('')

  const categories = ['All', ...new Set(civicInitiatives.map(init => init.category))]

  const filtered = civicInitiatives.filter(init => {
    const matchCategory = filter === 'All' || init.category === filter
    const matchSearch = searchQuery === '' || init.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCategory && matchSearch
  })

  const toggleBookmark = (id) => {
    setBookmarked(b => ({ ...b, [id]: !b[id] }))
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      padding: '40px 20px',
      position: 'relative'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          color: 'white',
          marginBottom: '50px',
          animation: 'slideInDown 0.6s ease-out'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '900',
            margin: '0 0 10px 0',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>Government Schemes</h1>
          <p style={{
            fontSize: '1.2rem',
            opacity: '0.95',
            margin: 0
          }}>Discover schemes & benefits tailored for you</p>
        </div>

        {/* Search Section */}
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          padding: '30px',
          borderRadius: '12px',
          marginBottom: '40px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <h3 style={{ color: '#667eea', margin: '0 0 20px 0' }}>🔍 Find Schemes</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Search or browse government schemes that are available for you.
          </p>

          <input
            type="text"
            placeholder="Search for schemes (e.g., 'PM Kisan', 'health insurance')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 15px',
              border: '2px solid #ddd',
              borderRadius: '6px',
              fontSize: '1rem',
              marginBottom: '20px'
            }}
          />
        </div>

        {/* Category Filters */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '40px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: '10px 20px',
                background: filter === cat ? 'white' : 'rgba(255,255,255,0.2)',
                color: filter === cat ? '#667eea' : 'white',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s',
                fontSize: '0.95rem'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Scheme Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '30px',
          marginBottom: '40px'
        }}>
          {filtered.map((initiative, idx) => (
            <div
              key={initiative.id}
              onClick={() => setSelectedInitiative(initiative)}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '25px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: selectedInitiative?.id === initiative.id ? '0 10px 30px rgba(0,0,0,0.3)' : '0 5px 15px rgba(0,0,0,0.1)',
                transform: selectedInitiative?.id === initiative.id ? 'scale(1.02)' : 'scale(1)',
                borderLeft: `4px solid ${initiative.color}`,
                animation: `slideInUp 0.5s ease-out ${idx * 0.1}s both`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                <div style={{ fontSize: '2.5rem' }}>{initiative.icon}</div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleBookmark(initiative.id)
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer'
                  }}
                >
                  {bookmarked[initiative.id] ? '❤️' : '🤍'}
                </button>
              </div>

              <h3 style={{ color: '#333', margin: '0 0 10px 0', fontSize: '1.2rem' }}>
                {initiative.name}
              </h3>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <span style={{
                  background: initiative.color + '20',
                  color: initiative.color,
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: '500'
                }}>
                  {initiative.category}
                </span>
                <span style={{
                  background: '#10b98120',
                  color: '#10b981',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: '500'
                }}>
                  {initiative.status}
                </span>
              </div>

              <p style={{ color: '#666', margin: '0 0 15px 0', fontSize: '0.95rem', lineHeight: '1.6' }}>
                {initiative.description}
              </p>

              <div style={{
                borderTop: '1px solid #eee',
                paddingTop: '15px',
                fontSize: '0.9rem'
              }}>
                <div style={{ margin: '8px 0', color: '#666' }}>
                  <strong style={{ color: '#333' }}>Amount:</strong> {initiative.amount}
                </div>
                <div style={{ margin: '8px 0', color: '#666' }}>
                  <strong style={{ color: '#333' }}>Beneficiaries:</strong> {initiative.beneficiaries}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail Modal */}
        {selectedInitiative && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }} onClick={() => setSelectedInitiative(null)}>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '40px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              animation: 'scaleIn 0.3s ease-out'
            }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '1.8rem' }}>
                    {selectedInitiative.icon} {selectedInitiative.name}
                  </h2>
                  <p style={{ margin: 0, color: selectedInitiative.color, fontWeight: '600' }}>
                    {selectedInitiative.category}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedInitiative(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '20px 0' }} />

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#667eea', marginTop: 0 }}>Description</h3>
                <p style={{ color: '#666', lineHeight: '1.8' }}>{selectedInitiative.description}</p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#667eea' }}>Eligibility</h3>
                <p style={{ color: '#666', lineHeight: '1.8' }}>{selectedInitiative.eligibility}</p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#667eea' }}>Benefits</h3>
                <p style={{ color: '#666', lineHeight: '1.8' }}>{selectedInitiative.benefits}</p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '15px',
                marginBottom: '20px',
                background: '#f5f5f5',
                padding: '20px',
                borderRadius: '8px'
              }}>
                <div>
                  <strong style={{ color: '#333' }}>Benefit Amount</strong>
                  <p style={{ margin: '5px 0 0 0', color: selectedInitiative.color }}>{selectedInitiative.amount}</p>
                </div>
                <div>
                  <strong style={{ color: '#333' }}>Beneficiaries</strong>
                  <p style={{ margin: '5px 0 0 0', color: '#666' }}>{selectedInitiative.beneficiaries}</p>
                </div>
              </div>

              <a href={selectedInitiative.applyUrl} target="_blank" rel="noopener noreferrer" style={{display: 'block', width: '100%', textDecoration: 'none'}}>
                <button style={{
                  width: '100%',
                  padding: '12px 20px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                }} onMouseEnter={(e) => e.target.style.background = '#5568d3'} onMouseLeave={(e) => e.target.style.background = '#667eea'}>
                  Apply Now 🔗
                </button>
              </a>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
