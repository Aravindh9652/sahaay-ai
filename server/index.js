const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
const aiProvider = require('./services/aiProvider')

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => res.json({ ok: true, message: 'SAHAAY server running' }))

// Auth routes
app.use('/api/auth', require('./routes/auth'))

// AI route
app.post('/api/ai/query', async (req, res) => {
  const { query, provider, options } = req.body || {}
  if (!query) return res.status(400).json({ error: 'Missing query' })
  try {
    const r = await aiProvider.handleQuery({ query, provider, options })
    res.json({ ok: true, response: r })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'AI error' })
  }
})

// Translation route with comprehensive dictionary and API fallbacks
app.post('/api/translate/translate', async (req, res) => {
  const { text, target, source, useAI } = req.body
  if (!text || !target) return res.status(400).json({ error: 'Missing text or target language' })
  
  // Comprehensive translation dictionary
  const dictionary = {
    'hi': {
      'hello': 'नमस्ते', 'hi': 'नमस्ते', 'hey': 'अरे',
      'goodbye': 'अलविदा', 'bye': 'अलविदा',
      'thank you': 'धन्यवाद', 'thanks': 'धन्यवाद',
      'yes': 'हाँ', 'ok': 'ठीक है', 'okay': 'ठीक है',
      'no': 'नहीं', 'nope': 'नहीं',
      'good morning': 'सुप्रभात', 'morning': 'सुप्रभात',
      'good afternoon': 'नमस्ते', 'afternoon': 'दोपहर',
      'good evening': 'शुभ संध्या', 'evening': 'शाम',
      'good night': 'शुभ रात्रि', 'night': 'रात',
      'how are you': 'आप कैसे हैं', 'how': 'कैसे', 'are': 'हैं', 'you': 'आप',
      'i am fine': 'मैं ठीक हूँ', 'fine': 'ठीक',
      'good': 'अच्छा', 'bad': 'बुरा', 'love': 'प्यार',
      'water': 'पानी', 'food': 'खाना', 'help': 'मदद',
      'friend': 'दोस्त', 'family': 'परिवार', 'home': 'घर',
      'listen': 'सुनिए', 'speak': 'बोलिए', 'translate': 'अनुवाद करें'
    },
    'ta': {
      'hello': 'வணக்கம்', 'hi': 'வணக்கம்', 'hey': 'ஆய்',
      'goodbye': 'பிறகு சந்திப்போம்', 'bye': 'பிறகு சந்திப்போம்',
      'thank you': 'நன்றி', 'thanks': 'நன்றி',
      'yes': 'ஆம்', 'ok': 'சரி', 'okay': 'சரி',
      'no': 'இல்லை', 'nope': 'இல்லை',
      'good morning': 'காலைநலம்', 'morning': 'காலை',
      'good afternoon': 'பிற்பகல் வணக்கம்', 'afternoon': 'பிற்பகல்',
      'good evening': 'மாலை வணக்கம்', 'evening': 'மாலை',
      'good night': 'இரவு வணக்கம்', 'night': 'இரவு',
      'how are you': 'நீ எப்படி இருக்கிறாய்', 'how': 'எப்படி', 'are': 'இருக்கிறாய்', 'you': 'நீ',
      'i am fine': 'நான் நன்றாக இருக்கிறேன்', 'fine': 'நன்றாக',
      'good': 'நல்ல', 'bad': 'கெட்ட', 'love': 'அன்பு',
      'water': 'நீர்', 'food': 'உணவு', 'help': 'உதவி',
      'friend': 'நண்பன்', 'family': 'குடும்பம்', 'home': 'வீடு',
      'listen': 'கேளுங்கள்', 'speak': 'பேசுங்கள்', 'translate': 'மொழிபெயர்ப்பு செய்யுங்கள்'
    },
    'te': {
      'hello': 'హలో', 'hi': 'హలో', 'hey': 'ఓయ్',
      'goodbye': 'సరే', 'bye': 'దీక్ష',
      'thank you': 'ధన్యవాదాలు', 'thanks': 'ధన్యవాదాలు',
      'yes': 'అవును', 'ok': 'సరే', 'okay': 'సరే',
      'no': 'లేదు', 'nope': 'లేదు',
      'good morning': 'శుభోదయం', 'shubodayam': 'శుభోదయం', 'morning': 'ఉదయం',
      'good afternoon': 'శుభ మధ్యాహ్నం', 'afternoon': 'మధ్యాహ్నం',
      'good evening': 'శుభ సంధ్య', 'evening': 'సంధ్య',
      'good night': 'శుభ రాత్రి', 'night': 'రాత్రి',
      'how are you': 'మీరు ఎలా ఉన్నారు', 'how': 'ఎలా', 'are': 'ఉన్నారు', 'you': 'మీరు',
      'i am fine': 'నేను బాగున్నాను', 'fine': 'బాగు',
      'good': 'మంచి', 'bad': 'చెడ్డ', 'love': 'ప్రేమ',
      'water': 'నీరు', 'food': 'ఆహారం', 'help': 'సహాయం',
      'friend': 'స్నేహితుడు', 'family': 'కుటుంబం', 'home': 'ఇల్లు',
      'listen': 'వినండి', 'speak': 'మాట్లాడండి', 'translate': 'అనువాదం చేయండి'
    },
    'bn': {
      'hello': 'হ্যালো', 'hi': 'হ্যালো', 'hey': 'ওয়েই',
      'goodbye': 'বিদায়', 'bye': 'পুনরায় দেখা হবে',
      'thank you': 'ধন্যবাদ', 'thanks': 'ধন্যবাদ',
      'yes': 'হ্যাঁ', 'ok': 'ঠিক আছে', 'okay': 'ঠিক আছে',
      'no': 'না', 'nope': 'না',
      'good morning': 'শুভ সকাল', 'morning': 'সকাল',
      'good afternoon': 'শুভ অপরাহ্ন', 'afternoon': 'অপরাহ্ন',
      'good evening': 'শুভ সন্ধ্যা', 'evening': 'সন্ধ্যা',
      'good night': 'শুভ রাত্রি', 'night': 'রাত',
      'how are you': 'আপনি কেমন আছেন', 'how': 'কেমন', 'are': 'আছেন', 'you': 'আপনি',
      'i am fine': 'আমি ভালো আছি', 'fine': 'ভালো',
      'good': 'ভাল', 'bad': 'খারাপ', 'love': 'ভালোবাসা',
      'water': 'পানি', 'food': 'খাবার', 'help': 'সাহায্য',
      'friend': 'বন্ধু', 'family': 'পরিবার', 'home': 'বাড়ি',
      'listen': 'শুনুন', 'speak': 'কথা বলুন', 'translate': 'অনুবাদ করুন'
    }
  }
  
  try {
    const lowerText = text.toLowerCase().trim()
    console.log(`[Translation] Input: "${text}" (${lowerText}), Target: ${target}`)

    // Try exact match in dictionary first (works when user input is English keys)
    if (dictionary[target] && dictionary[target][lowerText]) {
      const result = dictionary[target][lowerText]
      console.log(`[Translation] Exact match found: "${result}"`)
      return res.json({ translated: result, language: target })
    }

    // Try partial dictionary match
    if (dictionary[target]) {
      for (let key in dictionary[target]) {
        if (lowerText.includes(key) || key.includes(lowerText)) {
          const result = dictionary[target][key]
          console.log(`[Translation] Partial match found: "${key}" -> "${result}"`)
          return res.json({ translated: result, language: target })
        }
      }
    }

    // Determine source(s) to try: either user-specified source, or detected + fallbacks
    const candidates = []
    if (source && source !== 'auto') {
      candidates.push(source)
    } else {
      // Heuristic: detect probable source language by Unicode script ranges
      const detectScript = (s) => {
        if (/[\u0900-\u097F]/.test(s)) return 'hi'   // Devanagari
        if (/[\u0B80-\u0BFF]/.test(s)) return 'ta'   // Tamil
        if (/[\u0C00-\u0C7F]/.test(s)) return 'te'   // Telugu
        if (/[\u0980-\u09FF]/.test(s)) return 'bn'   // Bengali
        return null
      }

      const probable = detectScript(text)
      if (probable) candidates.push(probable)
      // add common source languages as fallbacks
      ['te','hi','ta','bn','en'].forEach(l => { if (!candidates.includes(l)) candidates.push(l) })
    }

    console.log('[Translation] Source candidates:', candidates)

    // Try MyMemory API with the candidate source languages (best-effort free fallback)
    for (let src of candidates) {
      try {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${src}|${target}`
        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          if (data && data.responseStatus === 200 && data.responseData && data.responseData.translatedText) {
            const translated = data.responseData.translatedText.trim()
            if (translated && translated.length > 0 && translated.toLowerCase() !== lowerText) {
              console.log(`[Translation] MyMemory (${src}->${target}) -> "${translated}"`)
              return res.json({ translated, language: target, detected: src, provider: 'mymemory' })
            }
          }
        }
      } catch (apiErr) {
        console.log(`[Translation] MyMemory ${src}->${target} failed:`, apiErr.message)
      }
    }

    // If user requested AI translation (or as a fallback when configured), use OpenAI
    if (useAI) {
      if (!process.env.OPENAI_API_KEY) {
        console.log('[Translation] useAI requested but OPENAI_API_KEY not set')
      } else {
        try {
          let prompt
          if (source && source !== 'auto') {
            prompt = `Translate the following text from language code ${source} to language code ${target}. Respond with only the translated text.\n\nText: "${text}"`
          } else {
            prompt = `Detect the source language and translate the following text into language code ${target}. Respond with only the translated text.\n\nText: "${text}"`
          }
          const aiResp = await aiProvider.handleQuery({ query: prompt, provider: 'openai', options: { model: process.env.OPENAI_MODEL } })
          if (aiResp && aiResp.answer) {
            const aiTranslated = aiResp.answer.trim()
            console.log('[Translation] OpenAI translation ->', aiTranslated)
            return res.json({ translated: aiTranslated, language: target, detected: source || 'auto', provider: 'openai' })
          }
        } catch (aiErr) {
          console.log('[Translation] OpenAI failed:', aiErr.message)
        }
      }
    }

    // Final fallback - return the original text
    console.log(`[Translation] All methods failed, returning original text`)
    return res.json({ translated: text, language: target })

  } catch (err) {
    console.error('[Translation] Endpoint error:', err.message)
    res.json({ translated: text, language: target })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server listening on ${PORT}`))
