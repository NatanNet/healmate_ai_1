import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useGoalStore } from '../stores/goalStore';

export default function GoalsPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const userName = user?.fullName || 'Natanel Putra';
  
  const { goals, createGoal, updateGoal, fetchGoals } = useGoalStore();
  const [newHabit, setNewHabit] = useState('');
  const [category, setCategory] = useState('Kesehatan Mental');

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newHabit.trim()) return;
    
    await createGoal({
      title: newHabit,
      category: category,
      status: 'active'
    });
    setNewHabit('');
  };

  const toggleStatus = async (goal) => {
    await updateGoal(goal._id, {
      ...goal,
      status: goal.status === 'completed' ? 'active' : 'completed'
    });
  };

  return (
    <div className="flex h-screen bg-[#F5F8F8] font-['Poppins'] text-[#333]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#113C3A] text-white flex flex-col pt-8 pb-6 px-4 shrink-0">
        <div className="flex items-center gap-3 px-4 mb-12">
          <i className="fas fa-heartbeat text-2xl text-[#22B2B0]"></i>
          <h1 className="text-xl font-bold">HealMate AI</h1>
        </div>

        <nav className="flex-1 space-y-2">
          <button onClick={() => navigate('/dashboard')} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-white/70 hover:bg-[#22B2B0]/10 transition-colors">
            <i className="fas fa-home w-5"></i>
            <span className="font-medium text-sm">Dashboard</span>
          </button>
          <button onClick={() => navigate('/capsule')} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-white/70 hover:bg-[#22B2B0]/10 transition-colors">
            <i className="fas fa-hourglass-half w-5"></i>
            <span className="font-medium text-sm">Time Capsule</span>
          </button>
          <button onClick={() => navigate('/goals')} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-[#22B2B0]/20 text-white transition-colors">
            <i className="fas fa-leaf w-5"></i>
            <span className="font-medium text-sm">Set Goals</span>
          </button>
        </nav>

        <button onClick={() => navigate('/chat')} className="w-full bg-[#22B2B0] text-white py-3 px-4 rounded-xl flex items-center justify-center gap-3 font-semibold mb-4 shadow-lg shadow-[#22B2B0]/30">
          <i className="fas fa-comments"></i> Curhat Sekarang
        </button>
        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-white/70 hover:bg-white/5 transition-colors">
          <i className="fas fa-sign-out-alt w-5"></i>
          <span className="font-medium text-sm">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-8 overflow-hidden">
        {/* Header */}
        <header className="flex justify-between items-center mb-6 shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-[#113C3A] mb-1">Halo, {userName.split(' ')[0]}! 👋</h2>
            <p className="text-gray-500 text-sm">Tidak apa-apa jika hari ini terasa berat.</p>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
            <img src={`https://ui-avatars.com/api/?name=${userName.replace(' ','+')}&background=113C3A&color=fff`} alt="Profile" className="w-8 h-8 rounded-full" />
            <span className="text-sm font-semibold text-[#113C3A]">{userName}</span>
          </div>
        </header>

        {/* Goals List Content */}
        <div className="flex-1 bg-white border border-gray-100 rounded-[2rem] shadow-sm p-8 flex flex-col">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#113C3A] mb-2">Langkah Pemulihan (Micro-Goals)</h2>
            <p className="text-sm text-gray-500">Depresi sering membuat kita kehilangan motivasi. Susun langkah kecil untuk mengembalikan rutinitas tanpa membebani mental.</p>
          </div>

          {/* Form Input Bar */}
          <form onSubmit={handleAdd} className="flex gap-4 mb-8 shrink-0">
            <input 
              type="text" 
              placeholder="Ketik kebiasaan kecil... (Cth: Minum air putih)" 
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              className="flex-1 bg-[#F9FAFA] border border-gray-200 rounded-full px-5 py-3 text-sm outline-none focus:border-[#22B2B0] transition-colors"
            />
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-[#F9FAFA] border border-gray-200 rounded-full px-5 py-3 text-sm outline-none text-gray-700 cursor-pointer w-48"
            >
              <option value="Kesehatan Mental">Kesehatan Mental</option>
              <option value="Aktivitas Fisik">Aktivitas Fisik</option>
              <option value="Fokus & Produktivitas">Fokus & Produktivitas</option>
            </select>
            <button type="submit" className="bg-[#22B2B0] hover:bg-[#1E9E9D] text-white px-6 py-3 rounded-full font-semibold transition-colors flex items-center gap-2 shadow-sm">
              <i className="fas fa-plus text-sm"></i> Tambah
            </button>
          </form>

          {/* Checklist */}
          <div className="flex-1 overflow-y-auto space-y-4">
            {goals.map((goal) => (
              <div key={goal._id} className="flex items-center justify-between border-b border-gray-50 pb-4">
                <label className="flex items-center gap-4 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-6 h-6 shrink-0">
                    <input 
                      type="checkbox" 
                      checked={goal.status === 'completed'}
                      onChange={() => toggleStatus(goal)}
                      className="peer appearance-none w-6 h-6 border-2 border-gray-300 rounded-md checked:bg-[#22B2B0] checked:border-[#22B2B0] transition-colors cursor-pointer"
                    />
                    <i className="fas fa-check absolute text-white text-xs opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"></i>
                  </div>
                  <span className={`text-sm select-none transition-all ${goal.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-700 group-hover:text-gray-900'}`}>
                    {goal.title}
                  </span>
                </label>
                <span className="bg-[#F0F8F8] text-[#113C3A] text-xs font-semibold px-4 py-1.5 rounded-full shrink-0">
                  {goal.category || 'Aktivitas'}
                </span>
              </div>
            ))}

            {/* Dummy Fallbacks if Store is empty */}
            {goals.length === 0 && (
              <>
                <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                  <label className="flex items-center gap-4 cursor-pointer group">
                    <div className="relative flex items-center justify-center w-6 h-6 shrink-0">
                      <input type="checkbox" className="peer appearance-none w-6 h-6 border-2 border-gray-300 rounded-md checked:bg-[#22B2B0] checked:border-[#22B2B0] transition-colors cursor-pointer" />
                      <i className="fas fa-check absolute text-white text-xs opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"></i>
                    </div>
                    <span className="text-sm text-gray-700 select-none">Jalan sore 15 menit tanpa pegang HP</span>
                  </label>
                  <span className="bg-[#F0F8F8] text-[#113C3A] text-xs font-semibold px-4 py-1.5 rounded-full shrink-0">Aktivitas Fisik</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                  <label className="flex items-center gap-4 cursor-pointer group">
                    <div className="relative flex items-center justify-center w-6 h-6 shrink-0">
                      <input type="checkbox" defaultChecked className="peer appearance-none w-6 h-6 border-2 border-gray-300 rounded-md checked:bg-[#22B2B0] checked:border-[#22B2B0] transition-colors cursor-pointer" />
                      <i className="fas fa-check absolute text-white text-xs opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"></i>
                    </div>
                    <span className="text-sm text-gray-400 line-through select-none">Latihan napas panjang 5 kali</span>
                  </label>
                  <span className="bg-[#F0F8F8] text-[#113C3A] text-xs font-semibold px-4 py-1.5 rounded-full shrink-0">Kesehatan Mental</span>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}