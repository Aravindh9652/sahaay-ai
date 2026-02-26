import React, { useState, useEffect } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

const courses = [
  { id: 1, title: 'Digital Skills 101', category: 'Tech', level: 'Beginner', duration: '2 hours', icon: '💻', color: '#3b82f6', enrolled: 1250, progress: 65, description: 'Master fundamental digital literacy', youtubeId: 'w67LX0akI3c' },
  { id: 2, title: 'Basic Accounting for Farmers', category: 'Business', level: 'Intermediate', duration: '3 hours', icon: '📊', color: '#10b981', enrolled: 890, progress: 0, description: 'Financial basics for agricultural entrepreneurs', youtubeId: 'V_qf1d5HUk4' },
  { id: 3, title: 'Online Safety & Privacy', category: 'Tech', level: 'Beginner', duration: '1.5 hours', icon: '🔒', color: '#f59e0b', enrolled: 2100, progress: 45, description: 'Protect yourself online with best practices', youtubeId: 'HaXuMVjbOeo' },
  { id: 4, title: 'Market Trends Analysis', category: 'Business', level: 'Advanced', duration: '4 hours', icon: '📈', color: '#8b5cf6', enrolled: 420, progress: 0, description: 'Analyze market data and make informed decisions', youtubeId: 'KRLzzRnkI5w' },
  { id: 5, title: 'Resume Writing', category: 'Career', level: 'Beginner', duration: '2 hours', icon: '📄', color: '#ef4444', enrolled: 1560, progress: 80, description: 'Create a winning professional resume', youtubeId: 'y8OnoxKU3U' },
  { id: 6, title: 'Interview Preparation', category: 'Career', level: 'Intermediate', duration: '3 hours', icon: '🎯', color: '#06b6d4', enrolled: 980, progress: 0, description: 'Ace your next job interview with confidence', youtubeId: 'X9XwYPaB_F4' },
  { id: 7, title: 'E-commerce Basics', category: 'Business', level: 'Beginner', duration: '2.5 hours', icon: '🛒', color: '#ec4899', enrolled: 750, progress: 30, description: 'Start your online business journey', youtubeId: '4DKTJj9CPHE' },
  { id: 8, title: 'Content Creation Masterclass', category: 'Tech', level: 'Intermediate', duration: '3.5 hours', icon: '📸', color: '#14b8a6', enrolled: 650, progress: 0, description: 'Create engaging content for social media', youtubeId: 'LWOdkI45cyc' }
]

export default function Education(){
  const { t } = useLanguage()
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [bookmarked, setBookmarked] = useState({})
  const [hoveredCard, setHoveredCard] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)

  const filtered = courses.filter(course => {
    const matchesFilter = filter === 'All' || course.category === filter
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) || 
                         course.description.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const toggleBookmark = (id) => {
    setBookmarked(b => ({...b, [id]: !b[id]}))
  }

  const getLevelColor = (level) => {
    switch(level) {
      case 'Beginner': return '#10b981'
      case 'Intermediate': return '#f59e0b'
      case 'Advanced': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const educationStyles = `
    @keyframes slideInDown {
      from {
        opacity: 0;
        transform: translateY(-30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-12px);
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `

  return (
    <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)', padding: '40px 20px', position: 'relative', overflow: 'hidden'}}>
      <style>{educationStyles}</style>

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

      <div style={{maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1}}>

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
            📚 {t('educationTitle') || 'Learning Hub'}
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: 'rgba(255,255,255,0.95)',
            textAlign: 'center',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: '1.8'
          }}>
            {t('educationSubtitle') || 'Develop your skills with our comprehensive course library'}
          </p>
        </div>

        {/* Search Bar */}
        <div style={{
          marginBottom: '40px',
          animation: 'slideInUp 0.6s ease-out 0.2s forwards',
          opacity: 0
        }}>
          <input
            type="text"
            placeholder="🔍 Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '500px',
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

        {/* Filter Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '40px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          animation: 'slideInUp 0.6s ease-out 0.3s forwards',
          opacity: 0
        }}>
          {['All', 'Tech', 'Business', 'Career'].map((category, idx) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              style={{
                padding: '11px 24px',
                borderRadius: '12px',
                border: '2px solid rgba(255,255,255,0.3)',
                background: filter === category
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'rgba(255,255,255,0.1)',
                color: 'white',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                backdropFilter: 'blur(10px)',
                boxShadow: filter === category ? '0 8px 25px rgba(102,126,234,0.4)' : 'none',
                willChange: 'transform, box-shadow'
              }}
              onMouseEnter={(e) => {
                if (filter !== category) {
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 8px 25px rgba(255,255,255,0.2)'
                  e.target.style.borderColor = 'rgba(255,255,255,0.5)'
                }
              }}
              onMouseLeave={(e) => {
                if (filter !== category) {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = 'none'
                  e.target.style.borderColor = 'rgba(255,255,255,0.3)'
                }
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          {filtered.map((course, index) => (
            <div
              key={course.id}
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
                setHoveredCard(course.id)
                e.currentTarget.style.transform = 'translateY(-8px)'
                e.currentTarget.style.boxShadow = '0 40px 80px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.6)'
                e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.3)'
              }}
              onMouseLeave={(e) => {
                setHoveredCard(null)
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
                background: `linear-gradient(90deg, ${course.color}, ${course.color}cc)`
              }}></div>

              {/* Header */}
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', marginTop: '8px'}}>
                <div style={{display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1}}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '14px',
                    background: `linear-gradient(135deg, ${course.color}20, ${course.color}10)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    flexShrink: 0,
                    animation: hoveredCard === course.id ? 'float 0.5s ease-out forwards' : 'none'
                  }}>
                    {course.icon}
                  </div>
                  <div style={{flex: 1}}>
                    <h3 style={{
                      margin: '0 0 8px 0',
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      color: '#1f2937',
                      lineHeight: '1.3'
                    }}>
                      {course.title}
                    </h3>
                    <span style={{
                      display: 'inline-block',
                      background: `linear-gradient(135deg, ${course.color}15, ${course.color}05)`,
                      color: course.color,
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      border: `1px solid ${course.color}30`
                    }}>
                      {course.category}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => toggleBookmark(course.id)}
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
                  {bookmarked[course.id] ? '❤️' : '🤍'}
                </button>
              </div>

              {/* Description */}
              <p style={{
                margin: '0 0 16px 0',
                color: '#6b7280',
                fontSize: '0.9rem',
                lineHeight: '1.5'
              }}>
                {course.description}
              </p>

              {/* Meta Info */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '16px',
                paddingBottom: '16px',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <div style={{display: 'flex', alignItems: 'center', gap: '4px', color: '#6b7280', fontSize: '0.85rem'}}>
                  <span>👥</span>
                  <span><strong>{course.enrolled}</strong> enrolled</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '4px', color: '#6b7280', fontSize: '0.85rem'}}>
                  <span>⏱️</span>
                  <span>{course.duration}</span>
                </div>
              </div>

              {/* Level & Progress */}
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
                <span style={{
                  color: getLevelColor(course.level),
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  background: `${getLevelColor(course.level)}15`,
                  padding: '4px 10px',
                  borderRadius: '6px'
                }}>
                  {course.level}
                </span>
                {course.progress > 0 && (
                  <span style={{
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: course.color
                  }}>
                    {course.progress}% complete
                  </span>
                )}
              </div>

              {/* Progress Bar */}
              {course.progress > 0 && (
                <div style={{
                  height: '4px',
                  background: '#e5e7eb',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    height: '100%',
                    background: `linear-gradient(90deg, ${course.color}, ${course.color}cc)`,
                    width: `${course.progress}%`,
                    transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: `0 0 10px ${course.color}60`
                  }}></div>
                </div>
              )}

              {/* CTA Button */}
              <button
                onClick={() => setSelectedCourse(course)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  background: `linear-gradient(135deg, ${course.color} 0%, ${course.color}dd 100%)`,
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: `0 8px 25px ${course.color}40`,
                  willChange: 'transform, box-shadow'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = `0 12px 35px ${course.color}60`
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = `0 8px 25px ${course.color}40`
                }}
              >
                {course.progress > 0 ? 'Continue Learning' : 'Start Learning'} ▶️
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
            <div style={{fontSize: '48px', marginBottom: '16px'}}>🤔</div>
            <h3 style={{color: 'white', fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px'}}>No courses found</h3>
            <p style={{color: 'rgba(255,255,255,0.9)'}}>Try adjusting your search or filters</p>
          </div>
        )}

        {/* Summary Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.95) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '32px',
          border: '1px solid rgba(102, 126, 234, 0.15)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
          animation: 'slideInUp 0.8s ease-out 0.5s forwards',
          opacity: 0,
          textAlign: 'center'
        }}>
          <h3 style={{
            margin: '0 0 12px 0',
            fontSize: '1.8rem',
            fontWeight: '700',
            color: '#1f2937'
          }}>
            🎯 Ready to upskill?
          </h3>
          <p style={{
            margin: 0,
            color: '#6b7280',
            fontSize: '1rem',
            lineHeight: '1.6'
          }}>
            Choose from {courses.length} courses and start your learning journey today. Each course is designed by industry experts to help you succeed.
          </p>
        </div>
      </div>

      {/* Video Modal */}
      {selectedCourse && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }} onClick={() => setSelectedCourse(null)}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '0',
            maxWidth: '900px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
            animation: 'scaleIn 0.3s ease-out',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={() => setSelectedCourse(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(0,0,0,0.5)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontSize: '24px',
                cursor: 'pointer',
                zIndex: 10,
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(0,0,0,0.8)'
                e.target.style.transform = 'scale(1.1)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(0,0,0,0.5)'
                e.target.style.transform = 'scale(1)'
              }}
            >
              ✕
            </button>

            {/* YouTube Video Container */}
            <div style={{
              width: '100%',
              paddingBottom: '56.25%',
              position: 'relative',
              background: '#000'
            }}>
              <iframe
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                src={`https://www.youtube.com/embed/${selectedCourse.youtubeId}?autoplay=1`}
                title={selectedCourse.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Course Info */}
            <div style={{ padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '12px',
                  background: `linear-gradient(135deg, ${selectedCourse.color}20, ${selectedCourse.color}10)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px'
                }}>
                  {selectedCourse.icon}
                </div>
                <div>
                  <h2 style={{ margin: '0 0 8px 0', fontSize: '1.8rem', fontWeight: '800', color: '#1f2937' }}>
                    {selectedCourse.title}
                  </h2>
                  <span style={{
                    display: 'inline-block',
                    background: `linear-gradient(135deg, ${selectedCourse.color}15, ${selectedCourse.color}05)`,
                    color: selectedCourse.color,
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: '600'
                  }}>
                    {selectedCourse.category} • {selectedCourse.level}
                  </span>
                </div>
              </div>

              <p style={{ margin: '0 0 20px 0', color: '#6b7280', fontSize: '1rem', lineHeight: '1.6' }}>
                {selectedCourse.description}
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '16px',
                marginBottom: '24px',
                padding: '20px',
                background: '#f9fafb',
                borderRadius: '12px'
              }}>
                <div>
                  <strong style={{ color: '#6b7280', fontSize: '0.85rem' }}>Duration</strong>
                  <p style={{ margin: '8px 0 0 0', fontSize: '1.1rem', fontWeight: '700', color: selectedCourse.color }}>
                    {selectedCourse.duration}
                  </p>
                </div>
                <div>
                  <strong style={{ color: '#6b7280', fontSize: '0.85rem' }}>Enrolled</strong>
                  <p style={{ margin: '8px 0 0 0', fontSize: '1.1rem', fontWeight: '700', color: selectedCourse.color }}>
                    {selectedCourse.enrolled}+ Students
                  </p>
                </div>
                <div>
                  <strong style={{ color: '#6b7280', fontSize: '0.85rem' }}>Level</strong>
                  <p style={{ margin: '8px 0 0 0', fontSize: '1.1rem', fontWeight: '700', color: selectedCourse.color }}>
                    {selectedCourse.level}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCourse(null)}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  background: `linear-gradient(135deg, ${selectedCourse.color} 0%, ${selectedCourse.color}dd 100%)`,
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: `0 8px 25px ${selectedCourse.color}40`
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = `0 12px 35px ${selectedCourse.color}60`
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = `0 8px 25px ${selectedCourse.color}40`
                }}
              >
                ✓ Start This Course Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
