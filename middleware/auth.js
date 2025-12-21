const jwt = require("jsonwebtoken");
const config = process.env;
const BlackList = require("../models/blackList");

const verifyToken = async (req, res, next) => {
  // Safe token extraction from multiple sources
  const bodyToken = req.body ? req.body.token : undefined;
  const queryToken = req.query ? req.query.token : undefined;
  const authHeader = req.headers ? req.headers["authorization"] : undefined;
  const xAccessToken = req.headers ? req.headers["x-access-token"] : undefined;

  const token = bodyToken || queryToken || authHeader || xAccessToken;

  if (!token) {
    return res.status(403).json({
      success: false,
      msg: "Authentication token required",
      options: [
        "Authorization header: 'Bearer <token>'",
        "Query parameter: ?token=<token>",
        "x-access-token header: '<token>'",
        "Request body: { 'token': '<token>' } (for non-GET requests)",
      ],
      example: "GET /api/profile?token=your_jwt_token_here",
    });
  }

  if (!token) {
    return res.status(403).json({
      success: false,
      msg: "A token is required for authentication",
    });
  }
  try {
    const bearerToken = token.split(" ")[1];
    // console.log(bearerToken);

    const blackListed = await BlackList.findOne({ token: bearerToken });
    // console.log(blackListed ? "true" : "false");
    if (blackListed) {
      return res.status(400).json({
        success: false,
        msg: "The session has expired, please try again",
      });
    }

    const decodedData = jwt.verify(bearerToken, config.ACCESS_TOKEN_SECRET);
    console.log("Decoded Data", decodedData);

    req.user = decodedData;
    req.token = bearerToken;
  } catch (error) {
    return res.status(401).json({
      success: false,
      msg: "Invalid token",
    });
  }

  return next();
};

module.exports = verifyToken;
