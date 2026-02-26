import React, { useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

const opportunities = [
  { id: 1, title: 'Junior Developer', company: 'TechStart India', status: 'Open', category: 'Jobs', salary: '₹3-5 LPA', location: 'Bangalore', deadline: 'Mar 15', views: 2450, description: 'Join our growing team as a Junior Developer', icon: '💻' },
  { id: 2, title: 'Content Writing Intern', company: 'Digital Solutions', status: 'Open', category: 'Internships', salary: 'Paid', location: 'Remote', deadline: 'Mar 10', views: 1820, description: 'Create engaging content for our blog', icon: '✍️' },
  { id: 3, title: 'Women Entrepreneurship Grant', company: 'Government of India', status: 'ClosingSoon', category: 'Grants', salary: '₹1-5 Lakhs', location: 'All India', deadline: 'Feb 28', views: 5200, description: 'Financial support for women entrepreneurs', icon: '💼' },
  { id: 4, title: 'Tech Scholarship 2026', company: 'IIT Alumni Network', status: 'Open', category: 'Scholarships', salary: 'Full Tuition', location: 'Various', deadline: 'Mar 20', views: 3150, description: 'Merit-based scholarship for tech education', icon: '🎓' },
  { id: 5, title: 'Digital Marketing Executive', company: 'eBay India', status: 'Open', category: 'Jobs', salary: '₹2.5-4 LPA', location: 'Delhi', deadline: 'Mar 25', views: 1950, description: 'Drive digital marketing campaigns', icon: '📱' },
  { id: 6, title: 'UI/UX Design Internship', company: 'Design Labs', status: 'Open', category: 'Internships', salary: '₹15k/month', location: 'Mumbai', deadline: 'Mar 12', views: 1340, description: 'Design beautiful user experiences', icon: '🎨' },
  { id: 7, title: 'Agriculture Tech Innovation Grant', company: 'AgriTech Foundation', status: 'ClosingSoon', category: 'Grants', salary: '₹2-10 Lakhs', location: 'Rural Areas', deadline: 'Feb 26', views: 890, description: 'Support for agricultural technology projects', icon: '🌾' },
  { id: 8, title: 'Data Science Scholarship', company: 'NASSCOM', status: 'Open', category: 'Scholarships', salary: 'Certification', location: 'Online', deadline: 'Mar 30', views: 4100, description: 'Industry-recognized data science certification', icon: '📊' }
]

export default function Market(){
  const { t } = useLanguage()
  const [filter, setFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [bookmarked, setBookmarked] = useState({})
  const [viewMode, setViewMode] = useState('grid')

  const filtered = opportunities.filter(opp => {
    const matchesStatus = filter === 'All' || opp.status === filter
    const matchesCategory = categoryFilter === 'All' || opp.category === categoryFilter
    const matchesSearch = opp.title.toLowerCase().includes(search.toLowerCase()) || 
                         opp.company.toLowerCase().includes(search.toLowerCase())
    return matchesStatus && matchesCategory && matchesSearch
  })

  const toggleBookmark = (id) => {
    setBookmarked(b => ({...b, [id]: !b[id]}))
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'Open': return '#10b981'
      case 'ClosingSoon': return '#f59e0b'
      case 'Closed': return '#6b7280'
      default: return '#667eea'
    }
  }

  const getCategoryIcon = (category) => {
    const icons = { 'Jobs': '💼', 'Internships': '👨‍💼', 'Grants': '💰', 'Scholarships': '🎓' }
    return icons[category] || '📌'
  }

  const marketStyles = `
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

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-12px); }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `

  return (
    <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)', padding: '40px 20px', position: 'relative', overflow: 'hidden'}}>
      <style>{marketStyles}</style>

      {/* Floating background elements */}
      <div style={{
        position: 'fixed',
        top: '10%',
        right: '5%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(240,147,251,0.3) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite',
        pointerEvents: 'none',
        zIndex: 0
      }}></div>
      <div style={{
        position: 'fixed',
        bottom: '10%',
        left: '5%',
        width: '250px',
        height: '250px',
        background: 'radial-gradient(circle, rgba(102,126,234,0.2) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite reverse',
        pointerEvents: 'none',
        zIndex: 0
      }}></div>

      <div style={{maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1}}>

        {/* Hero Section */}
        <div style={{
          animation: 'slideInDown 0.8s ease-out forwards',
          marginBottom: '40px'
        }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            🚀 {t('marketTitle') || 'Opportunities Hub'}
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: 'rgba(255,255,255,0.95)',
            textAlign: 'center',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: '1.8'
          }}>
            {t('marketSubtitle') || 'Discover jobs, internships, grants, and scholarships tailored for you'}
          </p>
        </div>

        {/* Search Bar */}
        <div style={{
          marginBottom: '32px',
          animation: 'slideInUp 0.6s ease-out 0.2s forwards',
          opacity: 0
        }}>
          <input
            type="text"
            placeholder="🔍 Search opportunities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '600px',
              display: 'block',
              margin: '0 auto',
              padding: '16px 20px',
              borderRadius: '16px',
              border: '2px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.95)',
              fontSize: '15px',
              fontWeight: '500',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#667eea'
              e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.15), 0 10px 30px rgba(0,0,0,0.1)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255,255,255,0.3)'
              e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)'
            }}
          />
        </div>

        {/* Filters Section */}
        <div style={{
          marginBottom: '40px',
          animation: 'slideInUp 0.6s ease-out 0.3s forwards',
          opacity: 0
        }}>
          {/* Status Filter */}
          <div style={{marginBottom: '20px'}}>
            <p style={{color: 'white', fontSize: '0.9rem', fontWeight: '600', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px'}}>📊 Status</p>
            <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
              {['All', 'Open', 'ClosingSoon'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  style={{
                    padding: '11px 20px',
                    borderRadius: '12px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    background: filter === status
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'rgba(255,255,255,0.1)',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: filter === status ? '0 8px 25px rgba(102,126,234,0.4)' : 'none',
                    willChange: 'transform, box-shadow'
                  }}
                  onMouseEnter={(e) => {
                    if (filter !== status) {
                      e.target.style.transform = 'translateY(-2px)'
                      e.target.style.boxShadow = '0 8px 25px rgba(255,255,255,0.2)'
                      e.target.style.borderColor = 'rgba(255,255,255,0.5)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (filter !== status) {
                      e.target.style.transform = 'translateY(0)'
                      e.target.style.boxShadow = 'none'
                      e.target.style.borderColor = 'rgba(255,255,255,0.3)'
                    }
                  }}
                >
                  {status === 'ClosingSoon' ? '⏰ Closing Soon' : status}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <p style={{color: 'white', fontSize: '0.9rem', fontWeight: '600', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px'}}>📁 Category</p>
            <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
              {['All', 'Jobs', 'Internships', 'Grants', 'Scholarships'].map((category) => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  style={{
                    padding: '11px 20px',
                    borderRadius: '12px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    background: categoryFilter === category
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'rgba(255,255,255,0.1)',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: categoryFilter === category ? '0 8px 25px rgba(102,126,234,0.4)' : 'none',
                    willChange: 'transform, box-shadow'
                  }}
                  onMouseEnter={(e) => {
                    if (categoryFilter !== category) {
                      e.target.style.transform = 'translateY(-2px)'
                      e.target.style.boxShadow = '0 8px 25px rgba(255,255,255,0.2)'
                      e.target.style.borderColor = 'rgba(255,255,255,0.5)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (categoryFilter !== category) {
                      e.target.style.transform = 'translateY(0)'
                      e.target.style.boxShadow = 'none'
                      e.target.style.borderColor = 'rgba(255,255,255,0.3)'
                    }
                  }}
                >
                  {getCategoryIcon(category)} {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Opportunities Grid */}
        <div style={{
          display: viewMode === 'grid' 
            ? 'grid'
            : 'block',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          {filtered.map((opp, index) => (
            <div
              key={opp.id}
              style={{
                animation: `scaleIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${0.1 * index}s forwards`,
                opacity: 0,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.95) 100%)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '24px',
                border: '1px solid rgba(102, 126, 234, 0.15)',
                boxShadow: '0 25px 50px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.6)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                willChange: 'transform, box-shadow, border-color'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)'
                e.currentTarget.style.boxShadow = '0 40px 80px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.6)'
                e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.6)'
                e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.15)'
              }}
            >
              {/* Top colored line */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(90deg, ${getStatusColor(opp.status)}, ${getStatusColor(opp.status)}cc)`
              }}></div>

              {/* Header */}
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', marginTop: '8px'}}>
                <div style={{display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1}}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #667eea15, #667eea05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    flexShrink: 0
                  }}>
                    {opp.icon}
                  </div>
                  <div style={{flex: 1}}>
                    <h3 style={{
                      margin: '0 0 8px 0',
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      color: '#1f2937',
                      lineHeight: '1.3'
                    }}>
                      {opp.title}
                    </h3>
                    <p style={{
                      margin: '0',
                      color: '#6b7280',
                      fontSize: '0.9rem'
                    }}>
                      {opp.company}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => toggleBookmark(opp.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '22px',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.2) rotate(10deg)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1) rotate(0deg)'
                  }}
                >
                  {bookmarked[opp.id] ? '❤️' : '🤍'}
                </button>
              </div>

              {/* Description */}
              <p style={{
                margin: '0 0 16px 0',
                color: '#6b7280',
                fontSize: '0.9rem',
                lineHeight: '1.5'
              }}>
                {opp.description}
              </p>

              {/* Meta Info */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px',
                paddingBottom: '16px',
                borderBottom: '1px solid #e5e7eb',
                fontSize: '0.85rem',
                color: '#6b7280'
              }}>
                <span>📍 {opp.location}</span>
                <span>•</span>
                <span>👁️ {opp.views} views</span>
              </div>

              {/* Status & Deadline */}
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
                <span style={{
                  color: getStatusColor(opp.status),
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  background: `${getStatusColor(opp.status)}15`,
                  padding: '4px 10px',
                  borderRadius: '6px'
                }}>
                  {opp.status === 'ClosingSoon' ? '⏰ ' : '✓ '}{opp.status}
                </span>
                <span style={{
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: '#667eea'
                }}>
                  Closes: {opp.deadline}
                </span>
              </div>

              {/* Salary/Prize */}
              <div style={{
                background: 'linear-gradient(135deg, #667eea15, #667eea05)',
                padding: '12px',
                borderRadius: '12px',
                marginBottom: '16px',
                textAlign: 'center'
              }}>
                <p style={{
                  margin: 0,
                  fontSize: '0.85rem',
                  color: '#6b7280',
                  fontWeight: '600',
                  marginBottom: '4px'
                }}>
                  Expected
                </p>
                <p style={{
                  margin: 0,
                  fontSize: '1.2rem',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  {opp.salary}
                </p>
              </div>

              {/* CTA Button */}
              <button
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 8px 25px rgba(102,126,234,0.4)',
                  willChange: 'transform, box-shadow'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 12px 35px rgba(102,126,234,0.6)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = '0 8px 25px rgba(102,126,234,0.4)'
                }}
              >
                Learn More & Apply →
              </button>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            animation: 'fadeIn 0.6s ease-out forwards'
          }}>
            <div style={{fontSize: '48px', marginBottom: '16px'}}>🔍</div>
            <h3 style={{color: 'white', fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px'}}>No opportunities found</h3>
            <p style={{color: 'rgba(255,255,255,0.9)'}}>Try adjusting your search or filters</p>
          </div>
        )}

        {/* Stats Summary */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.95) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '40px',
          border: '1px solid rgba(102, 126, 234, 0.15)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
          animation: 'slideInUp 0.8s ease-out 0.5s forwards',
          opacity: 0
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '32px',
            textAlign: 'center'
          }}>
            <div>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '8px'
              }}>
                {opportunities.length}
              </div>
              <p style={{margin: 0, color: '#6b7280', fontSize: '0.95rem'}}>Total Opportunities</p>
            </div>
            <div>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '8px'
              }}>
                {opportunities.filter(o => o.status === 'Open').length}
              </div>
              <p style={{margin: 0, color: '#6b7280', fontSize: '0.95rem'}}>Currently Open</p>
            </div>
            <div>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '8px'
              }}>
                {opportunities.reduce((sum, o) => sum + o.views, 0).toLocaleString()}
              </div>
              <p style={{margin: 0, color: '#6b7280', fontSize: '0.95rem'}}>Total Views</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
