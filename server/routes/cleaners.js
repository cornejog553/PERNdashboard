const express = require("express");
const router = express.Router();
const pool = require("../db");
const { auth, adminOnly } = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM cleaners`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Create new cleaner - require admin role
router.post("/", auth, adminOnly, async (req, res) => {
  try {
    const { full_name, email, phone, is_active } = req.body;
    
    const result = await pool.query(
      `INSERT INTO cleaners (full_name, email, phone, is_active) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [full_name, email, phone, is_active]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;