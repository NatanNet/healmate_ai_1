import { useState } from 'react'; // Pastikan useState diimpor
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import PopUp from './PopUp';

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();
  
  // State untuk mengontrol muncul/hilangnya pop-up
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowLogoutModal(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#113C3A] text-white flex flex-col pt-8 pb-6 px-4 shrink-0 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="flex justify-between items-center px-4 mb-12">
          <div className="flex items-center gap-3">
            <i className="fas fa-heartbeat text-2xl text-[#22B2B0]"></i>
            <h1 className="text-xl font-bold">HealMate AI</h1>
          </div>
          <button className="md:hidden text-white/70 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => { navigate('/dashboard'); setIsSidebarOpen(false); }} 
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${isActive('/dashboard') || isActive('/') ? 'bg-[#22B2B0]/20 text-white' : 'text-white/70 hover:bg-[#22B2B0]/10'}`}
          >
            <i className="fas fa-home w-5"></i>
            <span className="font-medium text-sm">Beranda</span>
          </button>
          <button 
            onClick={() => { navigate('/capsule'); setIsSidebarOpen(false); }} 
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${isActive('/capsule') ? 'bg-[#22B2B0]/20 text-white' : 'text-white/70 hover:bg-[#22B2B0]/10'}`}
          >
            <i className="fas fa-hourglass-half w-5"></i>
            <span className="font-medium text-sm">Kapsul Waktu</span>
          </button>
          <button 
            onClick={() => { navigate('/goals'); setIsSidebarOpen(false); }} 
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${isActive('/goals') ? 'bg-[#22B2B0]/20 text-white' : 'text-white/70 hover:bg-[#22B2B0]/10'}`}
          >
            <i className="fas fa-leaf w-5"></i>
            <span className="font-medium text-sm">Target Pemulihan</span>
          </button>
        </nav>

        <button 
          onClick={() => { navigate('/chat'); setIsSidebarOpen(false); }} 
          className="w-full bg-[#22B2B0] text-white py-3 px-4 rounded-xl flex items-center justify-center gap-3 font-semibold mb-4 shadow-lg shadow-[#22B2B0]/30 hover:scale-[1.02] transition-transform"
        >
          <i className="fas fa-comments"></i> Curhat Sekarang
        </button>
        
        {/* Tombol Keluar ini sekarang memunculkan Pop-Up */}
        <button 
          onClick={() => setShowLogoutModal(true)} 
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-white/70 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <i className="fas fa-sign-out-alt w-5"></i>
          <span className="font-medium text-sm">Keluar</span>
        </button>
      </aside>

      {/* Pop-Up Konfirmasi Keluar ditempatkan di paling bawah, di luar aside */}
      <PopUp
        isOpen={showLogoutModal}
        title="Konfirmasi Keluar"
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        confirmText="Ya, Keluar"
        cancelText="Batal"
      >
        <p className="text-gray-600 text-sm">
          Apakah kamu yakin ingin keluar dari aplikasi HealMate AI?
        </p>
      </PopUp>
    </>
  );
}