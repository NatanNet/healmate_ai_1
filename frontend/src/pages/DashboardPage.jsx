import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Modal } from '../components';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const chatBoxRef = useRef(null);

  // State untuk goals
  const [goals, setGoals] = useState([
    { id: 1, text: 'Jalan sore 15 menit tanpa pegang HP', category: 'Aktivitas Fisik', completed: false },
    { id: 2, text: 'Latihan napas panjang 5 kali', category: 'Kesehatan Mental', completed: true },
    { id: 3, text: 'Kerjakan revisi kodingan 30 menit', category: 'Fokus & Produktivitas', completed: false }
  ]);
  const [newGoal, setNewGoal] = useState('');
  const [goalCategory, setGoalCategory] = useState('Mental');

  // State untuk chat
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Halo, ' + user?.username + '. Senang melihatmu kembali. Bagaimana perasaanmu hari ini?' },
    { id: 2, type: 'user', text: 'Hari ini rasanya berat banget. Aku masih kepikiran terus, padahal kerjaan numpuk tapi nggak bisa fokus.' },
    { id: 3, type: 'bot', sentiment: 'Kesedihan & Penurunan Fokus', text: 'Aku mengerti. Sangat wajar merasa tidak fokus saat pikiran masih penuh dengan kenangan. Jangan terlalu keras pada dirimu sendiri ya.\n\nMau coba istirahat 15 menit dari layar, atau mau mengurai perasaanmu lebih dalam bersamaku?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const moodData = [
    { day: 'Sen', height: 40, emotion: 'Kesepian', type: 'sad' },
    { day: 'Sel', height: 65, emotion: 'Cemas', type: 'sad' },
    { day: 'Rab', height: 50, emotion: 'Netral', type: 'calm' },
    { day: 'Kam', height: 85, emotion: 'Sangat Sedih', type: 'sad' },
    { day: 'Jum', height: 70, emotion: 'Lebih Baik', type: 'calm' },
    { day: 'Sab', height: 95, emotion: 'Tenang', type: 'calm' },
    { day: 'Min', height: 90, emotion: 'Fokus', type: 'calm' }
  ];

  const toggleGoal = (id) => {
    setGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      const categoryMap = { Mental: 'Kesehatan Mental', Fisik: 'Aktivitas Fisik', Fokus: 'Fokus & Produktivitas' };
      setGoals([...goals, { id: Date.now(), text: newGoal, category: categoryMap[goalCategory], completed: false }]);
      setNewGoal('');
    }
  };

  const sendMessage = () => {
    if (chatInput.trim()) {
      setMessages([...messages, { id: Date.now(), type: 'user', text: chatInput }]);
      setChatInput('');
      setTimeout(() => chatBoxRef.current?.scrollTo(0, chatBoxRef.current.scrollHeight), 100);
    }
  };

  const handleLogoutConfirm = () => {
    logout();
    navigate('/login');
    setShowLogoutModal(false);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  return (
    <div className="flex h-screen bg-[#F4F7F6] font-['Poppins']">
      {/* Sidebar Overlay - Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:relative w-64 bg-[#0E3B3A] text-white flex flex-col p-6 z-50
        transition-all duration-300 h-screen overflow-y-auto
        ${sidebarOpen ? 'left-0' : '-left-full md:left-0'}
      `}>
        <a href="#" className="text-xl font-bold text-center mb-12 flex items-center justify-center gap-2">
          <i className="fas fa-heart-pulse text-[#22D1D1]"></i> HealMate AI
        </a>

        <ul className="space-y-3 flex-1">
          {[
            { id: 'dashboard', icon: 'fas fa-home', label: 'Dashboard' },
            { id: 'chatbot', icon: 'fas fa-robot', label: 'Chatbot' },
            { id: 'time-capsule', icon: 'fas fa-hourglass', label: 'Time Capsule' },
            { id: 'goals', icon: 'fas fa-bullseye', label: 'Set Goals' }
          ].map(item => (
            <li key={item.id}>
              <button
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-5 py-3 rounded-2xl transition-all text-sm ${
                  activeTab === item.id
                    ? 'bg-[#20A4A0] text-white'
                    : 'text-white/60 hover:bg-[#20A4A0]/20'
                }`}
              >
                <i className={`${item.icon} text-lg w-5`}></i>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>

        {/* Curhat Button */}
        <button
          onClick={() => {
            setActiveTab('chatbot');
            setSidebarOpen(false);
          }}
          className="w-full bg-gradient-to-r from-[#22D1D1] to-[#20A4A0] text-white py-3 rounded-2xl flex items-center justify-center gap-2 font-semibold mb-4 hover:scale-105 transition-transform"
        >
          <i className="fas fa-comments"></i> Curhat Sekarang
        </button>

        <button
          onClick={handleLogoutClick}
          className="w-full flex items-center gap-4 px-5 py-3 rounded-2xl text-white/60 hover:bg-red-600/20 transition-all text-sm"
        >
          <i className="fas fa-sign-out-alt text-lg w-5"></i>
          <span>Keluar</span>
        </button>
      </aside>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutModal}
        title="Konfirmasi Logout"
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
        confirmText="Ya, Keluar"
        cancelText="Batal"
      >
        <p className="text-gray-700">Apakah Anda yakin ingin keluar dari aplikasi?</p>
      </Modal>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b p-4 md:p-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-[#0E3B3A] text-2xl"
            >
              <i className="fas fa-bars"></i>
            </button>
            <div>
              <h2 className="text-lg md:text-2xl font-bold text-[#0E3B3A]">Halo, {user?.username}! 👋</h2>
              <p className="text-xs md:text-sm text-gray-600">Tidak apa-apa jika hari ini terasa berat.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveTab('chatbot');
                setSidebarOpen(false);
              }}
              className="flex bg-[#20A4A0] text-white w-10 h-10 rounded-full justify-center items-center text-lg hover:bg-[#147A77] transition-all"
            >
              <i className="fas fa-comments"></i>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div>
              {/* AI Insight Banner */}
              <div className="bg-gradient-to-r from-[#0E3B3A] to-[#20A4A0] text-white p-4 md:p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-5 mb-6 md:mb-8 shadow-lg">
                <div className="bg-white/20 p-3 md:p-4 rounded-2xl flex-shrink-0">
                  <i className="fas fa-brain text-2xl md:text-3xl text-[#22D1D1]"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-sm md:text-base mb-1">Insight AI: Keseimbangan Emosi Mingguan</h4>
                  <p className="text-xs md:text-sm text-white/80 leading-relaxed">
                    Berdasarkan analisis NLP dari curhatanmu minggu ini, tingkat overthinking-mu menurun 15%. Kamu mulai bisa menerima keadaan dengan lebih tenang. Tetap pertahankan!
                  </p>
                </div>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-6 md:mb-8">
                {/* Chatbot CTA Card */}
                <button
                  onClick={() => setActiveTab('chatbot')}
                  className="bg-gradient-to-br from-[#20A4A0] to-[#22D1D1] text-white p-6 md:p-8 rounded-3xl flex flex-row md:flex-col items-center md:items-center justify-start md:justify-center gap-4 md:gap-3 cursor-pointer hover:scale-105 transition-transform shadow-lg relative overflow-hidden group md:col-span-1"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full"></div>
                  <div className="relative z-10 text-center">
                    <div className="text-3xl md:text-4xl mb-2 block"><i className="fas fa-robot"></i></div>
                    <h4 className="text-sm md:text-base font-semibold mb-0.5">HealMate Companion</h4>
                    <p className="text-xs text-white/80">Mulai sesi curhat AI sekarang</p>
                  </div>
                </button>

                {/* Capsule Card */}
                <div className="bg-white p-6 rounded-3xl shadow-md flex items-center gap-5">
                  <div className="w-12 h-12 bg-[#20A4A0]/10 rounded-2xl flex items-center justify-center text-[#20A4A0] text-2xl flex-shrink-0">
                    <i className="fas fa-lock"></i>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Kapsul Tersimpan</p>
                    <p className="text-2xl font-bold text-[#0E3B3A]">
                      2 <span className="text-xs text-[#22D1D1] font-medium">Menunggu dibuka</span>
                    </p>
                  </div>
                </div>

                {/* Goal Card */}
                <div className="bg-white p-6 rounded-3xl shadow-md flex items-center gap-5">
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 text-2xl flex-shrink-0">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Target Pemulihan</p>
                    <p className="text-2xl font-bold text-[#0E3B3A]">
                      12/15 <span className="text-xs text-[#20A4A0] font-medium">Selesai minggu ini!</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Mood Chart + Capsules Waiting */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-5">
                {/* Mood Chart */}
                <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-3xl shadow-md">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
                    <h3 className="text-sm md:text-base font-semibold text-[#0E3B3A]">Grafik Sentimen (NLP)</h3>
                    <div className="text-xs text-gray-600 flex gap-4 mt-2 md:mt-0">
                      <span><i className="fas fa-circle text-[#8FA8FF] text-xs"></i> Sedih</span>
                      <span><i className="fas fa-circle text-[#22D1D1] text-xs"></i> Tenang</span>
                    </div>
                  </div>

                  <div className="flex items-flex-end justify-around h-40 md:h-52 gap-2 md:gap-4 bg-[#F8FAFA] p-4 md:p-6 rounded-2xl">
                    {moodData.map((data, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-3 flex-1 group relative">
                        <div
                          className={`w-6 md:w-7 rounded-full transition-all ${
                            data.type === 'sad'
                              ? 'bg-gradient-to-b from-[#8FA8FF] to-[#6786EE]'
                              : 'bg-gradient-to-b from-[#22D1D1] to-[#147A77]'
                          }`}
                          style={{ height: `${data.height * 1.8}px` }}
                        >
                          <div className="w-2 h-6 bg-white/40 rounded-full ml-2 mt-1"></div>
                        </div>
                        <span className="text-xs font-semibold text-[#0E3B3A]">{data.day}</span>
                        <div className="absolute -top-8 bg-[#0E3B3A] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {data.emotion}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Capsules Waiting */}
                <div className="bg-white p-6 rounded-3xl shadow-md">
                  <h3 className="text-sm md:text-base font-semibold text-[#0E3B3A] mb-4">Kapsul Menunggu</h3>
                  <div className="space-y-3">
                    <div className="bg-[#F4F7F6] p-4 rounded-2xl">
                      <h4 className="text-xs md:text-sm font-semibold text-[#0E3B3A]">"Untuk Aku di Akhir Tahun"</h4>
                      <p className="text-xs text-gray-600 mt-1">Bisa dibuka: 31 Des 2026</p>
                      <div className="flex justify-end mt-2 text-gray-600"><i className="fas fa-clock text-lg"></i></div>
                    </div>
                    <div className="bg-[#F4F7F6] p-4 rounded-2xl">
                      <h4 className="text-xs md:text-sm font-semibold text-[#0E3B3A]">"Surat Pelepasan Emosi"</h4>
                      <p className="text-xs text-gray-600 mt-1">Bisa dibuka: 15 Ags 2026</p>
                      <div className="flex justify-end mt-2 text-gray-600"><i className="fas fa-clock text-lg"></i></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CHATBOT TAB */}
          {activeTab === 'chatbot' && (
            <div className="bg-white rounded-3xl shadow-md flex flex-col h-[calc(100vh-150px)] md:h-[calc(100vh-200px)] overflow-hidden border border-[#22D1D1]/20">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-[#0E3B3A] to-[#20A4A0] p-5 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl">
                    <i className="fas fa-robot"></i>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold">HealMate Companion</h3>
                    <p className="text-xs text-white/90">Siap mendengarkan ceritamu kapan saja</p>
                  </div>
                </div>
                <div className="text-xs bg-white/15 px-3 py-1 rounded-full flex items-center gap-2 backdrop-blur">
                  <i className="fas fa-shield-alt"></i> Privat (NLP Aktif)
                </div>
              </div>

              {/* Messages */}
              <div ref={chatBoxRef} className="flex-1 overflow-y-auto p-5 md:p-6 bg-[#FAFAFA] flex flex-col gap-5">
                {messages.map(msg => (
                  <div key={msg.id}>
                    {msg.sentiment && (
                      <div className="text-xs text-gray-600 flex items-center gap-2 mb-2">
                        <i className="fas fa-search-heart"></i> AI mendeteksi: {msg.sentiment}
                      </div>
                    )}
                    <div className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-xs md:max-w-md p-4 rounded-3xl text-sm leading-relaxed ${
                          msg.type === 'user'
                            ? 'bg-[#20A4A0] text-white rounded-br-sm'
                            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 md:p-5 border-t flex gap-3">
                <input
                  type="text"
                  placeholder="Ketik pesanmu di sini..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1 px-5 py-3 border border-gray-300 rounded-full bg-[#F4F7F6] outline-none text-sm"
                />
                <button
                  onClick={sendMessage}
                  className="w-11 h-11 bg-[#0E3B3A] text-white rounded-full hover:bg-[#20A4A0] transition-all flex items-center justify-center flex-shrink-0"
                >
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          )}

          {/* TIME CAPSULE TAB */}
          {activeTab === 'time-capsule' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-5">
              {/* Create */}
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-md">
                <h3 className="text-base md:text-lg font-semibold text-[#0E3B3A] mb-2">Segel Perasaanmu</h3>
                <p className="text-xs md:text-sm text-gray-600 mb-6">
                  Tuliskan rasa sakit, harapan, atau sekadar uneg-uneg hari ini. Kunci pesan ini agar dibaca oleh dirimu di masa depan yang sudah lebih kuat.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-[#0E3B3A] mb-2">Judul Kapsul</label>
                    <input type="text" placeholder="Contoh: Perasaanku pasca putus" className="w-full px-4 py-3 border border-gray-300 rounded-2xl bg-[#F4F7F6] outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-[#0E3B3A] mb-2">Kapan Kapsul Boleh Dibuka?</label>
                    <input type="date" className="w-full px-4 py-3 border border-gray-300 rounded-2xl bg-[#F4F7F6] outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-[#0E3B3A] mb-2">Isi Pesan / Surat</label>
                    <textarea placeholder="Hai diriku di masa depan..." className="w-full px-4 py-3 border border-gray-300 rounded-2xl bg-[#F4F7F6] outline-none text-sm resize-none h-24"></textarea>
                  </div>
                  <button className="w-full bg-[#0E3B3A] text-white py-3 rounded-full font-semibold hover:bg-[#20A4A0] transition-all text-sm">
                    Segel Kapsul Waktu <i className="fas fa-lock ml-2"></i>
                  </button>
                </div>
              </div>

              {/* Vault */}
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-md">
                <h3 className="text-base md:text-lg font-semibold text-[#0E3B3A] mb-4">Brankas Kapsul (Vault)</h3>
                <div className="space-y-3">
                  <div className="bg-[#0E3B3A] text-white p-5 rounded-2xl flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-semibold">Masa Tersulit di 2025</h4>
                      <p className="text-xs text-white/70 mt-1">Disegel: 10 Okt 2025 • Dibuka: 10 Okt 2026</p>
                    </div>
                    <i className="fas fa-lock text-[#22D1D1] text-lg"></i>
                  </div>
                  <div className="bg-[#20A4A0] text-white p-5 rounded-2xl flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-semibold">Target Pasca Kelulusan</h4>
                      <p className="text-xs text-white/90 mt-1">Telah terbuka! Tersedia untuk dibaca.</p>
                    </div>
                    <i className="fas fa-envelope-open-text text-lg"></i>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* GOALS TAB */}
          {activeTab === 'goals' && (
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-md">
              <h3 className="text-base md:text-lg font-semibold text-[#0E3B3A] mb-2">Langkah Pemulihan (Micro-Goals)</h3>
              <p className="text-xs md:text-sm text-gray-600 mb-6">
                Depresi sering membuat kita kehilangan motivasi. Susun langkah kecil untuk mengembalikan rutinitas tanpa membebani mental.
              </p>

              {/* Add Goal */}
              <div className="flex flex-col md:flex-row gap-3 mb-6">
                <input
                  type="text"
                  placeholder="Ketik kebiasaan kecil... (Cth: Minum air putih)"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  className="flex-1 px-5 py-3 border border-gray-300 rounded-full bg-[#F4F7F6] outline-none text-sm"
                />
                <select
                  value={goalCategory}
                  onChange={(e) => setGoalCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-full bg-[#F4F7F6] outline-none text-sm"
                >
                  <option value="Mental">Kesehatan Mental</option>
                  <option value="Fisik">Aktivitas Fisik</option>
                  <option value="Fokus">Fokus & Produktivitas</option>
                </select>
                <button
                  onClick={addGoal}
                  className="bg-[#20A4A0] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#0E3B3A] transition-all text-sm flex items-center gap-2 whitespace-nowrap"
                >
                  <i className="fas fa-plus"></i> Tambah
                </button>
              </div>

              {/* Goals List */}
              <div className="space-y-0">
                {goals.map(goal => (
                  <div
                    key={goal.id}
                    className={`flex items-center gap-4 py-4 px-4 border-b transition-all ${
                      goal.completed ? 'opacity-60' : ''
                    }`}
                  >
                    <button
                      onClick={() => toggleGoal(goal.id)}
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        goal.completed
                          ? 'bg-[#20A4A0] border-[#20A4A0] text-white'
                          : 'border-[#20A4A0] text-transparent hover:border-[#0E3B3A]'
                      }`}
                    >
                      <i className="fas fa-check text-xs"></i>
                    </button>

                    <span
                      className={`flex-1 text-sm font-medium transition-all ${
                        goal.completed ? 'line-through text-gray-500' : 'text-gray-800'
                      }`}
                    >
                      {goal.text}
                    </span>

                    <span
                      className={`text-xs px-3 py-1 rounded-full font-semibold whitespace-nowrap ${
                        goal.category === 'Aktivitas Fisik'
                          ? 'bg-orange-100 text-orange-700'
                          : goal.category === 'Kesehatan Mental'
                          ? 'bg-[#0E3B3A]/10 text-[#0E3B3A]'
                          : 'bg-[#22D1D1]/20 text-[#0E3B3A]'
                      }`}
                    >
                      {goal.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
