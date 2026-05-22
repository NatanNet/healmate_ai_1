import { useState, useEffect } from 'react';
import { MainLayout, Card, Button, Input } from '../components';
import { useMoodStore } from '../stores/moodStore';
import moodService from '../services/moodService';

export default function MoodPage() {
  const { weeklyMoods, stats, setWeeklyMoods, setStats, addMood, setLoading } = useMoodStore();
  const [mood, setMood] = useState('normal');
  const [intensity, setIntensity] = useState(5);
  const [notes, setNotes] = useState('');
  const [loading, setLoadingState] = useState(false);

  useEffect(() => {
    fetchMoodData();
  }, []);

  const fetchMoodData = async () => {
    try {
      setLoading(true);
      const moods = await moodService.getWeeklyMoods();
      const statsData = await moodService.getMoodStats();
      setWeeklyMoods(moods.moods);
      setStats(statsData.stats);
    } catch (error) {
      console.error('Failed to fetch mood data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordMood = async (e) => {
    e.preventDefault();
    try {
      setLoadingState(true);
      const response = await moodService.recordMood({
        mood,
        intensity,
        notes
      });
      addMood(response.mood);
      setNotes('');
      fetchMoodData();
    } catch (error) {
      console.error('Failed to record mood:', error);
    } finally {
      setLoadingState(false);
    }
  };

  const moodEmojis = {
    sangat_sedih: '😢',
    sedih: '😟',
    normal: '😐',
    bahagia: '😊',
    sangat_bahagia: '😄'
  };

  return (
    <MainLayout title="Mood Tracker">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Record Mood Form */}
        <Card className="lg:col-span-1">
          <h2 className="text-xl font-bold text-primary-dark mb-4">Record Mood</h2>
          <form onSubmit={handleRecordMood} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mood
              </label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light"
              >
                <option value="sangat_sedih">😢 Sangat Sedih</option>
                <option value="sedih">😟 Sedih</option>
                <option value="normal">😐 Normal</option>
                <option value="bahagia">😊 Bahagia</option>
                <option value="sangat_bahagia">😄 Sangat Bahagia</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Intensity: {intensity}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={intensity}
                onChange={(e) => setIntensity(parseInt(e.target.value))}
                disabled={loading}
                className="w-full"
              />
            </div>

            <Input
              type="text"
              placeholder="Catatan (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={loading}
            />

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Recording...' : 'Record Mood'}
            </Button>
          </form>
        </Card>

        {/* Stats */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <h2 className="text-xl font-bold text-primary-dark mb-4">30-Day Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Total Records</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats?.totalRecordings || 0}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Avg Intensity</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats?.averageIntensity || '0'}/10
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-bold text-primary-dark mb-3">Mood Distribution</h2>
            <div className="space-y-2">
              {stats?.moodDistribution && Object.entries(stats.moodDistribution).map(([moodType, count]) => (
                <div key={moodType} className="flex items-center justify-between">
                  <span className="text-lg">
                    {moodEmojis[moodType]} {moodType.replace(/_/g, ' ').toUpperCase()}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-light"
                        style={{
                          width: `${(count / (stats.totalRecordings || 1)) * 100}%`
                        }}
                      />
                    </div>
                    <span className="font-semibold text-gray-700">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Moods */}
      <Card>
        <h2 className="text-xl font-bold text-primary-dark mb-4">This Week</h2>
        <div className="space-y-2">
          {weeklyMoods.length === 0 ? (
            <p className="text-gray-400">No mood records this week yet</p>
          ) : (
            weeklyMoods.map((moodEntry, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                <p className="font-semibold">
                  {moodEmojis[moodEntry.mood]} {moodEntry.mood.replace(/_/g, ' ')} - Intensity: {moodEntry.intensity}/10
                </p>
                {moodEntry.notes && <p className="text-gray-600 text-sm">{moodEntry.notes}</p>}
                <p className="text-xs text-gray-500">
                  {new Date(moodEntry.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </Card>
    </MainLayout>
  );
}
