const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: String,
    category: {
      type: String,
      enum: ['emotional_healing', 'physical_wellness', 'mental_health', 'personal_growth', 'relationships'],
      required: true
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed'],
      default: 'not_started'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    targetDate: Date,
    completedDate: Date,
    milestones: [
      {
        title: String,
        completed: Boolean,
        completedDate: Date
      }
    ],
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    tags: [String]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Goal', goalSchema);
