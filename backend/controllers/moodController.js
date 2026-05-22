const Mood = require('../models/Mood');

const recordMood = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { mood, intensity, activities, notes, triggers, copingStrategies, physicalSensations } = req.body;

    if (!mood || !intensity) {
      return res.status(400).json({ message: 'Mood and intensity are required' });
    }

    if (intensity < 1 || intensity > 10) {
      return res.status(400).json({ message: 'Intensity must be between 1 and 10' });
    }

    const moodEntry = await Mood.create({
      userId,
      mood,
      intensity,
      activities: activities || [],
      notes: notes || '',
      triggers: triggers || [],
      copingStrategies: copingStrategies || [],
      physicalSensations: physicalSensations || []
    });

    res.status(201).json({
      message: 'Mood recorded successfully',
      mood: moodEntry
    });
  } catch (error) {
    next(error);
  }
};

const getWeeklyMoods = async (req, res, next) => {
  try {
    const userId = req.userId;
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const moods = await Mood.find({
      userId,
      createdAt: { $gte: sevenDaysAgo }
    }).sort({ createdAt: -1 });

    res.status(200).json({
      moods,
      count: moods.length
    });
  } catch (error) {
    next(error);
  }
};

const getMoodStats = async (req, res, next) => {
  try {
    const userId = req.userId;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const moods = await Mood.find({
      userId,
      createdAt: { $gte: thirtyDaysAgo }
    });

    const moodCounts = {};
    const averageIntensity = moods.length > 0
      ? moods.reduce((sum, m) => sum + m.intensity, 0) / moods.length
      : 0;

    moods.forEach(m => {
      moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
    });

    res.status(200).json({
      stats: {
        totalRecordings: moods.length,
        averageIntensity: averageIntensity.toFixed(2),
        moodDistribution: moodCounts,
        period: '30 days'
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { recordMood, getWeeklyMoods, getMoodStats };
