import { useEffect, useState, useRef } from 'react';
import { useChatStore } from '../stores/chatStore';
import chatService from '../services/chatService';
import MainLayout from '../components/MainLayout';

export default function ChatPage() {
  const { setLoading, loading } = useChatStore();
  const setLatestEmotion = useChatStore((state) => state.setLatestEmotion);

  const [message, setMessage] = useState('');
  const [localChats, setLocalChats] = useState([]); 
  
  // PERBAIKAN: Gunakan ref untuk wadah obrolan, bukan untuk pesan terakhir
  const chatContainerRef = useRef(null);
  
  useEffect(() => {
    fetchChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [localChats]);

  const scrollToBottom = () => {
    // PERBAIKAN: Menggulirkan isi di dalam kotak saja, tidak menarik layar utama
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const fetchChatHistory = async () => {
    try {
      setLoading(true);
      const data = await chatService.getChatHistory();
      
      if (data && Array.isArray(data.chats)) {
        setLocalChats(data.chats.reverse()); 
      } else if (Array.isArray(data)) {
        setLocalChats(data.reverse());
      } else {
        setLocalChats([]); 
      }
    } catch (error) {
      console.error('Gagal memuat riwayat obrolan:', error);
      setLocalChats([]); 
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMsgObj = { userMessage: message, aiResponse: null, emotion: null };
    setLocalChats((prev) => [...prev, userMsgObj]);
    
    const currentMessage = message;
    setMessage('');

    try {
      setLoading(true);
      const response = await chatService.sendMessage(currentMessage);
      
      if (response.emotion) {
        setLatestEmotion(response.emotion);
      }
      
      setLocalChats((prev) => {
        const newChats = [...prev];
        newChats[newChats.length - 1] = response;
        return newChats;
      });
    } catch (error) {
      console.error('Gagal mengirim pesan:', error);
    } finally {
      setLoading(false);
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
    <MainLayout>
      <div className="flex-1 bg-white rounded-2xl md:rounded-[2rem] shadow-sm border border-gray-100 flex flex-col overflow-hidden relative h-[80vh] md:h-[85vh]">
        
        {/* Banner AI */}
        <div className="bg-[#22B2B0] text-white p-4 px-4 md:px-6 flex items-center justify-between shrink-0 md:rounded-t-[2rem]">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm shrink-0">
              <i className="fas fa-robot text-xl"></i>
            </div>
            <div>
              <h3 className="font-semibold text-base md:text-lg leading-tight">HealMate AI Partner</h3>
              <p className="text-white/80 text-xs md:text-sm">Siap mendengarkan ceritamu kapan saja</p>
            </div>
          </div>
          <div className="hidden md:flex bg-white/20 px-3 py-1.5 rounded-full items-center gap-2 backdrop-blur-sm">
            <i className="fas fa-shield-alt text-xs"></i>
          </div>
        </div>

        {/* Daftar Obrolan */}
        {/* PERBAIKAN: Menambahkan ref ke sini dan menambahkan class scroll-smooth */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col scroll-smooth">
          {localChats.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
              <div className="w-16 h-16 bg-[#E8F6F6] text-[#22B2B0] rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-comment-dots text-2xl"></i>
              </div>
              <p className="text-[#113C3A] font-medium">Belum ada percakapan</p>
              <p className="text-sm text-gray-500 mt-1">Mulai sapa HealMate AI untuk curhat hari ini.</p>
            </div>
          ) : (
            <div className="space-y-6 pb-4">
              {localChats.map((chat, idx) => (
                <div key={idx} className="flex flex-col space-y-4">
                  <div className="flex justify-end">
                    <div className="bg-[#22B2B0] text-white px-4 md:px-5 py-3 md:py-3.5 rounded-2xl rounded-tr-sm max-w-[85%] md:max-w-[70%] shadow-sm text-sm leading-relaxed">
                      {chat.userMessage}
                    </div>
                  </div>
                  {chat.aiResponse && (
                    <div className="flex flex-col items-start gap-1">
                      {chat.emotion && (
                        <span className="text-[10px] md:text-xs text-gray-400 ml-2">
                          Deteksi Emosi: {terjemahkanEmosi(chat.emotion)}
                        </span>
                      )}
                      <div className="bg-white border border-gray-100 text-gray-700 px-4 md:px-5 py-3 md:py-3.5 rounded-2xl rounded-tl-sm max-w-[85%] md:max-w-[70%] shadow-sm text-sm leading-relaxed">
                        {chat.aiResponse}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form Input */}
        <form onSubmit={handleSendMessage} className="p-3 md:p-4 bg-white border-t border-gray-50 shrink-0">
          <div className="flex items-center gap-2 md:gap-3 bg-[#F9FAFA] border border-gray-200 rounded-full p-1 pl-4">
            <input
              type="text"
              placeholder="Ketik pesanmu di sini..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 py-2 w-full"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-[#22B2B0] hover:bg-[#1E9E9D] text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm disabled:opacity-50 shrink-0"
            >
              {loading ? <i className="fas fa-spinner fa-spin text-sm"></i> : <i className="fas fa-paper-plane text-sm md:ml-[-2px]"></i>}
            </button>
          </div>
        </form>

      </div>
    </MainLayout>
  );
}