const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");


const router = express.Router();

// GET /api/jobs  => list jobs (with company name)
router.get('/', auth, async (req, res) => {
  const q = req.query.q || '';
  try {
    const { rows } = await db.query(
      `SELECT
         j.id,
         j.title,
         j.location,
         j.description,
         j.created_at,
         j.salary,
         j.company_id,
         c.name      AS company_name,
         c.website   AS company_website,
         c.description AS company_description
       FROM jobs j
       JOIN companies c ON c.id = j.company_id
       WHERE j.title ILIKE $1
          OR c.name ILIKE $1
       ORDER BY j.created_at DESC`,
      [`%${q}%`]
    );
    res.json({ jobs: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/jobs/:id  => single job (with company info)
router.get('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query(
      `SELECT
         j.id,
         j.title,
         j.location,
         j.description,
         j.created_at,
         j.salary,
         j.company_id,
         c.name      AS company_name,
         c.website   AS company_website,
         c.description AS company_description
       FROM jobs j
       JOIN companies c ON c.id = j.company_id
       WHERE j.id = $1`,
      [id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Job not found' });
    res.json({ job: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;