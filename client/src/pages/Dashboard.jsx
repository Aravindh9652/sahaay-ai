import React, { useEffect, useMemo, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import './Dashboard.css'

const themes = [
  {
    pageBg: 'linear-gradient(135deg, #eef2ff 0%, #ede9fe 55%, #fdf2f8 100%)',
    cardBg: 'rgba(255,255,255,0.92)',
    border: 'rgba(99,102,241,0.25)',
    heading: '#312e81',
    text: '#334155',
    muted: '#64748b',
    accent: '#4f46e5',
    accentSoft: 'rgba(79,70,229,0.12)'
  },
  {
    pageBg: 'linear-gradient(135deg, #ecfeff 0%, #f0fdfa 55%, #ecfccb 100%)',
    cardBg: 'rgba(255,255,255,0.92)',
    border: 'rgba(13,148,136,0.25)',
    heading: '#115e59',
    text: '#1f2937',
    muted: '#4b5563',
    accent: '#0d9488',
    accentSoft: 'rgba(13,148,136,0.12)'
  },
  {
    pageBg: 'linear-gradient(135deg, #fff7ed 0%, #fef3c7 55%, #fde68a 100%)',
    cardBg: 'rgba(255,255,255,0.92)',
    border: 'rgba(234,88,12,0.25)',
    heading: '#9a3412',
    text: '#1f2937',
    muted: '#525252',
    accent: '#ea580c',
    accentSoft: 'rgba(234,88,12,0.12)'
  }
]

const marketItems = [
  { id: 1, title: 'Junior Developer' },
  { id: 2, title: 'Content Writing Intern' },
  { id: 3, title: 'Women Entrepreneurship Expo' },
  { id: 4, title: 'Tech Education Grant' },
  { id: 5, title: 'Digital Marketing Executive' },
  { id: 6, title: 'UI/UX Design Internship' },
  { id: 7, title: 'Agriculture Startup Support' },
  { id: 8, title: 'Data Science Program' }
]

const educationItems = [
  { id: 1, title: 'Digital Skills 101' },
  { id: 2, title: 'Basic Accounting for Farmers' },
  { id: 3, title: 'Safety & Privacy' },
  { id: 4, title: 'Market Trends Analysis' },
  { id: 5, title: 'Resume Writing' },
  { id: 6, title: 'Interview Preparation' },
  { id: 7, title: 'E-commerce Basics' },
  { id: 8, title: 'Content Creation Masterclass' }
]

const civicItems = [
  { id: 1, title: 'PM Kisan Samman Nidhi' },
  { id: 2, title: 'Ayushman Bharat' },
  { id: 3, title: 'Skill India' },
  { id: 4, title: 'Swachh Bharat' },
  { id: 5, title: 'Startup India' },
  { id: 6, title: 'Digital India' }
]

const toLookup = (items) => items.reduce((acc, item) => ({ ...acc, [item.id]: item.title }), {})
const marketLookup = toLookup(marketItems)
const educationLookup = toLookup(educationItems)
const civicLookup = toLookup(civicItems)

export default function Dashboard({ user }) {
  const { t } = useLanguage()

  const [profile, setProfile] = useState(null)
  const [progress, setProgress] = useState(null)
  const [bookmarks, setBookmarks] = useState(null)
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [themeIndex, setThemeIndex] = useState(0)

  const [form, setForm] = useState({
    name: '',
    phone: '',
    location: '',
    language: 'en',
    bio: '',
    skills: '',
    interests: ''
  })

  useEffect(() => {
    fetchUserData()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setThemeIndex((prev) => (prev + 1) % themes.length)
    }, 7000)
    return () => clearInterval(timer)
  }, [])

  const fetchUserData = async () => {
    try {
      const headers = { Authorization: `Bearer ${user.token}` }
      const [profileRes, progressRes, bookmarksRes, activityRes] = await Promise.all([
        fetch('/api/auth/profile', { headers }),
        fetch('/api/auth/progress', { headers }),
        fetch('/api/auth/bookmarks', { headers }),
        fetch('/api/auth/activity', { headers })
      ])

      const [profileData, progressData, bookmarksData, activityData] = await Promise.all([
        profileRes.json(),
        progressRes.json(),
        bookmarksRes.json(),
        activityRes.json()
      ])

      if (profileData.profile) {
        setProfile(profileData.profile)
        setForm({
          name: profileData.profile.name || user?.name || '',
          phone: profileData.profile.phone || '',
          location: profileData.profile.location || '',
          language: profileData.profile.language || 'en',
          bio: profileData.profile.bio || '',
          skills: (profileData.profile.skills || []).join(', '),
          interests: (profileData.profile.interests || []).join(', ')
        })
      }

      if (progressData.progress) setProgress(progressData.progress)
      if (bookmarksData.bookmarks) setBookmarks(bookmarksData.bookmarks)
      if (activityData.activity) setActivity(activityData.activity)
    } catch (error) {
      setSaveMessage('Failed to load dashboard data')
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const stats = useMemo(() => {
    const courseCount =
      Object.keys(progress?.education || {}).length +
      Object.keys(progress?.market || {}).length +
      Object.keys(progress?.civic || {}).length

    const bookmarkCount =
      (bookmarks?.market?.length || 0) +
      (bookmarks?.education?.length || 0) +
      (bookmarks?.civic?.length || 0)

    return {
      courses: courseCount,
      bookmarks: bookmarkCount,
      activity: activity.length
    }
  }, [progress, bookmarks, activity])

  const likedReels = useMemo(() => {
    const ids = bookmarks?.market || []
    return ids.map((id) => marketLookup[Number(id)] || `Market Item #${id}`)
  }, [bookmarks])

  const likedCourses = useMemo(() => {
    const ids = bookmarks?.education || []
    return ids.map((id) => educationLookup[Number(id)] || `Course #${id}`)
  }, [bookmarks])

  const likedSchemes = useMemo(() => {
    const ids = bookmarks?.civic || []
    return ids.map((id) => civicLookup[Number(id)] || `Scheme #${id}`)
  }, [bookmarks])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async (event) => {
    event.preventDefault()
    setSaving(true)
    setSaveMessage('')

    try {
      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        location: form.location.trim(),
        language: form.language,
        bio: form.bio.trim(),
        skills: form.skills
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        interests: form.interests
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      }

      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()
      if (!response.ok || !result.profile) {
        throw new Error(result.error || 'Failed to save profile')
      }

      setProfile(result.profile)
      setSaveMessage('Profile updated successfully')
    } catch (error) {
      setSaveMessage(error.message || 'Could not save profile')
      console.error('Profile update error:', error)
    } finally {
      setSaving(false)
    }
  }

  const theme = themes[themeIndex]

  const rootStyle = {
    '--db-page-bg': theme.pageBg,
    '--db-card-bg': theme.cardBg,
    '--db-border': theme.border,
    '--db-heading': theme.heading,
    '--db-text': theme.text,
    '--db-muted': theme.muted,
    '--db-accent': theme.accent,
    '--db-accent-soft': theme.accentSoft
  }

  if (loading) {
    return (
      <div className="dashboard-shell" style={rootStyle}>
        <div className="dashboard-loading">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="dashboard-shell" style={rootStyle}>
      <div className="dashboard-container">
        <section className="dashboard-card dashboard-hero">
          <h1>
            {t('dashboardWelcome') || 'Welcome'}, {profile?.name || user?.name || user?.email}
          </h1>
          <p>{t('dashboardActivity') || 'Your account overview and editable details'}</p>
        </section>

        <section className="dashboard-stats">
          {[
            { label: 'Courses', value: stats.courses },
            { label: 'Saved Items', value: stats.bookmarks },
            { label: 'Recent Activity', value: stats.activity }
          ].map((item) => (
            <article className="dashboard-card dashboard-stat-card" key={item.label}>
              <p>{item.label}</p>
              <h3>{item.value}</h3>
            </article>
          ))}
        </section>

        <section className="dashboard-card">
          <h2>Editable Details</h2>
          <form onSubmit={handleSave} className="dashboard-form">
            <div className="dashboard-form-grid">
              <label>
                Full Name
                <input name="name" value={form.name} onChange={handleChange} />
              </label>

              <label>
                Phone
                <input name="phone" value={form.phone} onChange={handleChange} />
              </label>

              <label>
                Location
                <input name="location" value={form.location} onChange={handleChange} />
              </label>

              <label>
                Preferred Language
                <select name="language" value={form.language} onChange={handleChange}>
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="te">Telugu</option>
                  <option value="ta">Tamil</option>
                </select>
              </label>  
            </div>

            <label>
              Bio
              <textarea name="bio" rows={3} value={form.bio} onChange={handleChange} />
            </label>

            <label>
              Skills (comma-separated)
              <input
                name="skills"
                value={form.skills}
                onChange={handleChange}
                placeholder="digital marketing, accounting, coding"
              />
            </label>

            <label>
              Interests (comma-separated)
              <input
                name="interests"
                value={form.interests}
                onChange={handleChange}
                placeholder="farming, business, AI"
              />
            </label>

            <div className="dashboard-actions">
              <button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Details'}
              </button>
              <span className={saveMessage.includes('success') ? 'msg-success' : 'msg-error'}>{saveMessage}</span>
            </div>
          </form>
        </section>

        
        
      </div>
    </div>
  )
}
