const Groq = require("groq-sdk");
const { ChatOpenAI } = require("@langchain/openai");

const getGroqLLM = () => {
  return new ChatOpenAI({
    model: "openai/gpt-oss-120b", //groq/compound, openai/gpt-oss-120b
    temperature: 0.2,
    apiKey: process.env.GROQ_API_KEY,
    configuration: {
      baseURL: "https://api.groq.com/openai/v1",
      defaultHeaders: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
    },
  });
};

module.exports = { getGroqLLM };
