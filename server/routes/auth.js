const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const pool = require('../db');
const router = express.Router();

router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    const userRes = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userRes.rows[0];

    if(!user) return res.status(401).json({error: 'Invalid credentials'});

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({error: 'Invalid credentials'});

    const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET, {expiresIn: '1d'});
    res.json({ token });
});

module.exports = router;