// routes/applications.js
const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/applications  => list current user's applications
router.get('/', auth, async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT
      a.id AS application_id,
         a.created_at,
         a.status,
         j.id   AS job_id,
         j.title,
         j.company_id,
         j.location
       FROM applications a
       JOIN jobs j ON j.id = a.job_id
   WHERE a.user_id = $1
       ORDER BY a.created_at DESC`,
      [req.user.id]
    );
    res.json({ applications: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;