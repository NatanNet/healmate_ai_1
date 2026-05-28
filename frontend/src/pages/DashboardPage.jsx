import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useChatStore } from '../stores/chatStore';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const userName = user?.fullName || 'Pengguna HealMate';

  // Mengambil emosi terakhir dari chat
  const latestEmotion = useChatStore((state) => state.latestEmotion);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Fungsi untuk membuat inisial dinamis (misal "Natanel Putra" -> "NP")
  const getInitials = (name) => {
    const parts = name.split(' ');
    if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0] ? parts[0][0].toUpperCase() : 'U';
  };

  // 1. Ubah moodData menjadi State agar bisa diubah secara dinamis
  const [moodData, setMoodData] = useState([
    { day: 'Sen', height: 80, type: 'anger' },
    { day: 'Sel', height: 65, type: 'anxiety' },
    { day: 'Rab', height: 50, type: 'anxiety' },
    { day: 'Kam', height: 0, type: 'empty' }, 
    { day: 'Jum', height: 0, type: 'empty' },       
    { day: 'Sab', height: 0, type: 'empty' },
    { day: 'Min', height: 0, type: 'empty' }
  ]);

  // 2. Gunakan useEffect untuk menimpa data grafik HARI INI dengan emosi dari AI
  useEffect(() => {
    if (latestEmotion) {
      const daysId = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
      const today = daysId[new Date().getDay()]; // Mendapatkan hari ini (misal: 'Kam')

      setMoodData((prevData) => 
        prevData.map((item) => {
          if (item.day === today) {
            // Update bar chart hari ini: tinggi otomatis 85 (bisa disesuaikan), type dari NLP
            return { ...item, height: 85, type: latestEmotion.toLowerCase() };
          }
          return item;
        })
      );
    }
  }, [latestEmotion]);

  const getBarColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'anger':
        return 'bg-[#FF6B6B] shadow-[0_0_10px_rgba(255,107,107,0.4)]'; 
      case 'anxiety':
        return 'bg-[#FFB938] shadow-[0_0_10px_rgba(255,185,56,0.4)]'; 
      case 'acceptance':
        return 'bg-[#22B2B0] shadow-[0_0_10px_rgba(34,178,176,0.4)]'; 
      default:
        return 'bg-transparent';
    }
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
          <button onClick={() => navigate('/dashboard')} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-[#22B2B0]/20 text-white transition-colors">
            <i className="fas fa-home w-5"></i>
            <span className="font-medium text-sm">Dashboard</span>
          </button>
          <button onClick={() => navigate('/capsule')} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-white/70 hover:bg-[#22B2B0]/10 transition-colors">
            <i className="fas fa-hourglass-half w-5"></i>
            <span className="font-medium text-sm">Time Capsule</span>
          </button>
          <button onClick={() => navigate('/goals')} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-white/70 hover:bg-[#22B2B0]/10 transition-colors">
            <i className="fas fa-leaf w-5"></i>
            <span className="font-medium text-sm">Set Goals</span>
          </button>
        </nav>

        <button onClick={() => navigate('/chat')} className="w-full bg-[#22B2B0] text-white py-3 px-4 rounded-xl flex items-center justify-center gap-3 font-semibold mb-4 shadow-lg shadow-[#22B2B0]/30">
          <i className="fas fa-comments"></i> Curhat Sekarang
        </button>
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-white/70 hover:bg-white/5 transition-colors"
        >
          <i className="fas fa-sign-out-alt w-5"></i>
          <span className="font-medium text-sm">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-8 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-[#113C3A] mb-1">Halo, {userName.split(' ')[0]}! 👋</h2>
            <div className="flex items-center gap-2">
              <p className="text-gray-500 text-sm">Tidak apa-apa jika hari ini terasa berat.</p>
              {/* Indikator Emosi Dinamis */}
              {latestEmotion && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold text-white ${getBarColor(latestEmotion)}`}>
                  Sedang {latestEmotion}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
            {/* Inisial Dinamis */}
            <div className="w-8 h-8 rounded-full bg-[#113C3A] text-white flex items-center justify-center text-xs font-bold">
              {getInitials(userName)}
            </div>
            <span className="text-sm font-semibold text-[#113C3A]">{userName}</span>
          </div>
        </header>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button onClick={() => navigate('/chat')} className="bg-gradient-to-br from-[#22B2B0] to-[#1E9E9D] p-6 rounded-3xl flex flex-col justify-center items-center text-white shadow-md hover:scale-[1.02] transition-transform">
            <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-3">
              <i className="fas fa-robot text-2xl"></i>
            </div>
            <h3 className="font-semibold text-lg">HealMate Partner</h3>
            <p className="text-white/80 text-xs mt-1">Mulai sesi curhat AI sekarang</p>
          </button>

          <div className="bg-white border border-gray-100 p-6 rounded-3xl flex items-center gap-5 shadow-sm">
            <div className="bg-[#E8F6F6] text-[#22B2B0] w-14 h-14 rounded-2xl flex items-center justify-center shrink-0">
              <i className="fas fa-lock text-2xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Kapsul Tersimpan</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[#113C3A]">2</span>
                <span className="text-xs text-[#22B2B0] font-medium">Menunggu dibuka</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-6 rounded-3xl flex items-center gap-5 shadow-sm">
            <div className="bg-[#E8F6F6] text-[#22B2B0] w-14 h-14 rounded-full flex items-center justify-center shrink-0">
              <i className="fas fa-check-circle text-2xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Target Pemulihan</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[#113C3A]">12/15</span>
                <span className="text-xs text-[#22B2B0] font-medium">Selesai minggu ini!</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
          
          {/* Chart */}
          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-gray-800">Grafik Emotion</h3>
              
              <div className="flex items-center gap-4 text-xs font-semibold text-gray-600">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#FF6B6B] shadow-sm"></span> Anger</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#FFB938] shadow-sm"></span> Anxiety</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#22B2B0] shadow-sm"></span> Acceptance</span>
              </div>
            </div>

            <div className="flex-1 flex items-end justify-between px-4 bg-[#F9FAFA] rounded-2xl p-6 border border-gray-50">
              {moodData.map((data, idx) => (
                <div key={idx} className="flex flex-col items-center gap-4 w-full">
                  {data.height > 0 && (
                    <span className="text-[10px] font-bold text-gray-400 opacity-0 hover:opacity-100 transition-opacity cursor-default -mb-2 capitalize">
                      {data.type}
                    </span>
                  )}
                  <div 
                    className={`w-8 rounded-full transition-all duration-500 ${getBarColor(data.type)}`} 
                    style={{ 
                      height: `${data.height}px`, 
                      minHeight: data.height > 0 ? '40px' : '0' 
                    }}
                  ></div>
                  <span className="text-xs font-semibold text-gray-500">{data.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Wait List Capsules */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-6">Kapsul Menunggu</h3>
            <div className="space-y-4">
              <div className="bg-[#F9FAFA] border border-gray-100 p-4 rounded-2xl flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#113C3A] mb-1">"Untuk Aku di Akhir Tahun"</h4>
                  <p className="text-xs text-gray-500">Bisa dibuka: 31 Des 2026</p>
                </div>
                <i className="fas fa-clock text-gray-400 mt-1"></i>
              </div>
              <div className="bg-[#F9FAFA] border border-gray-100 p-4 rounded-2xl flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#113C3A] mb-1">"Surat Pelepasan Emosi"</h4>
                  <p className="text-xs text-gray-500">Bisa dibuka: 15 Ags 2026</p>
                </div>
                <i className="fas fa-clock text-gray-400 mt-1"></i>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}