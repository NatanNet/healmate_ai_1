const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { recordMood, getWeeklyMoods, getMoodStats } = require('../controllers/moodController');

// Protected routes
router.post('/record', authMiddleware, recordMood);
router.get('/weekly', authMiddleware, getWeeklyMoods);
router.get('/stats', authMiddleware, getMoodStats);

module.exports = router;
