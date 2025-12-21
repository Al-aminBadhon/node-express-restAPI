const { PromptTemplate } = require("@langchain/core/prompts");
const { getGroqLLM } = require("../services/llmProvider");
const {
  saveCachedResult,
  getCachedResult,
} = require("../services/cacheService");
exports.runAnalystAgent = async (ticker) => {
  const llm = getGroqLLM();

  const cached = await getCachedResult(ticker, "analyst");
  if (cached)
    return {
      ...cached.content,
      source: "cache",
    };

  const prompt = new PromptTemplate({
    template: `
You are a financial analyst.

Task:
- Provide a concise analyst prediction for the stock ticker "{ticker}"
- Include a 50 words summary of the analysts recommendation
- provide at least 3 recentAnalystActions
- Respond ONLY with valid JSON
- Do NOT include markdown, comments, or explanations
- Follow the exact JSON structure below

JSON format:
{{
  "summary": "",
  "avgTargetPrice": "",
  "lowestTargetPrice": "",
  "highestTargetPrice": "",
  "rating": "strong buy/ buy/ hold/ sell/ strong sell",
  "upsidePotential": "",
  "currentPrice": "",
  "analystRecommendationBreakdown": {{
      "totalAnalysts": "",
      "strongBuyOutOf100": "",
      "buyOutOf100": "",
      "holdOutOf100": "",
      "sellOutOf100": "",
      "strongSellOutOf100": ""
    }},
    "recentAnalystActions": [
    {{
        "analystName": "",
        "action": "maintained buy/downgraded to sell/hold/upgraded to strong buy/etc.",
        "date": "1/2/3/days/weeks/months ago",
        "targetPrice": ""
    }}]
}}
`,
    inputVariables: ["ticker"],
  });

  const chain = prompt.pipe(llm);

  const response = await chain.invoke({ ticker });

  const parsed = JSON.parse(response.content);

  await saveCachedResult(
    ticker,
    "analyst",
    parsed,
    24 * 60 * 60 * 1000, // TTL 24 hours in milliseconds
    null // no absolute expiry
  );
  return {
    ...parsed,
    source: "llm",
  };
};
