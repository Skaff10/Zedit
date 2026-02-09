const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = auth.split(" ")[1];

  // Check for invalid token values (happens when localStorage has stale data)
  if (
    !token ||
    token === "undefined" ||
    token === "null" ||
    token.split(".").length !== 3
  ) {
    return res
      .status(401)
      .json({ message: "Invalid token format. Please log in again." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = protect;
