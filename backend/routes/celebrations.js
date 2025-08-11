const express = require('express');
const router = express.Router();
const { 
  getAllCelebrations,
  getCelebrationById,
  createCelebration,
  updateCelebration,
  deleteCelebration,
  getUpcomingCelebrations, 
  getTodayCelebrations 
} = require('../controllers/celebrationController');

// GET /api/celebrations - Get all celebrations (custom + employee-based)
router.get('/', getAllCelebrations);

// POST /api/celebrations - Create new celebration
router.post('/', createCelebration);

// GET /api/celebrations/:id - Get celebration by ID
router.get('/:id', getCelebrationById);

// PUT /api/celebrations/:id - Update celebration
router.put('/:id', updateCelebration);

// DELETE /api/celebrations/:id - Delete celebration
router.delete('/:id', deleteCelebration);

// GET /api/celebrations/upcoming - Get upcoming celebrations (next 30 days)
router.get('/upcoming', getUpcomingCelebrations);

// GET /api/celebrations/today - Get today's celebrations
router.get('/today', getTodayCelebrations);

module.exports = router; 