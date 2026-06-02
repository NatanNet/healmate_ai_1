import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useChatStore } from '../stores/chatStore';

export default function Header({ setIsSidebarOpen }) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const latestEmotion = useChatStore((state) => state.latestEmotion);

  const fullUserName = user?.fullName || user?.username || 'Pengguna HealMate';
  const nickname = fullUserName.split(' ')[0];

  const getBarColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'anger': return 'bg-[#FF6B6B] shadow-[0_0_10px_rgba(255,107,107,0.4)]'; 
      case 'anxiety': return 'bg-[#FFB938] shadow-[0_0_10px_rgba(255,185,56,0.4)]'; 
      case 'acceptance': return 'bg-[#22B2B0] shadow-[0_0_10px_rgba(34,178,176,0.4)]'; 
      default: return 'bg-transparent';
    }
  };

  const terjemahkanEmosi = (emosi) => {
    switch (emosi?.toLowerCase()) {
      case 'anger': return 'Marah';
      case 'anxiety': return 'Cemas';
      case 'acceptance': return 'Penerimaan';
      default: return emosi;
    }
  };

  return (
    <>
      {/* HEADER HP */}
      <header className="md:hidden flex justify-between items-center bg-white p-4 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSidebarOpen(true)} className="text-[#113C3A] p-1 focus:outline-none">
            <i className="fas fa-bars text-xl"></i>
          </button>
          <div>
            <h2 className="text-lg font-bold text-[#113C3A]">Halo, {nickname}! 👋</h2>
            <p className="text-gray-400 text-xs">Tidak apa-apa jika hari ini terasa berat, semuanya akan terlalui</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/chat')} 
          className="w-10 h-10 bg-[#22B2B0] text-white rounded-full flex items-center justify-center shadow-md shadow-[#22B2B0]/20 active:scale-95 transition-transform"
        >
          <i className="fas fa-comments"></i>
        </button>
      </header>

      {/* HEADER DESKTOP */}
      <header className="hidden md:flex justify-between items-center p-8 pb-4 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-[#113C3A] mb-1">Halo, {nickname}! 👋</h2>
          <div className="flex items-center gap-2">
            <p className="text-gray-500 text-sm">Tidak apa-apa jika hari ini terasa berat, semuanya akan terlalui</p>
            {/* {latestEmotion && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold text-white ${getBarColor(latestEmotion).split(' ')[0]}`}>
                Sedang merasa {terjemahkanEmosi(latestEmotion)}
              </span>
            )} */}
          </div>
        </div>
      </header>
    </>
  );
}