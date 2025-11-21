const jwt = require("jsonwebtoken");
const config = process.env;

const verifyToken = async (req, res, next) => {
  console.log("request body is ", req.headers["authorization"]);

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
    console.log("request 2nd............................");
    return res.status(403).json({
      success: false,
      msg: "A token is required for authentication",
    });
  }
  try {
    const bearerToken = token.split(" ")[1];
    const decodedData = jwt.verify(bearerToken, config.ACCESS_TOKEN_SECRET);
    req.user = decodedData;
  } catch (error) {
    return res.status(403).json({
      success: false,
      msg: "Invalid token",
    });
  }

  return next();
};

module.exports = verifyToken;
