// routes/profile.js
const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/profile
router.get('/', auth, async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id, name, email, role FROM users WHERE id = $1', [req.user.id]);
    console.log(rows)
    if (!rows[0]) return res.status(404).json({ message: 'User not found' });
    res.json({ user: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;