const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT b.*, c.full_name AS customer_name, s.name AS service_name, cl.full_name AS cleaner_name
      FROM bookings b
      JOIN customers c ON b.customer_id = c.id
      JOIN services s ON b.service_id = s.id
      LEFT JOIN cleaners cl ON b.cleaner_id = cl.id
      ORDER BY b.scheduled_at DESC
`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// POST new booking
router.post("/", async (req, res) => {
  const { customer_id, cleaner_id, service_id, scheduled_at, status, notes } =
    req.body;
  try {
    const result = await pool.query(
      `INSERT INTO bookings (customer_id, cleaner_id, service_id, scheduled_at, status, notes)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [customer_id, cleaner_id, service_id, scheduled_at, status, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// PUT - Update booking
router.put("/:id", auth, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { customer_id, service_id, cleaner_id, scheduled_at, status, notes } = req.body;
    
    const result = await pool.query(
      `UPDATE bookings 
       SET customer_id = $1, service_id = $2, cleaner_id = $3, scheduled_at = $4, status = $5, notes = $6
       WHERE id = $7 
       RETURNING *`,
      [customer_id, service_id, cleaner_id, scheduled_at, status, notes, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// DELETE - Delete booking
router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `DELETE FROM bookings WHERE id = $1 RETURNING *`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    res.json({ message: "Booking deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
