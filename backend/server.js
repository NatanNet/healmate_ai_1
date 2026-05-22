require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');  // ✅ ADD BARIS INI

const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const moodRoutes = require('./routes/mood');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';  // ✅ ADD BARIS INI

// ==================== MIDDLEWARE ====================
// CORS - Updated untuk Docker network
app.use(cors({
  origin: function (origin, callback) {
    // ✅ Updated allowedOrigins
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost',
      'http://frontend:80',    // Docker network
      'http://localhost:8000'  // FastAPI untuk development
    ];
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== HEALTH CHECK ====================
app.get('/api/health', (req, res) => {
  res.json({ 
    message: '✅ Express Server is running!',
    service: 'Backend API',
    fastapi_url: FASTAPI_URL
  });
});

// ==================== AI PROCESSING ENDPOINTS ====================
// ✅ NEW ENDPOINT: Chat dengan AI analysis
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Panggil FastAPI untuk analyze chat
    const response = await axios.post(`${FASTAPI_URL}/api/ai/chat`, {
      message: message,
      userId: userId
    });

    // Return hasil ke frontend
    res.json({
      status: 'success',
      data: response.data
    });

  } catch (error) {
    console.error('❌ AI Chat Error:', error.message);
    
    // Error handling untuk FastAPI yang down
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        error: 'AI service unavailable',
        message: 'FastAPI backend is not responding'
      });
    }

    res.status(500).json({ 
      error: 'AI processing failed',
      message: error.message 
    });
  }
});

// ✅ NEW ENDPOINT: Analyze mood
app.post('/api/ai/analyze-mood', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Panggil FastAPI untuk analyze mood
    const response = await axios.post(`${FASTAPI_URL}/api/ai/analyze-mood`, {
      text: text
    });

    res.json({
      status: 'success',
      data: response.data
    });

  } catch (error) {
    console.error('❌ Mood Analysis Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        error: 'AI service unavailable'
      });
    }

    res.status(500).json({ 
      error: 'Mood analysis failed',
      message: error.message 
    });
  }
});

// ✅ NEW ENDPOINT: Custom emotion detection
app.post('/api/ai/emotion', async (req, res) => {
  try {
    const { text, emotions } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Panggil FastAPI untuk custom emotion detection
    const response = await axios.post(`${FASTAPI_URL}/api/ai/custom-emotion`, {
      text: text,
      emotions: emotions
    });

    res.json({
      status: 'success',
      data: response.data
    });

  } catch (error) {
    console.error('❌ Emotion Detection Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        error: 'AI service unavailable'
      });
    }

    res.status(500).json({ 
      error: 'Emotion detection failed',
      message: error.message 
    });
  }
});

// ✅ NEW ENDPOINT: Get AI info
app.get('/api/ai/info', async (req, res) => {
  try {
    const response = await axios.get(`${FASTAPI_URL}/api/ai/info`);
    res.json(response.data);
  } catch (error) {
    console.error('❌ AI Info Error:', error.message);
    res.status(500).json({ error: 'Could not fetch AI info' });
  }
});

// ==================== EXISTING ROUTES ====================
// Routes tetap sama
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/mood', moodRoutes);

// Error handling middleware
app.use(errorHandler);

// ==================== DATABASE CONNECTION ====================
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    
    // Start server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Express Server running on port ${PORT}`);
      console.log(`📡 FastAPI URL: ${FASTAPI_URL}`);
    });

    // ✅ Graceful shutdown untuk production
    process.on('SIGTERM', () => {
      console.log('⏸️  SIGTERM received, shutting down gracefully...');
      server.close(() => {
        console.log('✅ Express server closed');
        mongoose.connection.close();
        process.exit(0);
      });
    });

  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  });

// ==================== ERROR HANDLING ====================
// Handle unhandled rejections
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Rejection:', error);
  process.exit(1);
});

module.exports = app;