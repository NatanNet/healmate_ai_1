import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChatStore } from '../stores/chatStore';
import goalService from '../services/goalService';
import api from '../services/api';
import MainLayout from '../components/MainLayout';

export default function DashboardPage() {
  const navigate = useNavigate();
  const latestEmotion = useChatStore((state) => state.latestEmotion);

  const [capsulesCount, setCapsulesCount] = useState(0);
  const [waitingCapsules, setWaitingCapsules] = useState([]);
  const [goalsStats, setGoalsStats] = useState({ completed: 0, total: 0 });
  const [healingProgress, setHealingProgress] = useState(45); 
  const [showBaselineModal, setShowBaselineModal] = useState(false);

  // [BARU] State untuk melacak mundur berapa minggu (0 = minggu ini, 1 = 1 minggu lalu, dst)
  const [weeksAgo, setWeeksAgo] = useState(0);

  const [moodData, setMoodData] = useState([
    { day: 'Sen', height: 0, type: 'empty' },
    { day: 'Sel', height: 0, type: 'empty' },
    { day: 'Rab', height: 0, type: 'empty' },
    { day: 'Kam', height: 0, type: 'empty' }, 
    { day: 'Jum', height: 0, type: 'empty' },       
    { day: 'Sab', height: 0, type: 'empty' },
    { day: 'Min', height: 0, type: 'empty' }
  ]);

  const handleBaselineSelect = async (phaseName, rawScore) => {
    try {
      await api.post('/auth/baseline', {
        phaseName: phaseName,
        healingScore: rawScore
      });
      
      setShowBaselineModal(false);
      window.location.reload(); 
    } catch (error) {
      console.error("Gagal menyimpan data fase awal:", error);
    }
  };

  const scaleHealingScore = (rawScore) => {
    const clampedScore = Math.max(-0.5, Math.min(1.0, rawScore));
    return Math.round(((clampedScore + 0.5) * 100) / 1.5);
  };

  const getPhaseData = (progress) => {
    if (progress <= 20) return { 
      name: 'Sangat Terluka', 
      color: 'text-[#FF6B6B]', 
      desc: 'Sangat wajar jika kamu masih merasa hancur. Luapkan saja perlahan, HealMate ada di sini untuk mendengarkan.' 
    };
    if (progress <= 40) return { 
      name: 'Memproses Luka', 
      color: 'text-[#FFB938]', 
      desc: 'Kamu mulai memproses rasa sakit ini. Kadang merasa kuat, kadang teringat lagi. Bertahanlah, ini bagian dari proses.' 
    };
    if (progress <= 60) return { 
      name: 'Mulai Pulih', 
      color: 'text-[#FDE047]', 
      desc: 'Rasa sakit itu mulai mereda. Kamu sudah bisa melihat hari depan dengan sedikit lebih tenang dan jernih.' 
    };
    if (progress <= 80) return { 
      name: 'Bertumbuh', 
      color: 'text-[#A7F3D0]', 
      desc: 'Luar biasa! Kamu mulai menggunakan pengalaman ini untuk belajar dan menjadi versi dirimu yang lebih baik.' 
    };
    return { 
      name: 'Berdamai', 
      color: 'text-[#22B2B0]', 
      desc: 'Selamat, kamu telah berdamai dengan keadaan. Terus melangkah maju, kamu sudah jauh lebih kuat dari sebelumnya.' 
    };
  };

  const currentPhase = getPhaseData(healingProgress);
  const safeProgress = Math.max(4, Math.min(96, healingProgress));

  // [BARU] Memisahkan fetchMoodData ke useEffect tersendiri agar bereaksi pada perubahan weeksAgo
  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        // Mengirimkan parameter ?weeksAgo= ke backend
        const emotionResponse = await api.get(`/mood/weekly?weeksAgo=${weeksAgo}`);
        
        if (emotionResponse.data && Array.isArray(emotionResponse.data) && emotionResponse.data.length > 0) {
          setMoodData(emotionResponse.data);
        } else {
          // Jika kosong/tidak ada data untuk minggu tersebut, tampilkan grafik kosong
          setMoodData([
            { day: 'Sen', height: 0, type: 'empty' },
            { day: 'Sel', height: 0, type: 'empty' },
            { day: 'Rab', height: 0, type: 'empty' },
            { day: 'Kam', height: 0, type: 'empty' }, 
            { day: 'Jum', height: 0, type: 'empty' },       
            { day: 'Sab', height: 0, type: 'empty' },
            { day: 'Min', height: 0, type: 'empty' }
          ]);
        }
      } catch (error) {
        console.error('Gagal memuat grafik dari database:', error);
      }
    };

    fetchMoodData();
  }, [weeksAgo]); // <-- Trigger ulang setiap tombol minggu ditekan

  // useEffect utama untuk data lain (tidak akan me-render ulang saat grafik berpindah minggu)
  useEffect(() => {
    const fetchGoalsData = async () => {
      try {
        const goals = await goalService.getGoals();
        if (Array.isArray(goals)) {
          const completed = goals.filter(g => g.status === 'completed' || g.progress === 100).length;
          setGoalsStats({ completed, total: goals.length });
        }
      } catch (error) {}
    };

    const fetchCapsulesData = async () => {
      try {
        const capsuleResponse = await api.get('/timecapsule/'); 
        let dataKapsul = [];
        if (capsuleResponse.data && Array.isArray(capsuleResponse.data.timecapsules)) {
          dataKapsul = capsuleResponse.data.timecapsules;
        }
        setCapsulesCount(dataKapsul.length);
        const today = new Date();
        const waiting = dataKapsul.filter(c => new Date(c.openDate) > today);
        setWaitingCapsules(waiting);
      } catch (error) {
        console.error('Gagal memuat kapsul:', error);
      }
    };

    const fetchHealingScore = async () => {
      try {
        let averageAiScore = 0;
        const chatResponse = await api.get('/chat/history?limit=10000');
        
        if (chatResponse.data && chatResponse.data.chats && chatResponse.data.chats.length > 0) {
          const chats = chatResponse.data.chats;
          let totalScore = 0;
          let validChatCount = 0;

          chats.forEach(chat => {
            if (chat.healingScore !== undefined && chat.healingScore !== null) {
              if (chat.intent === 'baseline') {
                totalScore += (chat.healingScore * 20); 
                validChatCount += 20;
              } else {
                totalScore += chat.healingScore;
                validChatCount++;
              }
            }
          });

          if (validChatCount > 0) {
            averageAiScore = totalScore / validChatCount;
          }
        }

        const scaledAiScore = scaleHealingScore(averageAiScore);
        let bonusScore = 0;
        const goals = await goalService.getGoals();
        
        if (Array.isArray(goals)) {
          const completedCount = goals.filter(g => g.status === 'completed' || g.progress === 100).length;
          bonusScore = completedCount * 5; 
        }

        const profileResponse = await api.get('/auth/me');
        const userData = profileResponse.data;
        if (userData && userData.hasSetBaseline === false) {
          setShowBaselineModal(true); 
        }

        let finalProgress = scaledAiScore + bonusScore;
        finalProgress = Math.max(0, Math.min(100, finalProgress));

        setHealingProgress(finalProgress);
      } catch (error) {
        console.error('Gagal memuat kalkulasi total healing score:', error);
      }
    };

    fetchGoalsData();
    fetchCapsulesData();
    fetchHealingScore();
  }, []);

  const getBarColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'anger': return 'bg-[#FF6B6B] shadow-[0_0_10px_rgba(255,107,107,0.4)]'; 
      case 'anxiety': return 'bg-[#FFB938] shadow-[0_0_10px_rgba(255,185,56,0.4)]'; 
      case 'acceptance': return 'bg-[#22B2B0] shadow-[0_0_10px_rgba(34,178,176,0.4)]'; 
      default: return 'bg-transparent';
    }
  };

  const getTextColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'anger': return 'text-[#FF6B6B]'; 
      case 'anxiety': return 'text-[#FFB938]'; 
      case 'acceptance': return 'text-[#22B2B0]'; 
      default: return 'text-gray-400';
    }
  };

  return (
    <MainLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <button onClick={() => navigate('/chat')} className="bg-gradient-to-br from-[#22B2B0] to-[#1E9E9D] p-5 rounded-3xl flex flex-col justify-center items-center text-white shadow-md hover:scale-[1.02] transition-transform text-center">
          <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center mb-2">
            <i className="fas fa-robot text-xl"></i>
          </div>
          <h3 className="font-semibold text-base">HealMate Partner</h3>
          <p className="text-white/80 text-[11px] mt-1">Mulai sesi curhat AI sekarang</p>
        </button>

        <div className="bg-white border border-gray-100 p-5 rounded-3xl flex items-center gap-4 shadow-sm">
          <div className="bg-[#E8F6F6] text-[#22B2B0] w-12 h-12 rounded-2xl flex items-center justify-center shrink-0">
            <i className="fas fa-lock text-xl"></i>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">Kapsul Tersimpan</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#113C3A]">{capsulesCount}</span>
              <span className="text-[10px] text-[#22B2B0] font-medium">Total kapsul</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-5 rounded-3xl flex items-center gap-4 shadow-sm">
          <div className="bg-[#E8F6F6] text-[#22B2B0] w-12 h-12 rounded-full flex items-center justify-center shrink-0">
            <i className="fas fa-check-circle text-xl"></i>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">Target Pemulihan</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#113C3A]">
                {goalsStats.total > 0 ? `${goalsStats.completed}/${goalsStats.total}` : '0/0'}
              </span>
              <span className="text-[10px] text-[#22B2B0] font-medium">Selesai minggu ini!</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#113C3A] p-5 md:p-6 rounded-3xl shadow-lg relative overflow-hidden mb-5 border border-[#22B2B0]/20">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#22B2B0]/10 rounded-full blur-[60px]"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
          <div className="flex-1">
            <h3 className="text-[#A7F3D0]/80 font-medium mb-1 text-xs md:text-sm flex items-center gap-2">
              <i className="fas fa-compass"></i> Titik Pemulihanmu Saat Ini:
            </h3>
            <h2 className={`text-xl md:text-2xl font-bold mb-2 ${currentPhase.color}`}>
              {currentPhase.name}
            </h2>
            <p className="text-white/80 text-xs leading-relaxed max-w-md">
              {currentPhase.desc}
            </p>
          </div>

          <div className="flex-1 w-full pt-2 md:pt-0 pb-2 md:pb-0">
            <div className="relative w-full">
              <div className="flex justify-between w-full mb-2 px-1">
                <div className="flex-1 text-center">
                  <span className="text-[7px] sm:text-[9px] md:text-[10px] font-bold text-[#FF6B6B] tracking-wide uppercase block leading-tight">
                    SANGAT<br className="block md:hidden"/> TERLUKA
                  </span>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-[7px] sm:text-[9px] md:text-[10px] font-bold text-[#FFB938] tracking-wide uppercase block leading-tight">
                    MEMPROSES<br className="block md:hidden"/> LUKA
                  </span>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-[7px] sm:text-[9px] md:text-[10px] font-bold text-[#FDE047] tracking-wide uppercase block leading-tight">
                    MULAI<br className="block md:hidden"/> PULIH
                  </span>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-[7px] sm:text-[9px] md:text-[10px] font-bold text-[#A7F3D0] tracking-wide uppercase block leading-tight">
                    BERTUMBUH
                  </span>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-[7px] sm:text-[9px] md:text-[10px] font-bold text-[#22B2B0] tracking-wide uppercase block leading-tight">
                    BERDAMAI
                  </span>
                </div>
              </div>

              <div className="relative w-full h-3.5 bg-[#0A2423] rounded-full shadow-inner border border-white/5">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF6B6B] via-[#FFB938] to-[#22B2B0] opacity-90 shadow-[0_0_10px_rgba(255,185,56,0.2)]"></div>
                <div className="absolute inset-0">
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-[#113C3A] rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(34,178,176,0.6)] border-2 border-[#A7F3D0] transition-all duration-1000 ease-out z-20"
                    style={{ left: `${safeProgress}%` }}
                  >
                    <i className="fas fa-heart text-[#A7F3D0] text-xs animate-pulse"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-5 shadow-sm flex flex-col">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
            
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-bold text-gray-800 text-sm">Grafik Emosi Dominan</h3>
              
              {/* =========================================================
                  [BARU] Kontrol Navigasi Mundur/Maju Minggu
                  ========================================================= */}
              <div className="flex items-center bg-[#F9FAFA] border border-gray-200 rounded-full px-2 py-1 shadow-sm">
                <button 
                  onClick={() => setWeeksAgo(prev => prev + 1)}
                  className="text-gray-400 hover:text-[#22B2B0] px-1 transition-colors"
                  title="Minggu Sebelumnya"
                >
                  <i className="fas fa-chevron-left text-[10px]"></i>
                </button>
                <span className="text-[10px] font-bold text-[#113C3A] px-2 min-w-[75px] text-center">
                  {weeksAgo === 0 ? 'Minggu Ini' : `${weeksAgo} Mgg Lalu`}
                </span>
                <button 
                  onClick={() => setWeeksAgo(prev => Math.max(0, prev - 1))}
                  disabled={weeksAgo === 0}
                  className={`px-1 transition-colors ${weeksAgo === 0 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-[#22B2B0]'}`}
                  title="Minggu Berikutnya"
                >
                  <i className="fas fa-chevron-right text-[10px]"></i>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[10px] font-semibold text-gray-600 flex-wrap">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#FF6B6B] shadow-sm"></span> Marah</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#FFB938] shadow-sm"></span> Cemas</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#22B2B0] shadow-sm"></span> Penerimaan</span>
            </div>
          </div>

          <div className="flex items-end justify-between px-2 md:px-6 bg-[#F9FAFA] rounded-2xl p-4 border border-gray-50 h-[180px]">
            {moodData.map((data, idx) => (
              <div key={idx} className="flex flex-col items-center justify-end w-full h-full gap-1.5">
                {data.height > 0 && (
                  <span className={`text-[9px] md:text-[10px] font-bold ${getTextColor(data.type)}`}>
                    {data.height}%
                  </span>
                )}
                <div 
                  className={`w-4 sm:w-6 md:w-8 rounded-full transition-all duration-500 ${getBarColor(data.type)}`} 
                  style={{ height: `${data.height}%`, minHeight: data.height > 0 ? '30px' : '0' }}
                ></div>
                <span className="text-[10px] font-semibold text-gray-500 mt-1">{data.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm flex flex-col min-h-[260px]">
          <h3 className="font-bold text-gray-800 text-sm mb-3">Kapsul Menunggu</h3>
          <div className="space-y-3 overflow-y-auto max-h-[190px] pr-1 flex-1">
            {waitingCapsules.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-6 opacity-60">
                <p className="text-xs text-gray-500">Belum ada kapsul.</p>
              </div>
            ) : (
              waitingCapsules.map((cap, idx) => (
                <div key={idx} className="bg-[#F9FAFA] border border-gray-100 p-3 rounded-2xl flex items-start justify-between shadow-sm">
                  <div className="overflow-hidden mr-2">
                    <h4 className="text-xs font-bold text-[#113C3A] mb-1 truncate">"{cap.judul || cap.title}"</h4>
                    <p className="text-[10px] text-gray-500">
                      Buka: {cap.tanggal || cap.openDate ? new Date(cap.tanggal || cap.openDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'}
                    </p>
                  </div>
                  <i className="fas fa-clock text-gray-400 text-xs mt-0.5 shrink-0"></i>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showBaselineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A2423]/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative">
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#E8F6F6] text-[#22B2B0] rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                <i className="fas fa-heart-pulse"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Selamat Datang di HealMate</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                Agar AI kami bisa menemanimu dengan akurat, ceritakan sejujurnya di fase mana kamu merasa berada saat ini?
              </p>
            </div>

            <div className="space-y-3">
              <button onClick={() => handleBaselineSelect('Sangat Terluka', -0.5)} className="w-full text-left px-5 py-3.5 rounded-2xl border border-gray-100 bg-[#FF6B6B]/10 hover:bg-[#FF6B6B]/20 text-[#FF6B6B] font-bold transition-all flex justify-between items-center group">
                <span>Sangat Terluka</span> <i className="fas fa-arrow-right opacity-0 group-hover:opacity-100 transition-opacity"></i>
              </button>
              
              <button onClick={() => handleBaselineSelect('Memproses Luka', -0.125)} className="w-full text-left px-5 py-3.5 rounded-2xl border border-gray-100 bg-[#FFB938]/10 hover:bg-[#FFB938]/20 text-[#FFB938] font-bold transition-all flex justify-between items-center group">
                <span>Memproses Luka</span> <i className="fas fa-arrow-right opacity-0 group-hover:opacity-100 transition-opacity"></i>
              </button>
              
              <button onClick={() => handleBaselineSelect('Mulai Pulih', 0.25)} className="w-full text-left px-5 py-3.5 rounded-2xl border border-gray-100 bg-[#FDE047]/20 hover:bg-[#FDE047]/40 text-[#D97706] font-bold transition-all flex justify-between items-center group">
                <span>Mulai Pulih</span> <i className="fas fa-arrow-right opacity-0 group-hover:opacity-100 transition-opacity"></i>
              </button>
              
              <button onClick={() => handleBaselineSelect('Bertumbuh', 0.625)} className="w-full text-left px-5 py-3.5 rounded-2xl border border-gray-100 bg-[#A7F3D0]/30 hover:bg-[#A7F3D0]/50 text-[#059669] font-bold transition-all flex justify-between items-center group">
                <span>Bertumbuh</span> <i className="fas fa-arrow-right opacity-0 group-hover:opacity-100 transition-opacity"></i>
              </button>
              
              <button onClick={() => handleBaselineSelect('Berdamai', 1.0)} className="w-full text-left px-5 py-3.5 rounded-2xl border border-gray-100 bg-[#22B2B0]/10 hover:bg-[#22B2B0]/20 text-[#22B2B0] font-bold transition-all flex justify-between items-center group">
                <span>Berdamai</span> <i className="fas fa-arrow-right opacity-0 group-hover:opacity-100 transition-opacity"></i>
              </button>
            </div>
            
          </div>
        </div>
      )}
    </MainLayout>
  );
}