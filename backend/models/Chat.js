const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    userMessage: {
      type: String,
      required: true
    },
    aiResponse: {
      type: String,
      default: ''
    },
    sentiment: {
      type: String,
      enum: ['positive', 'neutral', 'negative'],
      default: null
    },
    emotionalTone: {
      type: String,
      default: ''
    },
    isFollowUp: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Chat', chatSchema);
