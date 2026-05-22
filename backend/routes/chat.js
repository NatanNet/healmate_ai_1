const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { sendMessage, getChatHistory, deleteChat } = require('../controllers/chatController');

// Protected routes
router.post('/send', authMiddleware, sendMessage);
router.get('/history', authMiddleware, getChatHistory);
router.delete('/:chatId', authMiddleware, deleteChat);

module.exports = router;
