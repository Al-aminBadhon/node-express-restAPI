const { runNewsAgent } = require("../agents/newsAgent");
const { runCompanyInfoAgent } = require("../agents/companyInfoAgent");
const { runAnalystAgent } = require("../agents/analystAgent");
const { runGuideLineAgent } = require("../agents/guideLineAgent");
// const puppeteer = require("puppeteer");
// const { marked } = require("marked");

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

const getInvestorInfo = async (req, res) => {};

const getGuidelinesInfo = async (req, res) => {
  try {
    const { ticker } = req.params;
    const guideLineInfo = await runGuideLineAgent(ticker);
    res.json({ ticker, guideLineInfo });
  } catch (error) {
    console.error("Guideline Info fetch error:", error);
    res.status(500).json({ message: "Failed to load guide Line Info" });
  }
};

// const generateReportPDF = async (reportData) => {
//   // 1. Convert Markdown to HTML
//   const htmlContent = marked.parse(reportData);

//   // 2. Launch Puppeteer
//   const browser = await puppeteer.launch({ headless: "new" });
//   const page = await browser.newPage();

//   // 3. Set the full HTML with your "Mandatory" Styles
//   const finalHtml = `
//     <html>
//       <head>
//         <style>
//           body {
//             font-family: 'Helvetica', 'Arial', sans-serif;
//             padding: 40px;
//             line-height: 1.6;
//             color: #333;
//           }
//           p {
//             text-align: justify;
//             margin-bottom: 15px;
//           }
//           strong {
//             display: block;
//             margin-top: 25px;
//             margin-bottom: 8px;
//             font-size: 18px;
//             color: #1e3a8a;
//             border-bottom: 1px solid #e5e7eb;
//             padding-bottom: 4px;
//           }
//           li {
//             text-align: justify;
//             margin-bottom: 8px;
//           }
//         </style>
//       </head>
//       <body>
//         ${htmlContent}
//       </body>
//     </html>
//     `;

//   await page.setContent(finalHtml, { waitUntil: "networkidle0" });

//   // 4. Generate PDF
//   const pdfBuffer = await page.pdf({
//     format: "A4",
//     margin: { top: "60px", bottom: "60px", left: "40px", right: "40px" },
//     printBackground: true,
//     displayHeaderFooter: true,
//     headerTemplate:
//       '<span style="font-size: 10px; margin-left: 40px;">Equity Research Report</span>',
//     footerTemplate:
//       '<div style="font-size: 10px; margin: 0 auto;"><span class="pageNumber"></span> / <span class="totalPages"></span></div>',
//   });

//   await browser.close();
//   return pdfBuffer;
// };

module.exports = {
  getInitialResearch,
  getAnalystPrediction,
  getGuidelinesInfo,
};
