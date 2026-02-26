/**
 * AWS S3 Client
 * Handles retrieval of government scheme documents, PDFs, and training data
 * Supports keyword-based and semantic retrieval for RAG pipeline
 */

const { S3Client, GetObjectCommand, ListObjectsV2Command, HeadBucketCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')

// Initialize S3 client (AWS SDK v3)
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1'
})

const S3_BUCKET = process.env.AWS_S3_BUCKET || 'sahaay-documents'
const S3_SCHEMES_PREFIX = 'schemes/' // Folder structure: schemes/category/scheme-id/document

/**
 * Fetch government scheme document from S3
 * @param {string} schemeId - Scheme identifier (e.g., 'pm-kisan')
 * @param {string} format - File format (txt, pdf, json)
 * @returns {Promise<string>} - Document content
 */
async function getSchemeDocument(schemeId, format = 'txt') {
  try {
    const key = `${S3_SCHEMES_PREFIX}${schemeId}/document.${format}`

    const command = new GetObjectCommand({
      Bucket: S3_BUCKET,
      Key: key
    })

    console.log(`[S3] Fetching document: s3://${S3_BUCKET}/${key}`)
    const response = await s3Client.send(command)

    // Convert stream to string
    const responseBody = await new Promise((resolve, reject) => {
      let chunks = []
      response.Body.on('data', chunk => chunks.push(chunk))
      response.Body.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')))
      response.Body.on('error', reject)
    })

    console.log(`[S3] Retrieved document (${responseBody.length} bytes)`)
    return responseBody

  } catch (error) {
    console.error(`[S3] Error fetching scheme document:`, error.message)
    throw error
  }
}

/**
 * List all available schemes from S3
 * Scans the schemes/ directory and returns scheme metadata
 * @returns {Promise<Array>} - List of {schemeId, name, category}
 */
async function listAvailableSchemes() {
  try {
    const command = new ListObjectsV2Command({
      Bucket: S3_BUCKET,
      Prefix: S3_SCHEMES_PREFIX,
      Delimiter: '/'
    })

    console.log(`[S3] Listing schemes from ${S3_BUCKET}/${S3_SCHEMES_PREFIX}`)
    const response = await s3Client.send(command)

    // Extract scheme IDs from common prefixes
    const schemes = (response.CommonPrefixes || [])
      .map(prefix => {
        const schemeId = prefix.Prefix.replace(S3_SCHEMES_PREFIX, '').replace(/\/$/, '')
        return { schemeId, category: 'government' }
      })

    console.log(`[S3] Found ${schemes.length} schemes`)
    return schemes

  } catch (error) {
    console.error('[S3] Error listing schemes:', error.message)
    return []
  }
}

/**
 * Search schemes by keyword (basic text search)
 * Fetches all scheme metadata and performs client-side filtering
 * For production, consider using Elasticsearch or similar
 * @param {string} keyword - Search term
 * @returns {Promise<Array>} - Matching schemes
 */
async function searchSchemesByKeyword(keyword) {
  try {
    const schemes = await listAvailableSchemes()
    const lowerKeyword = keyword.toLowerCase()

    // Filter schemes by ID or fetch metadata if available
    const filtered = schemes.filter(scheme =>
      scheme.schemeId.toLowerCase().includes(lowerKeyword)
    )

    console.log(`[S3] Keyword search "${keyword}" found ${filtered.length} results`)
    return filtered

  } catch (error) {
    console.error('[S3] Error searching schemes:', error.message)
    return []
  }
}

/**
 * Retrieve multiple scheme documents for context building
 * @param {Array<string>} schemeIds - List of scheme IDs to retrieve
 * @returns {Promise<Object>} - {schemeId: documentContent}
 */
async function getSchemeDocuments(schemeIds) {
  try {
    const documents = {}

    for (const schemeId of schemeIds) {
      try {
        const doc = await getSchemeDocument(schemeId)
        documents[schemeId] = doc
      } catch (error) {
        console.warn(`[S3] Failed to retrieve scheme ${schemeId}:`, error.message)
        documents[schemeId] = null
      }
    }

    return documents

  } catch (error) {
    console.error('[S3] Error retrieving multiple documents:', error.message)
    throw error
  }
}

/**
 * Generate a time-limited download URL for a document
 * Useful for providing direct access to PDFs or audio files
 * @param {string} schemeId - Scheme identifier
 * @param {string} format - File format
 * @param {number} expiresIn - URL expiration in seconds (default 1 hour)
 * @returns {Promise<string>} - Signed S3 URL
 */
async function getSchemeDocumentSignedUrl(schemeId, format = 'pdf', expiresIn = 3600) {
  try {
    const key = `${S3_SCHEMES_PREFIX}${schemeId}/document.${format}`

    const command = new GetObjectCommand({
      Bucket: S3_BUCKET,
      Key: key
    })

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn })

    console.log(`[S3] Generated signed URL for ${schemeId}`)
    return signedUrl

  } catch (error) {
    console.error('[S3] Error generating signed URL:', error.message)
    throw error
  }
}

/**
 * Upload a scheme document (for admin/data ingestion)
 * Used during data preparation phase
 * @param {string} schemeId - Scheme identifier
 * @param {Buffer} fileContent - File content
 * @param {string} format - File format (txt, pdf, json)
 * @returns {Promise<string>} - Object key in S3
 */
async function uploadSchemeDocument(schemeId, fileContent, format = 'txt') {
  try {
    const { PutObjectCommand } = require('@aws-sdk/client-s3')
    const key = `${S3_SCHEMES_PREFIX}${schemeId}/document.${format}`

    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: fileContent,
      ContentType: format === 'json' ? 'application/json' : 'text/plain'
    })

    console.log(`[S3] Uploading document: ${key}`)
    await s3Client.send(command)

    console.log(`[S3] Successfully uploaded ${key}`)
    return key

  } catch (error) {
    console.error('[S3] Error uploading document:', error.message)
    throw error
  }
}

/**
 * Check S3 bucket health/permissions
 */
async function checkBucketHealth() {
  try {
    const command = new HeadBucketCommand({ Bucket: S3_BUCKET })
    await s3Client.send(command)
    console.log(`[S3] Bucket ${S3_BUCKET} is accessible`)
    return true
  } catch (error) {
    console.error(`[S3] Bucket health check failed:`, error.message)
    return false
  }
}

module.exports = {
  s3Client,
  getSchemeDocument,
  listAvailableSchemes,
  searchSchemesByKeyword,
  getSchemeDocuments,
  getSchemeDocumentSignedUrl,
  uploadSchemeDocument,
  checkBucketHealth,
  S3_BUCKET,
  S3_SCHEMES_PREFIX
}
