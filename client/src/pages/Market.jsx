import React, {useState} from 'react'
import { useLanguage } from '../i18n/LanguageContext'

const opportunities = [
  {id: 1, title: 'Farmer Direct Market', icon: '🌾', desc: 'Connect directly with agriculture buyers', status: 'Active'},
  {id: 2, title: 'Artisan Marketplace', icon: '🎨', desc: 'Sell handicrafts & local products online', status: 'Active'},
  {id: 3, title: 'Micro-Finance Programs', icon: '💵', desc: 'Low-interest loans for small businesses', status: 'Active'},
  {id: 4, title: 'Job Board', icon: '💼', desc: 'Find local employment opportunities', status: 'Active'},
  {id: 5, title: 'Supply Chain Network', icon: '🚚', desc: 'Logistics & distribution services', status: 'Coming'},
  {id: 6, title: 'Price Trends Dashboard', icon: '📈', desc: 'Real-time market price information', status: 'Coming'}
]

export default function Market(){
  const { t } = useLanguage()
  const [bookmarks, setBookmarks] = useState({})

  const toggleBookmark = (id) => {
    setBookmarks(b => ({...b, [id]: !b[id]}))
  }

  return (
    <div>
      <div className="hero" style={{background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)'}}>
        <h1>{t('marketTitle')}</h1>
        <p>{t('marketSubtitle')}</p>
      </div>

      <h2 style={{marginBottom: 24}}>{t('opportunities')}</h2>
      <div className="card-grid">
        {opportunities.map(opp => (
          <div key={opp.id} className="card">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12}}>
              <div style={{fontSize: 40}}>{opp.icon}</div>
              <button onClick={() => toggleBookmark(opp.id)} style={{background: 'none', border: 'none', fontSize: 20, cursor: 'pointer'}}>
                {bookmarks[opp.id] ? '⭐' : '☆'}
              </button>
            </div>
            <h3>{opp.title}</h3>
            <p style={{color: '#6b7280', marginBottom: 12}}>{opp.desc}</p>
            <span style={{
              display: 'inline-block',
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
              background: opp.status === 'Active' ? '#d1fae5' : '#fef3c7',
              color: opp.status === 'Active' ? '#065f46' : '#92400e'
            }}>
              {opp.status}
            </span>
            {opp.status === 'Active' && <button className="btn btn-primary" style={{width: '100%', marginTop: 16}}>{t('learnMore')}</button>}
          </div>
        ))}
      </div>

      <div className="dashboard-grid" style={{marginTop: 32}}>
        <div className="dashboard-card">
          <h3>💰 {t('earnings')}</h3>
          <div style={{fontSize: 32, fontWeight: 700, color: '#10b981', marginTop: 12}}>₹15,240</div>
          <p style={{color: '#6b7280', fontSize: 14, marginTop: 8}}>{t('month')}</p>
        </div>
        <div className="dashboard-card">
          <h3>✓ {t('transactions')}</h3>
          <div style={{fontSize: 32, fontWeight: 700, color: '#0b5cff', marginTop: 12}}>24</div>
          <p style={{color: '#6b7280', fontSize: 14, marginTop: 8}}>Total success rate: 98%</p>
        </div>
        <div className="dashboard-card">
          <h3>🌟 {t('market.rating')}</h3>
          <div style={{fontSize: 28, marginTop: 12}}>⭐⭐⭐⭐⭐</div>
          <p style={{color: '#6b7280', fontSize: 14, marginTop: 8}}>4.8 from 45 reviews</p>
        </div>
      </div>
    </div>
  )
}
