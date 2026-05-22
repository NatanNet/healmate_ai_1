const Chat = require('../models/Chat');
const axios = require('axios');

const sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    const userId = req.userId;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message cannot be empty' });
    }

    // Save user message
    const chat = await Chat.create({
      userId,
      userMessage: message
    });

    // TODO: Call Flask AI service
    // const aiResponse = await axios.post('http://localhost:5001/api/ai/respond', {
    //   message: message
    // });

    // For now, return mock response
    chat.aiResponse = 'Thank you for sharing. I hear you. How can I support you today?';
    await chat.save();

    res.status(201).json({
      message: 'Message sent successfully',
      chat
    });
  } catch (error) {
    next(error);
  }
};

const getChatHistory = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { limit = 50, page = 1 } = req.query;

    const skip = (page - 1) * limit;

    const chats = await Chat.find({ userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Chat.countDocuments({ userId });

    res.status(200).json({
      chats,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

const deleteChat = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const userId = req.userId;

    const chat = await Chat.findOne({ _id: chatId, userId });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    await Chat.deleteOne({ _id: chatId });

    res.status(200).json({ message: 'Chat deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { sendMessage, getChatHistory, deleteChat };
