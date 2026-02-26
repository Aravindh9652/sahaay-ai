/**
 * AWS Bedrock Client
 * Handles invocation of Claude 3 Haiku model for generative AI responses
 * Supports multilingual queries for government scheme assistance
 */

const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime')

// Initialize Bedrock runtime client (AWS SDK v3)
// Credentials come from environment variables or IAM role
const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1'
})

/**
 * Invoke Claude 3 Haiku model via Bedrock
 * @param {string} prompt - User query or system prompt
 * @param {Object} options - Model options (temperature, max_tokens, etc.)
 * @returns {Promise<string>} - Generated response text
 */
async function invokeBedrockModel(prompt, options = {}) {
  try {
    const {
      temperature = 0.7,
      maxTokens = 1024,
      modelId = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-haiku-20240307-v1:0'
    } = options

    // Construct the request payload for Claude 3 model
    const requestBody = {
      anthropic_version: 'bedrock-2023-06-01',
      max_tokens: maxTokens,
      temperature: temperature,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    }

    // Invoke the Bedrock model
    const command = new InvokeModelCommand({
      modelId: modelId,
      body: JSON.stringify(requestBody),
      contentType: 'application/json',
      accept: 'application/json'
    })

    console.log(`[Bedrock] Invoking model: ${modelId}`)
    const response = await bedrockClient.send(command)

    // Parse the response
    const responseBody = JSON.parse(new TextDecoder().decode(response.body))
    const generatedText = responseBody.content?.[0]?.text || ''

    console.log(`[Bedrock] Response received (${generatedText.length} chars)`)
    return generatedText

  } catch (error) {
    console.error('[Bedrock] Error invoking model:', error.message)
    throw new Error(`Bedrock invocation failed: ${error.message}`)
  }
}

/**
 * Generate context-aware government scheme explanation
 * @param {string} query - User query about schemes
 * @param {string} context - Retrieved scheme information from S3/DynamoDB
 * @returns {Promise<string>} - Generated explanation with steps
 */
async function generateSchemeExplanation(query, context) {
  const systemPrompt = `You are SAHAAY, a multilingual AI assistant helping Indian citizens understand government schemes.

Your task: Explain government schemes clearly, provide eligibility criteria, and step-by-step application guidance.

Context about the scheme:
${context}

Now answer the user's question about the scheme. Be helpful, clear, and action-oriented.`

  return invokeBedrockModel(systemPrompt)
}

/**
 * Recognize user intent from query (understanding what they're looking for)
 * @param {string} query - User's input question
 * @returns {Promise<Object>} - Intent classification: {intent, keywords, language}
 */
async function recognizeIntent(query) {
  const prompt = `Analyze this user query and classify the intent. Respond with JSON only.

Query: "${query}"

Response format (JSON only):
{
  "intent": "one of: scheme_search, eligibility_check, application_help, general_info, complaint",
  "keywords": ["list", "of", "relevant", "keywords"],
  "language": "detected language code (en, hi, ta, te, bn, etc.)",
  "confidence": 0.0 to 1.0
}`

  try {
    const response = await invokeBedrockModel(prompt)
    // Extract JSON from response (Bedrock may include extra text)
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    return jsonMatch ? JSON.parse(jsonMatch[0]) : { intent: 'general_info', keywords: [], language: 'en', confidence: 0.5 }
  } catch (error) {
    console.error('[Bedrock] Intent recognition failed:', error)
    return { intent: 'general_info', keywords: [], language: 'en', confidence: 0.0 }
  }
}

/**
 * Translate response to target language using Bedrock
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language code
 * @returns {Promise<string>} - Translated text
 */
async function translateWithBedrock(text, targetLanguage) {
  const prompt = `Translate the following text to ${targetLanguage}. Respond with ONLY the translated text, no explanation.

Text: "${text}"`

  return invokeBedrockModel(prompt, { maxTokens: 500 })
}

module.exports = {
  invokeBedrockModel,
  generateSchemeExplanation,
  recognizeIntent,
  translateWithBedrock,
  bedrockClient
}
