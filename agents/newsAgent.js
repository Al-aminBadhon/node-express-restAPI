const { PromptTemplate } = require("@langchain/core/prompts");
const { getGroqLLM } = require("../services/llmProvider");

exports.runNewsAgent = async (ticker) => {
  const llm = getGroqLLM();

  const prompt = new PromptTemplate({
    template: `
You are a financial news analyst.

Task:
- Summarize recent market news for {ticker}
- Classify sentiment as Positive, Neutral, or Negative
- Give 3 short bullet points
- Output JSON only

JSON format:
{{
  "sentiment": "",
  "summary": "",
  "highlights": []
}}
`,
    inputVariables: ["ticker"],
  });

  const chain = prompt.pipe(llm);

  const response = await chain.invoke({ ticker });

  return JSON.parse(response.content);
};
