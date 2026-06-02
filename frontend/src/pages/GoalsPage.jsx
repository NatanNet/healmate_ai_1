import { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import goalService from '../services/goalService';

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchGoals = async () => {
    try {
      const data = await goalService.getGoals();
      setGoals(data);
    } catch (error) {
      console.error("Gagal memuat target");
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!newGoal.trim()) return;

    setIsLoading(true);
    try {
      await goalService.createGoal(newGoal);
      setNewGoal(''); 
      fetchGoals();   
    } catch (error) {
      console.error("Gagal menambah target");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (goalId, currentStatus) => {
    try {
      setGoals(goals.map(g => 
        g.id === goalId 
          ? { ...g, status: currentStatus === 'completed' ? 'active' : 'completed' } 
          : g
      ));
      await goalService.updateGoalStatus(goalId, currentStatus);
      fetchGoals();
    } catch (error) {
      console.error("Gagal mengubah status");
      fetchGoals(); 
    }
  };

  // Fungsi untuk hapus
  const handleDelete = async (goalId) => {
    if (!window.confirm('Yakin ingin menghapus target ini?')) return;
    try {
      await goalService.deleteGoal(goalId);
      fetchGoals();
    } catch (error) {
      console.error("Gagal menghapus target");
    }
  };

  // Fungsi untuk edit
  const handleEdit = async (goal) => {
    const newTitle = window.prompt("Edit Target Pemulihan:", goal.title);
    if (newTitle !== null && newTitle.trim() !== "" && newTitle !== goal.title) {
      try {
        await goalService.updateGoalDetail(goal.id, newTitle);
        fetchGoals();
      } catch (error) {
        console.error("Gagal mengedit target");
      }
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-2 sm:px-0">
        
        {/* Header Section */}
        <div className="bg-[#113C3A] rounded-3xl p-6 sm:p-8 text-white mb-6 sm:mb-8 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-[#22B2B0]/20 rounded-full blur-[60px] sm:blur-[80px]"></div>
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Target Pemulihan</h1>
            <p className="text-[#A7F3D0]/80 text-xs sm:text-sm leading-relaxed">
              Langkah kecil setiap hari membawamu lebih dekat pada ketenangan. Centang targetmu dan dapatkan bonus energi pemulihan!
            </p>
          </div>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 mb-6 sm:mb-8">
          {/* Ubah flex menjadi flex-col di HP, dan flex-row di layar lebih besar (sm) */}
          <form onSubmit={handleAddGoal} className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="Contoh: Jalan pagi 15 menit..."
              className="flex-1 w-full bg-[#F9FAFA] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#22B2B0] focus:ring-1 focus:ring-[#22B2B0]"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={isLoading || !newGoal.trim()}
              className="w-full sm:w-auto bg-[#22B2B0] hover:bg-[#1E9E9D] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Menyimpan...' : 'Tambah Target'}
            </button>
          </form>
        </div>

        {/* List Target */}
        <div className="space-y-3">
          {goals.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-200">
              <i className="fas fa-clipboard-list text-4xl text-gray-300 mb-3"></i>
              <p className="text-gray-500 text-xs sm:text-sm px-4">Belum ada target. Yuk, buat langkah pertamamu hari ini!</p>
            </div>
          ) : (
            goals.map((goal) => (
              <div 
                key={goal.id} 
                // Di layar HP, elemen menumpuk ke bawah (flex-col). Di layar besar, sejajar (sm:flex-row)
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all gap-4 sm:gap-0 ${
                  goal.status === 'completed' 
                    ? 'bg-[#E8F6F6]/50 border-[#22B2B0]/30' 
                    : 'bg-white border-gray-100 shadow-sm'
                }`}
              >
                {/* Bagian Kiri: Checkbox & Teks */}
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1">
                  <button 
                    onClick={() => handleToggle(goal.id, goal.status)}
                    className={`mt-0.5 sm:mt-0 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      goal.status === 'completed'
                        ? 'bg-[#22B2B0] border-[#22B2B0] text-white'
                        : 'border-gray-300 hover:border-[#22B2B0]'
                    }`}
                  >
                    {goal.status === 'completed' && <i className="fas fa-check text-xs"></i>}
                  </button>
                  
                  <span className={`text-sm font-medium leading-relaxed break-words ${goal.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                    {goal.title}
                  </span>
                </div>
                
                {/* Bagian Kanan: Aksi Edit, Hapus, dan Label Bonus */}
                {/* Di HP, tombol digeser sedikit ke kanan (ml-9) agar sejajar dengan teks, bukan checkbox */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-9 sm:ml-4">
                  {goal.status === 'completed' ? (
                    <span className="text-[10px] font-bold text-[#22B2B0] bg-[#E8F6F6] px-2 py-1 rounded-md">
                      +2% Energi
                    </span>
                  ) : (
                    <>
                      <button 
                        onClick={() => handleEdit(goal)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 bg-gray-50 hover:bg-blue-50 hover:text-blue-500 transition-colors"
                        title="Edit Target"
                      >
                        <i className="fas fa-pen text-xs"></i>
                      </button>
                      <button 
                        onClick={() => handleDelete(goal.id)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 bg-gray-50 hover:bg-red-50 hover:text-red-500 transition-colors"
                        title="Hapus Target"
                      >
                        <i className="fas fa-trash text-xs"></i>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </MainLayout>
  );
}