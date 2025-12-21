const { PromptTemplate } = require("@langchain/core/prompts");
const { getGroqLLM } = require("../services/llmProvider");
const {
  getCachedResult,
  saveCachedResult,
} = require("../services/cacheService");

function getNextMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight;
}

exports.runCompanyInfoAgent = async (ticker) => {
  // Check cache if there is a search
  const cached = await getCachedResult(ticker, "companyInfo");
  if (cached) {
    return {
      ...cached.content,
      source: "cache",
    };
  }

  // Call LLM (ONLY once per day) as intial search will save cache data
  const llm = getGroqLLM();

  const prompt = new PromptTemplate({
    template: `
You are a financial data assistant.

Instructions:
- Generate a concise company profile for the stock ticker "{ticker}"
- Keep the company summary under 80 words
- Respond ONLY with valid JSON
- Do NOT include markdown, comments, or explanations
- Follow the exact JSON structure below

JSON structure:
{{
  "name": "",
  "founded": "",
  "ceo": "",
  "headquarters": "",
  "industry": "",
  "marketCap": "",
  "peRatio": "",
  "customers": "",
  "summary": "",
  "products": []
  }}
`,
    inputVariables: ["ticker"],
  });

  const chain = prompt.pipe(llm);

  const response = await chain.invoke({ ticker });

  const parsed = JSON.parse(response.content);

  // 3️⃣ Cache until next midnight
  await saveCachedResult(
    ticker,
    "companyInfo",
    parsed,
    24 * 60 * 60 * 1000, // TTL 24 hours in milliseconds
    null // no absolute expiry
  );

  return {
    ...parsed,
    source: "llm",
  };
};
