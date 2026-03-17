const jwt = require("jsonwebtoken");
const pool = require("../db");
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this-in-production";

async function auth(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Fetch user from database
    const result = await pool.query(
      "SELECT id, email, full_name, role FROM users WHERE id = $1",
      [decoded.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }
    
    req.user = result.rows[0];
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
}

// Admin-only middleware
function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
}

module.exports = { auth, adminOnly };