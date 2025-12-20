const AICache = require("../models/AICache");

exports.getCachedResult = async (ticker, type) => {
  return AICache.findOne({ ticker, type });
};

exports.saveCachedResult = async (ticker, type, content, ttlHours = 6) => {
  const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000);

  return AICache.findOneAndUpdate(
    { ticker, type },
    { content, expiresAt },
    { upsert: true, new: true }
  );
};
