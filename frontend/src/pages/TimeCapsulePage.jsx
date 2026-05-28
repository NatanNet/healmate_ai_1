import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TimeCapsulePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ judul: '', tanggal: '', isi: '' });

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
          <button onClick={() => navigate('/capsule')} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-[#22B2B0]/20 text-white transition-colors">
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
        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-white/70 hover:bg-white/5 transition-colors">
          <i className="fas fa-sign-out-alt w-5"></i>
          <span className="font-medium text-sm">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Form Segel Perasaan */}
        <div className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm">
          <h2 className="text-xl font-bold text-[#113C3A] mb-2">Segel Perasaanmu</h2>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed">
            Tuliskan rasa sakit, harapan, atau sekadar uneg-uneg hari ini. Kunci pesan ini agar dibaca oleh dirimu di masa depan yang sudah lebih kuat.
          </p>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#113C3A] mb-2">Judul Kapsul</label>
              <input 
                type="text" 
                placeholder="Contoh: Perasaanku pasca putus di bulan Mei" 
                className="w-full bg-[#F9FAFA] border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#22B2B0] transition-colors text-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#113C3A] mb-2">Kapan Kapsul Boleh Dibuka?</label>
              <div className="relative">
                <input 
                  type="date" 
                  className="w-full bg-[#F9FAFA] border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#22B2B0] transition-colors text-gray-700 appearance-none"
                />
                <i className="fas fa-calendar absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#113C3A] mb-2">Isi Pesan / Surat</label>
              <textarea 
                rows="5"
                placeholder="Hai diriku di masa depan. Hari ini rasanya hancur sekali, tapi aku berjanji untuk pulih..." 
                className="w-full bg-[#F9FAFA] border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#22B2B0] transition-colors text-gray-700 resize-none"
              ></textarea>
            </div>

            <button type="button" className="w-full bg-[#113C3A] text-white font-semibold py-4 rounded-full flex items-center justify-center gap-2 hover:bg-[#0c2a29] transition-colors shadow-md">
              Segel Kapsul Waktu <i className="fas fa-lock ml-1 text-sm"></i>
            </button>
          </form>
        </div>

        {/* Brankas Kapsul List */}
        <div>
          <h2 className="text-lg font-bold text-[#113C3A] mb-6">Brankas Kapsul (Vault)</h2>
          
          <div className="space-y-4">
            {/* Locked Capsule */}
            <div className="bg-[#113C3A] text-white p-6 rounded-[1.5rem] flex items-center justify-between shadow-md relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-black/10 rounded-l-full"></div>
              <div className="relative z-10">
                <h3 className="font-bold mb-1">Masa Tersulit di 2025</h3>
                <p className="text-xs text-white/70">Disegel: 10 Okt 2025 • Dibuka: 10 Okt 2026</p>
              </div>
              <i className="fas fa-lock text-2xl text-[#22B2B0] relative z-10"></i>
            </div>

            {/* Unlocked Capsule */}
            <div className="bg-[#22B2B0] text-white p-6 rounded-[1.5rem] flex items-center justify-between shadow-md relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-white/10 rounded-l-full"></div>
              <div className="relative z-10">
                <h3 className="font-bold mb-1">Target Pasca Kelulusan</h3>
                <p className="text-xs text-white/90">Telah terbuka! Tersedia untuk dibaca.</p>
              </div>
              <i className="fas fa-envelope-open-text text-2xl text-white relative z-10"></i>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}