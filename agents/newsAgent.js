const { PromptTemplate } = require("@langchain/core/prompts");
const { getGroqLLM } = require("../services/llmProvider");
const {
  saveCachedResult,
  getCachedResult,
} = require("../services/cacheService");

exports.runNewsAgent = async (ticker) => {
  const llm = getGroqLLM();

  const cached = await getCachedResult(ticker, "news");
  if (cached)
    return {
      ...cached.content,
      source: "cache",
    };
  const prompt = new PromptTemplate({
    template: `
You are a financial news analyst.

Task:
- Provide exactly 3 recent news items, overallMarketSummary 50 words
- Each news item must include:
  - title
  - 20–30 word news summary
  - source
  - URL
  - sector impact
  - news impact ("positive" or "negative")
- Perform sentiment analysis based on the recent news
- Use the most recent publicly available information
- Classify sentiment as Positive, Neutral, or Negative
- Respond ONLY with valid JSON
- Do NOT include markdown, comments, or explanations
- Follow the exact JSON structure below

JSON format:
{{
  "sentiment": "",
  "overallMarketSummary": "",
  "sentimentAnalysis": {{
      "bullishOutOf100": "",
      "bearishOutOf100": "",
      "neutralOutOf100": "",
      "sentimentScoreOutOf5": ""
    }},
    "recentNews": [
      {{
        "title": "",
        "summary": "",
        "source": "",
        "url": "",
        "sectorImpact": "",
        "score": "positive"
    }},
    ]
}}
`,
    inputVariables: ["ticker"],
  });

  const chain = prompt.pipe(llm);

  const response = await chain.invoke({ ticker });

  const parsed = JSON.parse(response.content);

  await saveCachedResult(
    ticker,
    "news",
    parsed,
    24 * 60 * 60 * 1000, // TTL 24 hours in milliseconds
    null // no absolute expiry
  );
  return {
    ...parsed,
    source: "llm",
  };
};
