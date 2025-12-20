const { runNewsAgent } = require("../agents/newsAgent");
const { runCompanyInfoAgent } = require("../agents/companyInfoAgent");

const getInitialResearch = async (req, res) => {
  // it executes initial search with basic company info and news info
  try {
    const { ticker } = req.params;

    //Parallel execution
    const [companyInfo, news] = await Promise.all([
      runCompanyInfoAgent(ticker),
      runNewsAgent(ticker),
    ]);

    //only news agent calling
    //const news = await runNewsAgent(ticker);

    res.json({
      ticker,
      companyInfo,
      news,
      analyst: null,
      investors: null,
      deepResearch: null,
    });
  } catch (error) {
    console.error("Research error:", error);
    res.status(500).json({ message: "Failed to load company data" });
  }
};

module.exports = { getInitialResearch };
