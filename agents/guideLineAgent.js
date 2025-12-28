const { PromptTemplate } = require("@langchain/core/prompts");
const { getGroqLLM } = require("../services/llmProvider");
const {
  saveCachedResult,
  getCachedResult,
} = require("../services/cacheService");
const axios = require("axios");

exports.runGuideLineAgent = async (ticker) => {
  //const llm = getGroqLLM();
  try {
    const cached = await getCachedResult(ticker, "guideLine");
    if (cached)
      return {
        ...cached.content,
        source: "cache",
      };

    console.log("Hitting guideline agent");

    const response = await axios.post(
      `${process.env.PYTHON_LANGCHAIN_BASE_URL}/deep-research`,
      {
        ticker: ticker,
      }
    );
    console.log("response data:", response.data);

    const reportData = response.data;
    console.log("response data parsed:", reportData);

    await saveCachedResult(
      ticker,
      "guideLine",
      reportData,
      24 * 60 * 60 * 1000, // TTL 24 hours in milliseconds
      null // no absolute expiry
    );
    return {
      ...reportData,
      source: "llm",
    };
  } catch (error) {
    console.error("Error connecting to Python API:", error.message);
  }
};
