const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

const router = express.Router();

// كل مسارات هذا الملف للأدمن فقط
router.use(auth, requireRole('admin'));

// GET /api/admin/jobs  — قائمة الوظائف
router.get('/jobs', async (_req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT id, title, description, company_id, location, salary, created_at
       FROM jobs
       ORDER BY created_at DESC`
    );
    res.json({ jobs: rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/admin/jobs — إضافة وظيفة
router.post('/jobs', async (req, res) => {
  const { title, company_id, location, salary, description } = req.body;
  if (!title) return res.status(400).json({ message: 'title is required' });
  try {
    const { rows } = await db.query(
      `INSERT INTO jobs (title, company_id, location, salary, description)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING id, title, company_id, location, salary, created_at`,
      [title, company_id || null, location || null, salary || null, description || null]
    );
    res.status(201).json({ job: rows[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/applications — جدول المتقدّمين
router.get('/applications', async (_req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT 
         a.id            AS application_id,
         a.created_at,
         a.status,
         u.id            AS user_id,
         u.name          AS user_name,
         u.email         AS user_email,
         j.id            AS job_id,
         j.title         AS job_title,
         j.company_id    AS company_id
       FROM applications a
       JOIN users u ON u.id = a.user_id
       JOIN jobs  j ON j.id = a.job_id
       ORDER BY a.created_at DESC`
    );
    res.json({ applications: rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;