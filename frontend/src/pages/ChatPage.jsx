import { useEffect, useState, useRef } from 'react';
import { useChatStore } from '../stores/chatStore';
import chatService from '../services/chatService';
import MainLayout from '../components/MainLayout';
import goalService from '../services/goalService';

export default function ChatPage() {
  const { setLoading, loading } = useChatStore();
  const setLatestEmotion = useChatStore((state) => state.setLatestEmotion);

  const [message, setMessage] = useState('');
  const [localChats, setLocalChats] = useState([]); 

  // [BARU] State khusus untuk menu dropdown di Header
  const [showSuggestionsDropdown, setShowSuggestionsDropdown] = useState(false);
  const [hiddenSuggestionForIndex, setHiddenSuggestionForIndex] = useState(null);
  
  const chatContainerRef = useRef(null);

  // --- LOGIKA BARU: Cari saran dari obrolan manapun yang paling baru ---
  const lastChatWithSuggestionsIndex = localChats.findLastIndex(
    (chat) => chat.activitySuggestions && chat.activitySuggestions.length > 0
  );
  const latestChatWithSuggestions = lastChatWithSuggestionsIndex >= 0 ? localChats[lastChatWithSuggestionsIndex] : null;
  
  // Tombol di header muncul selama ada riwayat saran, dan belum ditambahkan ke Target Pemulihan
  const shouldShowSuggestionButton = latestChatWithSuggestions !== null && hiddenSuggestionForIndex !== lastChatWithSuggestionsIndex;
  
  // --- Logika untuk mengecek saran dari chat TERBARU saja ---
  // const latestChatIndex = localChats.length - 1;
  // const latestChat = latestChatIndex >= 0 ? localChats[latestChatIndex] : null;
  // const hasLatestSuggestions = latestChat?.activitySuggestions && latestChat.activitySuggestions.length > 0;
  
  // Tombol di header HANYA muncul jika ada saran di chat terbaru & belum dipilih/disembunyikan
  // const shouldShowSuggestionButton = hasLatestSuggestions && hiddenSuggestionForIndex !== latestChatIndex;

  useEffect(() => {
    fetchChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [localChats, loading]);

  const scrollToBottom = () => {
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
    
    // Tiap kirim pesan baru, otomatis tutup dropdown saran jika sedang terbuka
    setShowSuggestionsDropdown(false);

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

  const handleAddSuggestionToGoals = async (suggestionText, chatIndex) => {
    try {
      await goalService.createGoal(suggestionText);
      alert('Aktivitas saran ditambahkan ke Target Pemulihan. Cek di halaman Target Pemulihan!');

      // Jika berhasil, sembunyikan tombol di header untuk index chat ini
      setHiddenSuggestionForIndex(chatIndex);
      setShowSuggestionsDropdown(false); // Tutup dropdown

    } catch (error) {
      console.error('Gagal menambahkan saran ke Target Pemulihan:', error);
      alert('Gagal menambahkan saran ke target pemulihan. Silakan coba lagi!');
    }
  };

  return (
    <MainLayout>
      <div className="bg-white w-full rounded-2xl md:rounded-[2rem] shadow-sm border border-gray-100 flex flex-col overflow-hidden relative h-[calc(100vh-120px)] md:h-[calc(100vh-100px)] max-h-full">
        <div className="bg-[#22B2B0] text-white p-4 px-4 md:px-6 flex items-center justify-between shrink-0 relative z-20 md:rounded-t-[2rem]">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm shrink-0">
              <i className="fas fa-robot text-xl"></i>
            </div>
            <div>
              <h3 className="font-semibold text-base md:text-lg leading-tight">HealMate AI Partner</h3>
              <p className="text-white/80 text-xs md:text-sm">Siap mendengarkan ceritamu kapan saja</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {shouldShowSuggestionButton && (
              <div className="relative">
                <button
                  onClick={() => setShowSuggestionsDropdown(!showSuggestionsDropdown)}
                  className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-sm transition-colors text-xs font-medium border border-white/10"
                >
                  <i className="fas fa-lightbulb text-yellow-300"></i>
                  <span className="hidden sm:inline">Lihat Saran</span>
                  <i className={`fas fa-chevron-${showSuggestionsDropdown ? 'up' : 'down'} text-[10px] ml-1`}></i>
                </button>

                {showSuggestionsDropdown && (
                  <div className="absolute top-full right-0 mt-3 bg-white rounded-xl shadow-xl border border-gray-100 p-3 w-64 md:w-72 animate-fade-in-down z-50">
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-[11px] font-bold text-[#22B2B0]">
                        <i className="fas fa-sparkles mr-1"></i> Saran Untukmu:
                      </p>
                      <button onClick={() => setShowSuggestionsDropdown(false)} className="text-gray-400 hover:text-red-500">
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                    
                    {/* <div className="flex flex-col gap-2 max-h-[40vh] overflow-y-auto pr-1">
                      {latestChat.activitySuggestions.map((suggestion, sugIdx) => (
                        <button
                          key={sugIdx}
                          onClick={() => handleAddSuggestionToGoals(suggestion, latestChatIndex)} */}
                          <div className="flex flex-col gap-2 max-h-[40vh] overflow-y-auto pr-1">
                              {latestChatWithSuggestions.activitySuggestions.map((suggestion, sugIdx) => (
                              <button
                                key={sugIdx}
                                  onClick={() => handleAddSuggestionToGoals(suggestion, lastChatWithSuggestionsIndex)}
                          className="text-[11px] bg-gray-50 border border-gray-100 text-gray-600 px-3 py-2 rounded-lg hover:bg-[#22B2B0] hover:text-white transition-all text-left flex items-start gap-2 group shadow-sm"
                        >
                          <i className="fas fa-plus mt-0.5 text-[#22B2B0] group-hover:text-white transition-colors"></i>
                          <span className="leading-relaxed">{suggestion}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="hidden md:flex bg-white/20 px-3 py-1.5 rounded-full items-center gap-2 backdrop-blur-sm">
              <i className="fas fa-shield-alt text-xs"></i>
            </div>
          </div>
        </div>

        {/* Daftar Obrolan */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col scroll-smooth">
          {localChats.length === 0 && !loading ? (
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
                      {/* {chat.emotion && (
                        <span className="text-[10px] md:text-xs text-gray-400 ml-2">
                          Deteksi Emosi: {terjemahkanEmosi(chat.emotion)}
                        </span>
                      )} */}
                      <div className="bg-white border border-gray-100 text-gray-700 px-4 md:px-5 py-3 md:py-3.5 rounded-2xl rounded-tl-sm max-w-[85%] md:max-w-[70%] shadow-sm text-sm leading-relaxed w-full">
                        <p>{chat.aiResponse}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex flex-col items-start gap-1">
                  <div className="bg-white border border-gray-100 px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5 w-fit">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Form Input */}
        <form onSubmit={handleSendMessage} className="p-3 md:p-4 bg-white border-t border-gray-50 shrink-0 relative z-10">
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
              <i className="fas fa-paper-plane text-sm md:ml-[-2px]"></i>
            </button>
          </div>
        </form>

      </div>
    </MainLayout>
  );
}