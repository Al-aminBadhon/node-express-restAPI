/**
 * AI CACHE SERVICE
 *
 * Purpose: Manages caching of AI-generated content in MongoDB with TTL support
 * Key Features:
 * - MongoDB-based cache storage
 * - TTL (Time-To-Live) expiration
 * - Upsert operations (create or update)
 * - Organized by ticker + type for easy retrieval
 */

const AICache = require("../models/AICache");

/**
 * Retrieves cached AI result for a specific ticker and content type
 *
 * @param {string} ticker - Stock ticker symbol (e.g., "AAPL", "GOOGL")
 * @param {string} type - Content type identifier (e.g., "companyInfo", "financials", "news")
 * @returns {Promise<Object|null>} Cached document or null if not found/expired
 *
 * @example
 * // Get cached company info for Apple
 * const cached = await getCachedResult("AAPL", "companyInfo");
 * // Returns: { ticker: "AAPL", type: "companyInfo", content: {...}, expiresAt: Date, ... }
 */
exports.getCachedResult = async (ticker, type) => {
  return AICache.findOne({ ticker, type });
};

/**
 * Saves or updates cached AI result with automatic expiration
 *
 * @param {string} ticker - Stock ticker symbol
 * @param {string} type - Content type identifier
 * @param {any} content - Data to cache (any JSON-serializable value)
 * @param {number} ttlHours - Time-to-live in hours (default: 6 hours)
 * @returns {Promise<Object>} Updated/created cache document
 *
 * @example
 * // Cache company info for 24 hours
 * await saveCachedResult("AAPL", "companyInfo", companyData, 24);
 *
 * @example
 * // Cache with default 6-hour TTL
 * await saveCachedResult("TSLA", "financials", financialData);
 */
exports.saveCachedResult = async (ticker, type, content, ttlHours = 6) => {
  const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000);

  return AICache.findOneAndUpdate(
    { ticker, type },
    { content, expiresAt },
    { upsert: true, new: true }
  );
};
