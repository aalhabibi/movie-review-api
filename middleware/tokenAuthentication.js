const { cookie } = require("express-validator");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "SUPERSECRETKEY";

function authenticateToken(req, res, next) {
  let token = null;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers["authorization"]) {
    const authHeader = req.headers["authorization"];
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (token == null) {
    return res.status(401).json({ message: "Unauthorized, Please login" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid Token" });
    }
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
