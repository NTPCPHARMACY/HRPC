import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

const GeminiChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '您好！我是 HRPC 智慧助手，有什麼我可以幫您的嗎？' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(input);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: '抱歉，發生錯誤。' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="fixed bottom-24 right-5 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-white w-80 h-96 rounded-lg shadow-xl border border-gray-200 flex flex-col mb-4 overflow-hidden animate-fade-in-up">
          <div className="bg-primary text-white p-3 font-bold flex justify-between items-center">
            <span><i className="fas fa-robot mr-2"></i> HRPC 智慧助手</span>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto bg-gray-50 space-y-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-2 rounded-lg text-sm ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white rounded-br-none' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-2 rounded-lg rounded-bl-none shadow-sm text-gray-500 text-sm italic">
                  思考中...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-2 bg-white border-t border-gray-200 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="輸入問題..."
              className="flex-1 border rounded px-2 py-1 text-sm focus:outline-none focus:border-primary"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading}
              className="bg-primary text-white px-3 py-1 rounded hover:bg-teal-700 disabled:opacity-50 transition-colors"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? 'bg-gray-500' : 'bg-primary'} text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl hover:scale-110 transition-transform duration-200`}
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-comment-dots'}`}></i>
      </button>
    </div>
  );
};

export default GeminiChat;
