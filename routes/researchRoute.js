const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const researchController = require("../controllers/researchController");

// default tab → news
router.get("/research/:ticker", auth, researchController.getInitialResearch);
router.get(
  "/research/analyst/:ticker",
  auth,
  researchController.getAnalystPrediction
);

module.exports = router;
