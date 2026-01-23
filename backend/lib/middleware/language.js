/**
 * Language Middleware
 * Handles Accept-Language header parsing and language preference
 * Supports 'en' (English) and 'ar' (Arabic)
 */

const SUPPORTED_LANGUAGES = ['en', 'ar']
const DEFAULT_LANGUAGE = 'en'

/**
 * Parse Accept-Language header and return preferred language
 * Supports quality values (e.g., "en-US,en;q=0.9,ar;q=0.8")
 * @param {string} acceptLanguageHeader - Accept-Language header value
 * @returns {string} Preferred language code ('en' or 'ar')
 */
export const parseAcceptLanguage = (acceptLanguageHeader) => {
  if (!acceptLanguageHeader) {
    return DEFAULT_LANGUAGE
  }

  try {
    // Parse header: "en-US,en;q=0.9,ar;q=0.8"
    const languages = acceptLanguageHeader
      .split(',')
      .map((lang) => {
        const [code, q] = lang.trim().split(';')
        const quality = q ? parseFloat(q.split('=')[1]) : 1.0
        // Extract base language code (e.g., "en" from "en-US")
        const baseCode = code.split('-')[0].toLowerCase()
        return { code: baseCode, quality }
      })
      .filter((lang) => SUPPORTED_LANGUAGES.includes(lang.code))
      .sort((a, b) => b.quality - a.quality)

    return languages.length > 0 ? languages[0].code : DEFAULT_LANGUAGE
  } catch (error) {
    console.error('Error parsing Accept-Language header:', error)
    return DEFAULT_LANGUAGE
  }
}

/**
 * Extract language from request
 * Priority: query param > header > default
 * @param {Object} request - Next.js request object
 * @param {Object} searchParams - URL search parameters
 * @returns {string} Language code
 */
export const getLanguageFromRequest = (request, searchParams = {}) => {
  // Check query parameter first
  if (searchParams.lang && SUPPORTED_LANGUAGES.includes(searchParams.lang)) {
    return searchParams.lang
  }

  // Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    const lang = parseAcceptLanguage(acceptLanguage)
    if (SUPPORTED_LANGUAGES.includes(lang)) {
      return lang
    }
  }

  return DEFAULT_LANGUAGE
}

/**
 * Get multilingual field value based on language
 * Handles fields stored as field_en and field_ar
 * @param {Object} obj - Object containing multilingual fields
 * @param {string} fieldName - Base field name (without language suffix)
 * @param {string} language - Language code ('en' or 'ar')
 * @returns {string|null} Field value or null if not found
 */
export const getMultilingualField = (obj, fieldName, language = DEFAULT_LANGUAGE) => {
  if (!obj || !fieldName) return null

  const key = `${fieldName}_${language}`
  const fallbackKey = `${fieldName}_${DEFAULT_LANGUAGE}`

  // Return language-specific value or fallback to English
  return obj[key] || obj[fallbackKey] || null
}

/**
 * Extract multilingual fields from object
 * Returns both language versions
 * @param {Object} obj - Object containing multilingual fields
 * @param {string} fieldName - Base field name
 * @returns {Object} Object with 'en' and 'ar' keys
 */
export const getMultilingualFields = (obj, fieldName) => {
  if (!obj || !fieldName) return { en: null, ar: null }

  return {
    en: obj[`${fieldName}_en`] || null,
    ar: obj[`${fieldName}_ar`] || null,
  }
}

/**
 * Validate language code
 * @param {string} lang - Language code to validate
 * @returns {boolean} True if valid
 */
export const isValidLanguage = (lang) => {
  return SUPPORTED_LANGUAGES.includes(lang)
}
