import React, { useState, useEffect } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

// Multi-type resources database with coordinates
const allResources = [
  { id: 1, type: 'Book', title: 'Digital India Handbook', author: 'Ministry of IT', icon: '📱', color: '#3b82f6', location: 'New Delhi', lat: 28.6139, lng: 77.2090, description: 'Digital transformation guide' },
  { id: 2, type: 'Library', title: 'National Central Library', author: 'Government', icon: '📚', color: '#8b5cf6', location: 'New Delhi', lat: 28.6139, lng: 77.2090, hours: '10 AM - 8 PM', description: '2 million books collection' },
  { id: 3, type: 'Learning Center', title: 'IIT Delhi', author: 'Government', icon: '🎓', color: '#3b82f6', location: 'Delhi', lat: 28.5494, lng: 77.1914, courses: 156, description: 'Premier engineering institute' },
  { id: 4, type: 'Online Platform', title: 'NPTEL - Free Courses', author: 'IIT Madras', icon: '💻', color: '#667eea', location: 'Online', lat: 13.0033, lng: 80.2565, courses: 14000, description: '14000+ engineering courses' },
  { id: 5, type: 'Library', title: 'Agricultural Research Library', author: 'ICAR', icon: '🌾', color: '#10b981', location: 'Bangalore', lat: 12.9716, lng: 77.5946, hours: '9 AM - 5 PM', description: 'Agricultural research resources' },
  { id: 6, type: 'Learning Center', title: 'Skill India Training', author: 'Government', icon: '🛠️', color: '#f59e0b', location: 'Bangalore', lat: 12.9716, lng: 77.5946, courses: 89, description: 'Vocational skill training' },
  { id: 7, type: 'Library', title: 'Pune Library - Bhandarkar', author: 'Government', icon: '📚', color: '#8b5cf6', location: 'Pune', lat: 18.5204, lng: 73.8567, hours: '9 AM - 5:30 PM', description: 'Rare books & manuscripts' },
  { id: 8, type: 'Study Group Center', title: 'Anna Centenary Library', author: 'Government', icon: '👥', color: '#14b8a6', location: 'Chennai', lat: 13.0499, lng: 80.2624, hours: '9 AM - 9 PM', description: 'Public study & research' },
  { id: 9, type: 'Online Platform', title: 'Khan Academy India', author: 'Khan Academy', icon: '📱', color: '#06b6d4', location: 'Online', lat: 28.6139, lng: 77.2090, description: 'Free educational videos' },
  { id: 10, type: 'Learning Center', title: 'Mumbai Business Institute', author: 'Private', icon: '🏢', color: '#8b5cf6', location: 'Mumbai', lat: 19.0760, lng: 72.8777, courses: 42, description: 'Business education' },
  { id: 11, type: 'Government Scheme', title: 'PM Skill Development', author: 'Government', icon: '🏛️', color: '#ef4444', location: 'Pan India', lat: 28.6139, lng: 77.2090, description: 'Free skill training' },
  { id: 12, type: 'Library', title: 'Cochin Public Library', author: 'Municipal', icon: '📚', color: '#22c55e', location: 'Kochi', lat: 9.9312, lng: 76.2673, hours: '10 AM - 8 PM', description: 'Ancient & digital resources' },
  { id: 13, type: 'Learning Center', title: 'Hyderabad University', author: 'Government', icon: '📚', color: '#667eea', location: 'Hyderabad', lat: 17.3850, lng: 78.4867, courses: 210, description: 'University library' },
  { id: 14, type: 'Online Platform', title: 'Coursera for Development', author: 'Coursera', icon: '🌐', color: '#667eea', location: 'Online', lat: 28.6139, lng: 77.2090, courses: 5000, description: 'Online courses' },
  { id: 15, type: 'Study Group Center', title: 'Bangalore Tech Community', author: 'Community', icon: '👥', color: '#667eea', location: 'Bangalore', lat: 12.9716, lng: 77.5946, hours: '6 PM - 9 PM', description: 'Tech study groups' },
]

const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c * 10) / 10
}

export default function Resources() {
  const { t } = useLanguage()
  const [userLocation, setUserLocation] = useState(null)
  const [filteredResources, setFilteredResources] = useState(allResources)
  const [selectedResource, setSelectedResource] = useState(null)
  const [typeFilter, setTypeFilter] = useState('All')
  const [radiusFilter, setRadiusFilter] = useState(100)
  const [loading, setLoading] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [bookmarked, setBookmarked] = useState({})

  const requestLocation = () => {
    setLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude })
          setLoading(false)
          setShowMap(false)  // Show list view with nearby resources first
        },
        () => {
          alert('Unable to access location. Please enable location services.')
          setLoading(false)
        }
      )
    } else {
      alert('Geolocation not supported.')
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = allResources
    if (typeFilter !== 'All') {
      filtered = filtered.filter(r => r.type === typeFilter)
    }
    if (userLocation) {
      filtered = filtered.map(r => ({
        ...r,
        distance: calculateDistance(userLocation.lat, userLocation.lng, r.lat, r.lng)
      }))
      filtered = filtered.filter(r => r.distance <= radiusFilter || r.location === 'Online')
      filtered.sort((a, b) => {
        if (a.location === 'Online' && b.location !== 'Online') return 1
        if (a.location !== 'Online' && b.location === 'Online') return -1
        return (a.distance || 999999) - (b.distance || 999999)
      })
    }
    setFilteredResources(filtered)
  }, [userLocation, typeFilter, radiusFilter])

  const resourceTypes = ['All', 'Book', 'Library', 'Learning Center', 'Online Platform', 'Government Scheme', 'Study Group Center']

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1f2937 0%, #111827 50%, #0f172a 100%)',
      minHeight: 'calc(100vh - 80px)',
      padding: '40px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <style>{`@keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }@keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ animation: 'slideDown 0.6s ease-out', marginBottom: '40px' }}>
          <h1 style={{ color: 'white', fontSize: '3rem', fontWeight: '900', margin: '0 0 20px 0' }}>
            📍 Find Nearby Resources
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '1rem', margin: 0 }}>
            Share your location to discover books, libraries, learning centers & educational platforms near you
          </p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(102, 126, 234, 0.3)',
          marginBottom: '32px',
          animation: 'slideDown 0.6s ease-out 0.1s forwards',
          opacity: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ margin: '0 0 8px 0', color: 'white', fontSize: '1.3rem', fontWeight: '700' }}>
                📍 Enable Location Detection
              </h2>
              <p style={{ margin: 0, color: '#d1d5db' }}>
                {userLocation 
                  ? `✓ Location detected. Showing resources within ${radiusFilter}km` 
                  : 'Click below to find resources near your location'}
              </p>
            </div>
            {!userLocation ? (
              <button
                onClick={requestLocation}
                disabled={loading}
                style={{
                  padding: '12px 28px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontWeight: '700',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  whiteSpace: 'nowrap'
                }}
              >
                {loading ? '⏳ Detecting...' : '🎯 Use My Location'}
              </button>
            ) : (
              <button
                onClick={() => setUserLocation(null)}
                style={{
                  padding: '12px 28px',
                  borderRadius: '10px',
                  border: '2px solid #667eea',
                  background: 'transparent',
                  color: '#667eea',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                ✕ Clear Location
              </button>
            )}
          </div>
        </div>

        {userLocation && (
          <div style={{
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255,255,255,0.1)',
            marginBottom: '32px'
          }}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ color: 'white', fontWeight: '600', fontSize: '0.9rem', display: 'block', marginBottom: '12px' }}>
                📏 Search Radius: {radiusFilter} km
              </label>
              <input
                type="range"
                min="5"
                max="200"
                value={radiusFilter}
                onChange={(e) => setRadiusFilter(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  height: '6px',
                  borderRadius: '3px',
                  background: 'rgba(255,255,255,0.2)',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              />
            </div>

            <div>
              <p style={{ color: 'white', fontWeight: '600', fontSize: '0.9rem', margin: '0 0 12px 0' }}>
                🏷️ Filter by Type
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {resourceTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: typeFilter === type ? '2px solid #667eea' : '1px solid rgba(255,255,255,0.3)',
                      background: typeFilter === type ? 'rgba(102,126,234,0.3)' : 'transparent',
                      color: 'white',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {userLocation && (
          <div style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setShowMap(false)}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: '2px solid' + (showMap ? ' rgba(255,255,255,0.3)' : ' #667eea'),
                background: showMap ? 'transparent' : 'rgba(102,126,234,0.2)',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              📋 List View
            </button>
            <button
              onClick={() => setShowMap(true)}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: '2px solid' + (!showMap ? ' rgba(255,255,255,0.3)' : ' #667eea'),
                background: !showMap ? 'transparent' : 'rgba(102,126,234,0.2)',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              🗺️ Map View
            </button>
          </div>
        )}

        {userLocation && showMap && (
          <div style={{
            marginBottom: '32px',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(102,126,234,0.3)',
            animation: 'scaleIn 0.4s ease-out'
          }}>
            <div style={{ width: '100%', height: '500px' }}>
              {/* Google Maps iframe - API key removed for security. Use environment variable or secure config. */}
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${userLocation.lat},${userLocation.lng}&zoom=12`}
                style={{ border: 0 }}
              ></iframe>
            </div>
          </div>
        )}

        <div style={{
          display: showMap ? 'none' : 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {filteredResources.map((resource, index) => (
            <div
              key={resource.id}
              style={{
                animation: `scaleIn 0.5s ease-out ${0.08 * index}s forwards`,
                opacity: 0,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.95) 100%)',
                backdropFilter: 'blur(20px)',
                borderRadius: '14px',
                padding: '20px',
                border: '1px solid rgba(102,126,234,0.15)',
                boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
                cursor: 'pointer',
                transition: 'all 0.4s',
                position: 'relative'
              }}
              onClick={() => setSelectedResource(resource)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)'
                e.currentTarget.style.boxShadow = '0 45px 90px rgba(0,0,0,0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.15)'
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setBookmarked(b => ({...b, [resource.id]: !b[resource.id]}))
                }}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer'
                }}
              >
                {bookmarked[resource.id] ? '❤️' : '🤍'}
              </button>

              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '10px',
                background: resource.color + '20',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                marginBottom: '12px'
              }}>
                {resource.icon}
              </div>

              <h3 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', fontWeight: '700', color: '#1f2937' }}>
                {resource.title}
              </h3>
              <p style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: '#667eea', fontWeight: '600' }}>
                {resource.type} • {resource.author}
              </p>
              <p style={{ margin: '0 0 12px 0', fontSize: '0.8rem', color: '#6b7280', lineHeight: '1.4' }}>
                {resource.description}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
                {resource.location !== 'Online' && resource.distance ? (
                  <span style={{ color: '#667eea', fontWeight: '600', fontSize: '0.9rem' }}>
                    📍 {resource.distance} km
                  </span>
                ) : (
                  <span style={{ color: '#667eea', fontWeight: '600', fontSize: '0.9rem' }}>
                    🌐 Online
                  </span>
                )}
                <span style={{
                  background: resource.color + '15',
                  color: resource.color,
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  {resource.type}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredResources.length === 0 && userLocation && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '12px' }}>No resources found</p>
            <p>Try adjusting your search radius or filters</p>
          </div>
        )}
      </div>

      {selectedResource && (
        <div
          style={{
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
          }}
          onClick={() => setSelectedResource(null)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '40px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '85vh',
              overflow: 'auto',
              boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
              animation: 'scaleIn 0.3s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedResource(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(102,126,234,0.1)',
                color: '#667eea',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontSize: '20px',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' }}>
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '12px',
                background: selectedResource.color + '20',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
                flexShrink: 0
              }}>
                {selectedResource.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '1.6rem', fontWeight: '800', color: '#1f2937' }}>
                  {selectedResource.title}
                </h2>
                <p style={{ margin: '4px 0', color: '#667eea', fontWeight: '600' }}>
                  {selectedResource.type}
                </p>
                <p style={{ margin: '4px 0', color: '#6b7280', fontSize: '0.9rem' }}>
                  {selectedResource.author}
                </p>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '20px 0' }} />

            <p style={{ color: '#6b7280', lineHeight: '1.8', marginBottom: '20px' }}>
              {selectedResource.description}
            </p>

            <div style={{
              background: '#f9fafb',
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '20px',
              borderLeft: `4px solid ${selectedResource.color}`
            }}>
              <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#6b7280', fontWeight: '600' }}>
                📍 Location
              </p>
              <p style={{ margin: '0', fontSize: '1.1rem', fontWeight: '700', color: '#1f2937' }}>
                {selectedResource.location}
              </p>
              {selectedResource.distance && (
                <p style={{  margin: '8px 0 0 0', color: '#667eea', fontWeight: '600' }}>
                  Distance: {selectedResource.distance} km away
                </p>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '20px' }}>
              {selectedResource.hours && (
                <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '8px' }}>
                  <p style={{ margin: '0 0 4px 0', fontSize: '0.8rem', color: '#6b7280' }}>🕐 Hours</p>
                  <p style={{ margin: 0, fontWeight: '700', color: '#1f2937' }}>{selectedResource.hours}</p>
                </div>
              )}
              {selectedResource.courses && (
                <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '8px' }}>
                  <p style={{ margin: '0 0 4px 0', fontSize: '0.8rem', color: '#6b7280' }}>📖 Courses</p>
                  <p style={{ margin: 0, fontWeight: '700', color: '#667eea' }}>{selectedResource.courses}+</p>
                </div>
              )}
            </div>

            {selectedResource.location !== 'Online' && (
              <div style={{ marginBottom: '20px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                <div style={{ width: '100%', height: '250px' }}>
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDYWN_3CeD3t1d6tPF5W5v9Z8_K8pV_U4w&q=${encodeURIComponent(selectedResource.location)}&zoom=14`}
                    style={{ border: 0 }}
                  ></iframe>
                </div>
                <a
                  href={`https://www.google.com/maps/?q=${encodeURIComponent(selectedResource.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    marginTop: '12px',
                    color: '#667eea',
                    textDecoration: 'none',
                    fontWeight: '600',
                    padding: '8px 12px',
                    background: '#667eea15',
                    borderRadius: '6px'
                  }}
                >
                  🗺️ View on Google Maps
                </a>
              </div>
            )}

            <button
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              ✓ Save for Later
            </button>
          </div>
        </div>
      )}
    </div>
  )
}