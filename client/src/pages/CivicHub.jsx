import React, {useState, useEffect} from 'react'
import { useLanguage } from '../i18n/LanguageContext'

const civicTopics = [
  {id: 'schemes', icon: '💰', titleKey: 'civic.schemes', descKey: 'Government Schemes'},
  {id: 'health', icon: '🏥', titleKey: 'civic.health', descKey: 'Locate hospitals, clinics, and health programs'},
  {id: 'legal', icon: '⚖️', titleKey: 'civic.legal', descKey: 'Guidance on legal rights and procedures'},
  {id: 'emergency', icon: '🚨', titleKey: 'civic.emergency', descKey: 'Quick access to emergency contact numbers'}
]

export default function CivicHub(){
  const { t } = useLanguage()
  const [selected, setSelected] = useState(null)

  return (
    <div>
      <div className="hero" style={{background: 'linear-gradient(135deg, #10b981, #059669)'}}>
        <h1>{t('civicHub')}</h1>
        <p>{t('civicSubtitle')}</p>
      </div>

      <h2 style={{marginBottom: 24}}>{t('browse')}</h2>
      <div className="card-grid">
        {civicTopics.map(topic => (
          <div key={topic.id} className="card" onClick={() => setSelected(selected === topic.id ? null : topic.id)} style={{cursor: 'pointer'}}>
            <div style={{fontSize: 48, marginBottom: 12}}>{topic.icon}</div>
            <h3>{t(topic.titleKey)}</h3>
            <p>{topic.descKey}</p>
            {selected === topic.id && (
              <div style={{marginTop: 16, padding: 16, background: '#f3f4f6', borderRadius: 8}}>
                <h4 style={{marginBottom: 8}}>{t('howToAccess')}</h4>
                <ol style={{paddingLeft: 20, fontSize: 14, color: '#6b7280'}}>
                  <li>Visit the official government website</li>
                  <li>Check eligibility criteria</li>
                  <li>Prepare required documents</li>
                  <li>Submit application online or offline</li>
                </ol>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="card" style={{marginTop: 32}}>
        <h3>{t('faq')}</h3>
        <div style={{marginTop: 16}}>
          <div style={{marginBottom: 16}}>
            <h4>How do I apply for a government scheme?</h4>
            <p style={{color: '#6b7280', marginTop: 8}}>Most schemes require you to meet eligibility criteria, prepare documentation, and submit through official channels. We guide you step-by-step through the process.</p>
          </div>
          <div>
            <h4>What documents do I need?</h4>
            <p style={{color: '#6b7280', marginTop: 8}}>Required documents vary by scheme. Click on any service above to see specific requirements.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
