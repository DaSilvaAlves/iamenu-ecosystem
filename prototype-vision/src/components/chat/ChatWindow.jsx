import React, { useState, useRef, useEffect } from 'react';
import { CURRENT_USER } from '../../utils/chatConstants';
import { generateChefResponse } from '../../services/geminiService';

const ChatWindow = ({ chat, onSendMessage, onReceiveMessage }) => {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat?.messages]);

  if (!chat) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center bg-stone-50 p-8 text-center">
        <div className="size-20 bg-stone-200 rounded-full flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-[40px] text-stone-400">chat_bubble</span>
        </div>
        <h3 className="text-xl font-bold text-stone-800">Seleciona uma conversa</h3>
        <p className="text-stone-500 max-w-xs mt-2">Escolhe alguém da tua lista de contactos para começar a falar.</p>
      </main>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const messageText = inputValue;
    setInputValue('');
    onSendMessage(chat.id, messageText);

    // AI logic simulation for "Restaurante O Pátio"
    if (chat.user.id === 'patio') {
      setIsTyping(true);
      const aiReply = await generateChefResponse(messageText, []);
      setIsTyping(false);
      onReceiveMessage(chat.id, aiReply || "Desculpa, não percebi.");
    }
  };

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-white relative h-full">
      {/* Header */}
      <header className="h-20 px-8 border-b border-stone-100 flex items-center justify-between bg-white/90 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div
              className="bg-center bg-no-repeat bg-cover rounded-full size-11"
              style={{ backgroundImage: `url("${chat.user.avatarUrl}")` }}
            />
            {chat.user.isOnline && (
              <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div>
            <h3 className="text-stone-900 text-lg font-bold leading-none mb-1">{chat.user.name}</h3>
            <div className="flex items-center gap-1.5">
              <span className={`size-2 rounded-full ${chat.user.isOnline ? 'bg-green-500' : 'bg-stone-300'}`}></span>
              <span className="text-stone-500 text-xs font-medium">
                {chat.user.isOnline ? 'Online agora' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="size-10 flex items-center justify-center rounded-full text-stone-400 hover:bg-stone-50 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">phone</span>
          </button>
          <button className="size-10 flex items-center justify-center rounded-full text-stone-400 hover:bg-stone-50 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">videocam</span>
          </button>
          <button className="size-10 flex items-center justify-center rounded-full text-stone-400 hover:bg-stone-50 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">info</span>
          </button>
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 bg-stone-50 custom-scrollbar">
        <div className="flex justify-center">
          <span className="px-4 py-1.5 rounded-full bg-white border border-stone-100 text-stone-500 text-xs font-semibold shadow-sm">Hoje</span>
        </div>

        {chat.messages.map((msg) => {
          const isMe = msg.senderId === CURRENT_USER.id;
          return (
            <div key={msg.id} className={`flex gap-4 max-w-[80%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className="shrink-0 self-end">
                <div
                  className="bg-center bg-no-repeat bg-cover rounded-full size-8"
                  style={{ backgroundImage: `url("${isMe ? CURRENT_USER.avatarUrl : chat.user.avatarUrl}")` }}
                />
              </div>
              <div className={`flex flex-col gap-1 ${isMe ? 'items-end' : ''}`}>
                <div className={`p-5 rounded-2xl shadow-sm border ${isMe ? 'bg-primary border-transparent rounded-br-none shadow-primary/10' : 'bg-white border-stone-100 rounded-bl-none'}`}>
                  <p className={`text-sm leading-relaxed ${isMe ? 'text-white' : 'text-stone-800'}`}>
                    {msg.text}
                  </p>
                </div>
                <span className="text-stone-400 text-[11px] font-medium mx-1">
                  {msg.timestamp} {isMe && msg.status === 'read' ? '· Lida' : ''}
                </span>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex gap-4 max-w-[80%]">
             <div className="shrink-0 self-end">
                <div
                  className="bg-center bg-no-repeat bg-cover rounded-full size-8"
                  style={{ backgroundImage: `url("${chat.user.avatarUrl}")` }}
                />
              </div>
              <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-stone-100 flex items-center gap-1">
                <div className="size-1.5 bg-stone-300 rounded-full animate-bounce"></div>
                <div className="size-1.5 bg-stone-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="size-1.5 bg-stone-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 bg-white border-t border-stone-100">
        <form className="flex items-end gap-3" onSubmit={handleSubmit}>
          <button type="button" className="p-3 rounded-full text-stone-400 hover:text-primary hover:bg-stone-50 transition-colors">
            <span className="material-symbols-outlined text-[24px]">add_circle</span>
          </button>

          <div className="flex-1 bg-stone-50 border border-stone-200 rounded-3xl flex items-center min-h-[52px] px-4 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
            <button type="button" className="text-stone-400 hover:text-stone-600 mr-2">
              <span className="material-symbols-outlined text-[20px]">sentiment_satisfied</span>
            </button>
            <textarea
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-stone-900 placeholder-stone-400 resize-none py-4 max-h-32 leading-relaxed"
              placeholder="Escreve uma mensagem..."
              rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button type="button" className="text-stone-400 hover:text-stone-600 ml-2">
              <span className="material-symbols-outlined text-[20px]">attach_file</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="p-3 rounded-full bg-primary text-white hover:bg-primary/90 transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center disabled:opacity-50 disabled:scale-100"
          >
            <span className="material-symbols-outlined text-[24px] ml-0.5">send</span>
          </button>
        </form>
      </div>
    </main>
  );
};

export default ChatWindow;
