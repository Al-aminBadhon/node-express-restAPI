const { runNewsAgent } = require("../agents/newsAgent");
const { runCompanyInfoAgent } = require("../agents/companyInfoAgent");
const { runAnalystAgent } = require("../agents/analystAgent");

const getInitialResearch = async (req, res) => {
  // it executes initial search with basic company info and news info
  try {
    const { ticker } = req.params;

    //Parallel execution
    const [companyInfo, news] = await Promise.all([
      runCompanyInfoAgent(ticker),
      runNewsAgent(ticker),
    ]);

    //only news agent calling - initially used
    //const news = await runNewsAgent(ticker);

    res.json({
      ticker,
      companyInfo,
      news,
    });
  } catch (error) {
    console.error("Research error:", error);
    res.status(500).json({ message: "Failed to load company data" });
  }
};

const getAnalystPrediction = async (req, res) => {
  try {
    const { ticker } = req.params;
    const analystInfo = await runAnalystAgent(ticker);
    res.json({ ticker, analystInfo });
  } catch (error) {
    console.error("Analyst prediction error:", error);
    res.status(500).json({ message: "Failed to load analyst prediction" });
  }
};

module.exports = {
  getInitialResearch,
  getAnalystPrediction,
};
