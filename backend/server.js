// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const jobsRoutes = require('./routes/jobs');
const applicationsRoutes = require('./routes/applications');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5173;

app.use(cors());
app.use(express.json());

// prefix all with /api
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/admin', adminRoutes);

// simple health
app.get('/api/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));