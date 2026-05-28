import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChatStore } from '../stores/chatStore';
import { useAuthStore } from '../stores/authStore'; // 1. Import authStore kamu
import chatService from '../services/chatService';


export default function ChatPage() {
  const navigate = useNavigate();
  const { setLoading, loading } = useChatStore();

  const setLatestEmotion = useChatStore((state) => state.setLatestEmotion);
  
  // 2. Ambil data user dari authStore (sesuaikan dengan isi authStore.js kamu)
  // Contoh di bawah berasumsi authStore menyimpan object 'user' yang berisi 'name' atau 'username'
  const { user } = useAuthStore(); 

  const [message, setMessage] = useState('');
  const [localChats, setLocalChats] = useState([]); 
  const messagesEndRef = useRef(null);

  // 3. Buat nama & inisial menjadi dinamis berdasarkan user yang login
  const userName = user?.name || user?.username || 'Pengguna HealMate'; 
  
  // Membuat inisial (misal: "Natanel Putra" -> "NP", "User" -> "U")
  const getInitials = (name) => {
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0] ? parts[0][0].toUpperCase() : 'U';
  };

  useEffect(() => {
    fetchChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [localChats]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChatHistory = async () => {
    try {
      setLoading(true);
      // 4. Ambil riwayat chat asli dari backend
      const history = await chatService.getChatHistory();
      
      // Jika backend mengembalikan array data chat, masukkan ke state
      if (history && Array.isArray(history)) {
        setLocalChats(history); 
      } else {
        setLocalChats([]); 
      }
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
      setLocalChats([]); 
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Optimistic UI: Tampilkan pesan user langsung ke layar
    const userMsgObj = { userMessage: message, aiResponse: null, emotion: null };
    setLocalChats((prev) => [...prev, userMsgObj]);
    
    const currentMessage = message;
    setMessage('');

    try {
      setLoading(true);
      // Kirim ke backend (FastAPI) -> Backend memproses ke Model AI -> Mengembalikan jawaban
      const response = await chatService.sendMessage(currentMessage);
      
      if (response.emotion) {
      setLatestEmotion(response.emotion);
    }
      // Update pesan terakhir di layar dengan respon dari AI asli
      setLocalChats((prev) => {
        const newChats = [...prev];
        // Pastikan backend kamu mengembalikan object dengan struktur { userMessage, aiResponse, emotion }
        newChats[newChats.length - 1] = response;
        return newChats;
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      // Opsional: Beri tahu user jika chat gagal terkirim
    } finally {
      setLoading(false);
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
          <button onClick={() => navigate('/dashboard')} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-white/70 hover:bg-[#22B2B0]/10 transition-colors">
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
        <button onClick={() => navigate('/login')} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-white/70 hover:bg-white/5 transition-colors">
          <i className="fas fa-sign-out-alt w-5"></i>
          <span className="font-medium text-sm">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-8 overflow-hidden">
        {/* Header */}
        <header className="flex justify-between items-center mb-6 shrink-0">
          <div>
            {/* Menggunakan nama depan secara dinamis */}
            <h2 className="text-2xl font-bold text-[#113C3A] mb-1">Halo, {userName.split(' ')[0]}! </h2>
            <p className="text-gray-500 text-sm">Tidak apa-apa jika hari ini terasa berat.</p>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
            {/* Inisial otomatis berubah sesuai nama */}
            <div className="w-8 h-8 rounded-full bg-[#113C3A] text-white flex items-center justify-center text-xs font-bold">
              {getInitials(userName)}
            </div>
            <span className="text-sm font-semibold text-[#113C3A]">{userName}</span>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 bg-white rounded-[2rem] shadow-sm border border-gray-100 flex flex-col overflow-hidden relative">
          
          {/* AI Banner */}
          <div className="bg-[#22B2B0] text-white p-4 px-6 flex items-center justify-between shrink-0 rounded-t-[2rem]">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <i className="fas fa-robot text-xl"></i>
              </div>
              <div>
                <h3 className="font-semibold text-lg leading-tight">HealMate AI Partner</h3>
                <p className="text-white/80 text-sm">Siap mendengarkan ceritamu kapan saja</p>
              </div>
            </div>
            <div className="bg-white/20 px-3 py-1.5 rounded-full flex items-center gap-2 backdrop-blur-sm">
              <i className="fas fa-shield-alt text-xs"></i>
              <span className="text-xs font-medium">Privat (NLP Aktif)</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col">
            {localChats.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
                <div className="w-16 h-16 bg-[#E8F6F6] text-[#22B2B0] rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-comment-dots text-2xl"></i>
                </div>
                <p className="text-[#113C3A] font-medium">Belum ada percakapan</p>
                <p className="text-sm text-gray-500 mt-1">Mulai sapa HealMate AI Partner untuk curhat hari ini.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {localChats.map((chat, idx) => (
                  <div key={idx} className="flex flex-col space-y-4">
                    {/* User Bubble */}
                    <div className="flex justify-end">
                      <div className="bg-[#22B2B0] text-white px-5 py-3.5 rounded-2xl rounded-tr-sm max-w-[70%] shadow-sm text-sm leading-relaxed">
                        {chat.userMessage}
                      </div>
                    </div>

                    {/* AI Bubble */}
                    {chat.aiResponse && (
                      <div className="flex flex-col items-start gap-1">
                        {chat.emotion && (
                          <span className="text-xs text-gray-400 ml-2">
                            AI mendeteksi: {chat.emotion}
                          </span>
                        )}
                        <div className="bg-white border border-gray-100 text-gray-700 px-5 py-3.5 rounded-2xl rounded-tl-sm max-w-[70%] shadow-sm text-sm leading-relaxed">
                          {chat.aiResponse}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-50 shrink-0">
            <div className="flex items-center gap-3 bg-[#F9FAFA] border border-gray-200 rounded-full p-1 pl-4">
              <input
                type="text"
                placeholder="Ketik pesanmu di sini..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={loading}
                className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 py-2"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-[#22B2B0] hover:bg-[#1E9E9D] text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm disabled:opacity-50"
              >
                {loading ? <i className="fas fa-spinner fa-spin text-sm"></i> : <i className="fas fa-paper-plane text-sm"></i>}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}