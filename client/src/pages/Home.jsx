import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'

export default function Home({ user }){
  const { t } = useLanguage()

  return (
    <div>
      <div className="hero">
        <h1>{t('welcome')}</h1>
        <p>{t('subtitle')}</p>
        {!user && <Link to="/signup" className="btn btn-primary btn-large">{t('getStarted')}</Link>}
      </div>

      <h2 style={{marginBottom: 24}}>{t('services')}</h2>
      <div className="module-grid">
        <Link to="/civic" className="module-card">
          <div className="module-card-icon">🏛️</div>
          <h3>{t('civicTitle')}</h3>
          <p>{t('civicDesc')}</p>
        </Link>
        <Link to="/education" className="module-card">
          <div className="module-card-icon">📚</div>
          <h3>{t('learnTitle')}</h3>
          <p>{t('learnDesc')}</p>
        </Link>
        <Link to="/market" className="module-card">
          <div className="module-card-icon">💼</div>
          <h3>{t('marketTitle')}</h3>
          <p>{t('marketDesc')}</p>
        </Link>
        <Link to="/translate" className="module-card">
          <div className="module-card-icon">🌐</div>
          <h3>{t('translateTitle')}</h3>
          <p>{t('translateDesc')}</p>
        </Link>
      </div>

      <div className="card" style={{marginTop: 40}}>
        <h3>{t('whySahaay')}</h3>
        <ul style={{marginLeft: 20, color: '#6b7280', lineHeight: 2}}>
          <li>{t('why.unified')}</li>
          <li>{t('why.ai')}</li>
          <li>{t('why.voice')}</li>
          <li>{t('why.offline')}</li>
          <li>{t('why.design')}</li>
        </ul>
      </div>
    </div>
  )
}
