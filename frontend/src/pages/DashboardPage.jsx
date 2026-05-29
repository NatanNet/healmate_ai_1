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

  const [moodData, setMoodData] = useState([
    { day: 'Sen', height: 0, type: 'empty' },
    { day: 'Sel', height: 0, type: 'empty' },
    { day: 'Rab', height: 0, type: 'empty' },
    { day: 'Kam', height: 0, type: 'empty' }, 
    { day: 'Jum', height: 0, type: 'empty' },       
    { day: 'Sab', height: 0, type: 'empty' },
    { day: 'Min', height: 0, type: 'empty' }
  ]);

  useEffect(() => {
    const fetchGoalsData = async () => {
      try {
        const goals = await goalService.getGoals();
        if (Array.isArray(goals)) {
          const completed = goals.filter(g => g.status === 'completed' || g.progress === 100).length;
          setGoalsStats({ completed, total: goals.length });
        }
      } catch (error) {
        // Abaikan diam-diam jika data kosong
      }
    };

    const fetchCapsulesData = async () => {
      try {
        // Endpoint
        const capsuleResponse = await api.get('/timecapsule/'); 
        
        let dataKapsul = [];
        if (capsuleResponse.data && Array.isArray(capsuleResponse.data.timecapsules)) {
          dataKapsul = capsuleResponse.data.timecapsules;
        }

        // Memperbarui angka di kotak dasbor
        setCapsulesCount(dataKapsul.length);
        
        const today = new Date();
        const waiting = dataKapsul.filter(c => new Date(c.openDate) > today);
        setWaitingCapsules(waiting);
        
      } catch (error) {
        console.error('Gagal memuat jumlah kapsul dari database:', error);
      }
    };

    const fetchMoodData = async () => {
      try {
        const emotionResponse = await api.get('/mood/weekly');
        if (emotionResponse.data && Array.isArray(emotionResponse.data)) {
          setMoodData(emotionResponse.data);
        }
      } catch (error) {
        console.error('Gagal memuat grafik dari database:', error);
      }
    };

    fetchGoalsData();
    fetchCapsulesData();
    fetchMoodData();
  }, []);

  useEffect(() => {
    if (latestEmotion) {
      const daysId = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
      const today = daysId[new Date().getDay()];

      setMoodData((prevData) => 
        prevData.map((item) => {
          if (item.day === today) {
            return { ...item, height: 85, type: latestEmotion.toLowerCase() };
          }
          return item;
        })
      );
    }
  }, [latestEmotion]);

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        <button onClick={() => navigate('/chat')} className="bg-gradient-to-br from-[#22B2B0] to-[#1E9E9D] p-6 rounded-3xl flex flex-col justify-center items-center text-white shadow-md hover:scale-[1.02] transition-transform text-center">
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
              <span className="text-3xl font-bold text-[#113C3A]">{capsulesCount}</span>
              <span className="text-xs text-[#22B2B0] font-medium">Total kapsul</span>
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
              <span className="text-3xl font-bold text-[#113C3A]">
                {goalsStats.total > 0 ? `${goalsStats.completed}/${goalsStats.total}` : '0/0'}
              </span>
              <span className="text-xs text-[#22B2B0] font-medium">Selesai minggu ini!</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
            <h3 className="font-bold text-gray-800">Grafik Emosi</h3>
            <div className="flex items-center gap-3 text-xs font-semibold text-gray-600 flex-wrap">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#FF6B6B] shadow-sm"></span> Marah</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#FFB938] shadow-sm"></span> Cemas</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#22B2B0] shadow-sm"></span> Penerimaan</span>
            </div>
          </div>

          <div className="flex items-end justify-between px-2 md:px-6 bg-[#F9FAFA] rounded-2xl p-6 border border-gray-50 h-[240px]">
            {moodData.map((data, idx) => (
              <div key={idx} className="flex flex-col items-center justify-end w-full h-full gap-2">
                {data.height > 0 && (
                  <span className={`text-[10px] md:text-xs font-bold ${getTextColor(data.type)}`}>
                    {data.height}%
                  </span>
                )}
                <div 
                  className={`w-5 sm:w-8 md:w-10 rounded-full transition-all duration-500 ${getBarColor(data.type)}`} 
                  style={{ height: `${data.height}%`, minHeight: data.height > 0 ? '40px' : '0' }}
                ></div>
                <span className="text-xs font-semibold text-gray-500 mt-1">{data.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col min-h-[330px]">
          <h3 className="font-bold text-gray-800 mb-4">Kapsul Menunggu</h3>
          <div className="space-y-4 overflow-y-auto max-h-[240px] pr-1 flex-1">
            {waitingCapsules.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-8 opacity-60">
                <p className="text-sm text-gray-500">Belum ada kapsul yang menunggu waktu buka.</p>
              </div>
            ) : (
              waitingCapsules.map((cap, idx) => (
                <div key={idx} className="bg-[#F9FAFA] border border-gray-100 p-4 rounded-2xl flex items-start justify-between shadow-sm">
                  <div className="overflow-hidden mr-2">
                    <h4 className="text-sm font-bold text-[#113C3A] mb-1 truncate">"{cap.judul || cap.title}"</h4>
                    <p className="text-xs text-gray-500">
                      Bisa dibuka: {cap.tanggal || cap.openDate ? new Date(cap.tanggal || cap.openDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                    </p>
                  </div>
                  <i className="fas fa-clock text-gray-400 mt-1 shrink-0"></i>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}