const mongoose = require('mongoose');

const capsuleSchema = new mongoose.Schema(
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
    content: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['memory', 'letter', 'wisdom', 'gratitude'],
      required: true
    },
    unlockDate: {
      type: Date,
      required: true
    },
    isUnlocked: {
      type: Boolean,
      default: false
    },
    attachments: [String],
    visibility: {
      type: String,
      enum: ['private', 'shared'],
      default: 'private'
    },
    sharedWith: [mongoose.Schema.Types.ObjectId],
    emotion: String,
    location: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Capsule', capsuleSchema);
