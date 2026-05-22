import { useEffect, useState, useRef } from 'react';
import { MainLayout, Card, Input, Button, Spinner } from '../components';
import { useChatStore } from '../stores/chatStore';
import chatService from '../services/chatService';

export default function ChatPage() {
  const { chats, addChat, setLoading, loading } = useChatStore();
  const [message, setMessage] = useState('');
  const [localChats, setLocalChats] = useState([]);
  const messagesEndRef = useRef(null);

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
      const data = await chatService.getChatHistory();
      setLocalChats(data.chats);
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      setLoading(true);
      const response = await chatService.sendMessage(message);
      setLocalChats(prev => [...prev, response.chat]);
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout title="Chat dengan AI">
      <div className="h-[calc(100vh-200px)] flex flex-col">
        {/* Chat Messages */}
        <Card className="flex-1 overflow-y-auto mb-4 p-4">
          {localChats.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400 text-center">
                Mulai percakapan dengan AI Companion kami!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {localChats.map((chat, idx) => (
                <div key={idx} className="space-y-2">
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="bg-primary-light text-white rounded-lg px-4 py-2 max-w-xs">
                      <p>{chat.userMessage}</p>
                    </div>
                  </div>

                  {/* AI Response */}
                  {chat.aiResponse && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-2 max-w-xs">
                        <p>{chat.aiResponse}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </Card>

        {/* Message Input */}
        <Card>
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              type="text"
              placeholder="Tulis pesan Anda..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
              className="flex-1"
            />
            <Button
              type="submit"
              variant="primary"
              disabled={loading || !message.trim()}
            >
              {loading ? <Spinner size="sm" /> : 'Send'}
            </Button>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
}
