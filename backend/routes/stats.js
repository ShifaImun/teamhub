// backend/routes/stats.js
const express = require('express');
const router = express.Router();
const TeamMember = require('../models/TeamMember');
const Department = require('../models/Department');
const Announcement = require('../models/Announcement');
const Celebration = require('../models/Celebration');

router.get('/', async (req, res) => {
  try {
    const teamMembers = await TeamMember.countDocuments();
    const departments = await Department.countDocuments();
    const announcements = await Announcement.countDocuments();
    const upcomingCelebrations = await Celebration.countDocuments({
      date: { $gte: new Date(), $lt: new Date(Date.now() + 30*24*60*60*1000) }
    });

    res.json({ teamMembers, departments, announcements, upcomingCelebrations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
