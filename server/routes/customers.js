const express = require("express");
const router = express.Router();
const pool = require("../db");
const { auth, adminOnly } = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM customers`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Create new Customer - require admin role
router.post("/", auth, adminOnly, async (req, res) => {
  try {
    const { full_name, email, phone, address } = req.body;
    
    const result = await pool.query(
      `INSERT INTO customers (full_name, email, phone, address) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [full_name, email, phone, address]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.put("/:id", auth, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, phone, address } = req.body;
    
    const result = await pool.query(
      `UPDATE customers 
       SET full_name = $1, email = $2, phone = $3, address = $4 
       WHERE id = $5 
       RETURNING *`,
      [full_name, email, phone, address, id]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Delete Customer by id - require admin role
router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM customers WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
