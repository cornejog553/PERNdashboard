const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res)=> {
    try{
        const result = await.pool.query(`
            SELECT b.*, c.full_name AS customer_name, s.name AS service_name, cl.full_name AS cleaner_name
      FROM bookings b
      JOIN customers c ON b.customer_id = c.id
      JOIN services s ON b.service_id = s.id
      LEFT JOIN cleaners cl ON b.cleaner_id = cl.id
      ORDER BY b.scheduled_at DESC
`);
res.json(result.rows)
    } catch(err) {
        console.error(err);
        res.status(500).send('Server error')
    }
});

// POST new booking
router.post('/', async (req, res) => {
  const { customer_id, cleaner_id, service_id, scheduled_at, status, notes } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO bookings (customer_id, cleaner_id, service_id, scheduled_at, status, notes)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [customer_id, cleaner_id, service_id, scheduled_at, status, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = routers;
