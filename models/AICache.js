const mongoose = require("mongoose");

const aiCacheSchema = new mongoose.Schema(
  {
    ticker: {
      type: String,
      required: true,
      uppercase: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["news", "analyst", "investor", "deep", "companyInfo"],
      required: true,
      index: true,
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // Time to Live index
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AICache", aiCacheSchema);
