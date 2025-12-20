const { PromptTemplate } = require("@langchain/core/prompts");
const { getGroqLLM } = require("../services/llmProvider");
const {
  getCachedResult,
  saveCachedResult,
} = require("../services/cacheService");
const { JsonOutputParser } = require("@langchain/core/output_parsers");

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

  //   const prompt1 = new PromptTemplate({
  //     template: `
  // You are a financial data assistant.

  // Generate a concise company profile for {ticker}.

  // Rules:
  // - Keep summary under 80 words
  // - Use realistic but approximate values
  // - Do NOT include disclaimers

  // Return a JSON object with: name, founded, ceo, headquarters, industry, marketCap, peRatio, products[], customers, summary
  // `,
  const prompt = new PromptTemplate({
    template: `
You are a financial data assistant.

Task:
- Generate a concise company profile for {ticker}
- Keep summary under 80 words
- Give 3 short bullet points
- Use realistic but approximate values
- Output JSON only

JSON format:
{{
  "name": "",
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
    null, // TTL not used
    getNextMidnight() // absolute expiry
  );

  return {
    ...parsed,
    source: "llm",
  };
};
