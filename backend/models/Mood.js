const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    mood: {
      type: String,
      required: true,
      enum: ['sangat_sedih', 'sedih', 'normal', 'bahagia', 'sangat_bahagia']
    },
    intensity: {
      type: Number,
      min: 1,
      max: 10,
      required: true
    },
    activities: [String],
    notes: String,
    triggers: [String],
    copingStrategies: [String],
    physicalSensations: [String],
    recordedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Mood', moodSchema);
