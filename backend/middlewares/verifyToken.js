const jwt = require("jsonwebtoken");
const User = require("../models/User");

//Verify JWT token
const verifyToken = async (req, res, next) => {
  //Extract the token from the authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  //Get the token from the authorization header (format: Bearer <token>)
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    //Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // Attach user info to request object for use in next middleware
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Token is not valid" });
  }
};

// Middleware to check if the user is an admin or  same user
const verifyTokenIsSameUserOrAdmin = (req, res, next) => {
  // First, check if the token is valid by calling verifyToken
  verifyToken(req, res, () => {
    
    // Check if the user is authorized (same user or admin)
    if (req.user.id === req.params.id || req.user.role == "admin") {
      next(); // Proceed to the next middleware or route handler
    } else {
      return res.status(403).json("You're not allowed to do that!");
    }
  });
};

// Middleware to check if the user is an admin
const verifyTokenIsAdmin = (req, res, next) => {
  // First, check if the token is valid by calling verifyToken
  verifyToken(req, res, () => {
    // Check if the user is an admin
    if (req.user.role === "admin") {
      next(); // Proceed to the next middleware or route handler
    } else {
      return res.status(403).json("You're not allowed to do that!");
    }
  });
};

// Middleware to check if the user is same user
const verifyTokenIsSameUser = (req, res, next) => {
  // First, check if the token is valid by calling verifyToken
  verifyToken(req, res, () => {
    // Check if the user is authorized (same user)

    if (req.user.id === req.params.id) {
      next(); // Proceed to the next middleware or route handler
    } else {
      return res.status(403).json("You're not allowed to do that!");
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenIsSameUserOrAdmin,
  verifyTokenIsAdmin,
  verifyTokenIsSameUser,
};
