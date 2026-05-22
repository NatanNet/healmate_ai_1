import { useState, useEffect } from 'react';
import { MainLayout, Card, Button, Modal, Input } from '../components';
import { useGoalStore } from '../stores/goalStore';

const GOAL_CATEGORIES = [
  { id: 'emotional-healing', name: 'Emotional Healing', icon: 'fa-heart', color: 'from-red-400 to-pink-400', bgColor: 'bg-red-50', desc: 'Pemulihan emosional' },
  { id: 'physical-wellness', name: 'Physical Wellness', icon: 'fa-dumbbell', color: 'from-green-400 to-emerald-400', bgColor: 'bg-green-50', desc: 'Kesehatan fisik' },
  { id: 'mental-health', name: 'Mental Health', icon: 'fa-brain', color: 'from-blue-400 to-cyan-400', bgColor: 'bg-blue-50', desc: 'Kesehatan mental' },
  { id: 'personal-growth', name: 'Personal Growth', icon: 'fa-seedling', color: 'from-purple-400 to-violet-400', bgColor: 'bg-purple-50', desc: 'Pertumbuhan personal' },
  { id: 'relationships', name: 'Relationships', icon: 'fa-people-group', color: 'from-pink-400 to-rose-400', bgColor: 'bg-pink-50', desc: 'Hubungan sosial' }
];

export default function GoalsPage() {
  const { goals, loading, createGoal, updateGoal, deleteGoal, updateProgress, fetchGoals } = useGoalStore();
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    dueDate: '',
    milestones: []
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Judul goal tidak boleh kosong';
    if (!formData.category) newErrors.category = 'Pilih kategori goal';
    if (!formData.dueDate) newErrors.dueDate = 'Tentukan tanggal target';
    return newErrors;
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await createGoal(formData);
      setFormData({ title: '', description: '', category: '', priority: 'medium', dueDate: '', milestones: [] });
      setEditingGoal(null);
      setShowModal(false);
      setErrors({});
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  const handleEditGoal = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await updateGoal(editingGoal._id, formData);
      setFormData({ title: '', description: '', category: '', priority: 'medium', dueDate: '', milestones: [] });
      setEditingGoal(null);
      setShowModal(false);
      setErrors({});
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  const openCreateModal = () => {
    setEditingGoal(null);
    setFormData({ title: '', description: '', category: '', priority: 'medium', dueDate: '', milestones: [] });
    setErrors({});
    setShowModal(true);
  };

  const openEditModal = (goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description || '',
      category: goal.category,
      priority: goal.priority || 'medium',
      dueDate: goal.dueDate?.split('T')[0] || '',
      milestones: goal.milestones || []
    });
    setErrors({});
    setShowModal(true);
  };

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');
  const getCategoryInfo = (categoryId) => GOAL_CATEGORIES.find(c => c.id === categoryId);

  return (
    <MainLayout title="Personal Goals">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#20A4A0] to-[#147A77] text-white rounded-2xl p-6 md:p-8 mb-8 shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Personal Goals</h1>
        <p className="text-white/90 text-sm md:text-base leading-relaxed">
          Tetapkan tujuan untuk pemulihan dan pertumbuhan personal Anda. Setiap goal yang tercapai adalah langkah menuju versi terbaik diri Anda.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <div className="text-center p-4 md:p-6">
            <div className="text-2xl md:text-3xl font-bold text-[#20A4A0] mb-2">{activeGoals.length}</div>
            <p className="text-sm md:text-base text-gray-600 font-medium">Active Goals</p>
            <p className="text-xs text-gray-500 mt-1">sedang berjalan</p>
          </div>
        </Card>
        <Card>
          <div className="text-center p-4 md:p-6">
            <div className="text-2xl md:text-3xl font-bold text-[#22D1D1] mb-2">{completedGoals.length}</div>
            <p className="text-sm md:text-base text-gray-600 font-medium">Completed</p>
            <p className="text-xs text-gray-500 mt-1">selesai</p>
          </div>
        </Card>
        <Card>
          <div className="text-center p-4 md:p-6">
            <div className="text-2xl md:text-3xl font-bold text-[#0E3B3A] mb-2">{goals.length}</div>
            <p className="text-sm md:text-base text-gray-600 font-medium">Total Goals</p>
            <p className="text-xs text-gray-500 mt-1">keseluruhan</p>
          </div>
        </Card>
        <Card>
          <div className="text-center p-4 md:p-6">
            <div className="text-2xl md:text-3xl font-bold text-[#FFEAA7] mb-2">
              {goals.length > 0 ? Math.round((completedGoals.length / goals.length) * 100) : 0}%
            </div>
            <p className="text-sm md:text-base text-gray-600 font-medium">Completion</p>
            <p className="text-xs text-gray-500 mt-1">pencapaian</p>
          </div>
        </Card>
      </div>

      {/* Create Goal Button */}
      <div className="mb-8 flex justify-end">
        <button
          onClick={openCreateModal}
          className="px-6 md:px-8 py-3 bg-gradient-to-r from-[#20A4A0] to-[#22D1D1] text-white font-semibold rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2 text-sm md:text-base"
        >
          <i className="fas fa-plus"></i> Create New Goal
        </button>
      </div>

      {/* Goal Categories */}
      <Card className="mb-8">
        <h3 className="text-lg md:text-xl font-bold text-[#0E3B3A] mb-6">Goal Categories</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
          {GOAL_CATEGORIES.map((cat) => (
            <div key={cat.id} className={`${cat.bgColor} p-4 md:p-5 rounded-xl text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer group border-2 border-transparent hover:border-gray-200`}>
              <div className={`text-2xl md:text-3xl mb-3 flex justify-center`}>
                <i className={`fas ${cat.icon} text-[#0E3B3A]`}></i>
              </div>
              <p className="font-semibold text-xs md:text-sm text-[#0E3B3A] mb-1">{cat.name}</p>
              <p className="text-xs text-gray-600">{cat.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Active Goals */}
      <Card className="mb-8">
        <h3 className="text-lg md:text-xl font-bold text-[#0E3B3A] mb-6">Active Goals</h3>
        {activeGoals.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <i className="fas fa-inbox text-4xl mb-3 block opacity-50"></i>
            <p className="text-sm md:text-base">Belum ada goal aktif. Mari membuat goal pertama Anda!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeGoals.map((goal) => {
              const category = getCategoryInfo(goal.category);
              const progress = goal.progress || 0;
              return (
                <div key={goal._id} className="bg-gradient-to-r from-white to-[#F8FAFB] border-2 border-gray-200 hover:border-[#20A4A0] rounded-xl p-5 md:p-6 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`bg-gradient-to-br ${category?.color} text-white p-3 rounded-lg flex-shrink-0 text-lg md:text-xl h-12 w-12 flex items-center justify-center`}>
                        <i className={`fas ${category?.icon}`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm md:text-lg text-[#0E3B3A] mb-1 break-words">{goal.title}</h4>
                        <p className="text-xs md:text-sm text-gray-600 mb-2 line-clamp-2">{goal.description}</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${goal.priority === 'high' ? 'bg-red-100 text-red-700' : goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                            {goal.priority === 'high' ? 'High Priority' : goal.priority === 'medium' ? 'Medium Priority' : 'Low Priority'}
                          </span>
                          <span className="text-xs text-gray-500">
                            <i className="fas fa-calendar mr-1"></i>
                            {new Date(goal.dueDate).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0 ml-3">
                      <button
                        onClick={() => openEditModal(goal)}
                        className="p-2 text-[#20A4A0] hover:bg-[#20A4A0]/10 rounded-lg transition-all hover:scale-110"
                        title="Edit goal"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => deleteGoal(goal._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all hover:scale-110"
                        title="Delete goal"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="mt-4 bg-white p-4 rounded-lg border border-gray-100">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs md:text-sm font-bold text-gray-700">Progress</span>
                      <span className="text-sm md:text-base font-bold text-[#20A4A0]">{progress}%</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-3">
                      <div
                        className="bg-gradient-to-r from-[#20A4A0] to-[#22D1D1] h-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>

                    {/* Progress Slider */}
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={progress}
                        onChange={(e) => updateProgress(goal._id, parseInt(e.target.value))}
                        className="flex-1 h-2 bg-gray-200 rounded-full cursor-pointer appearance-none"
                        style={{
                          background: `linear-gradient(to right, #20A4A0 0%, #20A4A0 ${progress}%, #e5e7eb ${progress}%, #e5e7eb 100%)`
                        }}
                      />
                      <span className="text-sm font-bold text-gray-700 min-w-12 text-right">{progress}%</span>
                    </div>

                    {/* Progress Status */}
                    <div className="mt-3 text-xs text-gray-600">
                      {progress === 0 && <span className="text-blue-600">Belum dimulai</span>}
                      {progress > 0 && progress < 50 && <span className="text-yellow-600">Dalam progress</span>}
                      {progress >= 50 && progress < 100 && <span className="text-orange-600">Hampir selesai</span>}
                      {progress === 100 && <span className="text-green-600 font-semibold">Selesai!</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <Card>
          <h3 className="text-lg md:text-xl font-bold text-[#0E3B3A] mb-6">Completed Goals</h3>
          <div className="space-y-3">
            {completedGoals.map((goal) => {
              const category = getCategoryInfo(goal.category);
              return (
                <div key={goal._id} className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 md:p-5 flex items-center justify-between hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`bg-gradient-to-br ${category?.color} text-white p-3 rounded-lg h-10 w-10 flex items-center justify-center flex-shrink-0`}>
                      <i className={`fas ${category?.icon}`}></i>
                    </div>
                    <div>
                      <p className="font-bold text-sm md:text-base text-[#0E3B3A]">{goal.title}</p>
                      <p className="text-xs text-gray-600">Selesai: {new Date(goal.completedAt).toLocaleDateString('id-ID')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <i className="fas fa-check-circle text-2xl text-green-500"></i>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Create/Edit Goal Modal */}
      <Modal
        isOpen={showModal}
        title={editingGoal ? 'Edit Goal' : 'Create New Goal'}
        onClose={() => setShowModal(false)}
      >
        <form onSubmit={editingGoal ? handleEditGoal : handleCreateGoal} className="space-y-4">
          <Input
            label="Goal Title *"
            type="text"
            placeholder="e.g., Olahraga 3x seminggu"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={errors.title}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20A4A0]"
            >
              <option value="">-- Pilih Kategori --</option>
              {GOAL_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>

          <Input
            label="Description"
            type="text"
            placeholder="Deskripsi detail goal Anda..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20A4A0]"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <Input
              label="Due Date *"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              error={errors.dueDate}
            />
          </div>

          {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-[#20A4A0] to-[#22D1D1] text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : editingGoal ? 'Update Goal' : 'Create Goal'}
            </button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
}
