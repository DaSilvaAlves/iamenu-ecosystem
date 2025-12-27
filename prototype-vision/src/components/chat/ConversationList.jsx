import React, { useState } from 'react';

const ConversationList = ({ chats, selectedChatId, onSelectChat }) => {
  const [search, setSearch] = useState('');

  const filteredChats = chats.filter(chat =>
    chat.user.name.toLowerCase().includes(search.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="w-80 md:w-96 flex flex-col bg-background-light border-r border-stone-200 shrink-0 z-10">
      <div className="px-6 py-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-stone-900">Mensagens</h2>
        <button className="size-10 flex items-center justify-center rounded-full bg-white text-primary border border-stone-100 hover:shadow-md transition-all active:scale-95">
          <span className="material-symbols-outlined text-[20px]">edit_square</span>
        </button>
      </div>

      <div className="px-5 pb-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-stone-400">search</span>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-11 pr-4 py-3 bg-white border-stone-200 rounded-xl text-sm placeholder-stone-400 focus:border-primary focus:ring-primary/20 transition-all shadow-sm"
            placeholder="Pesquisar conversas..."
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 custom-scrollbar">
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${
              selectedChatId === chat.id
                ? 'bg-white shadow-sm ring-1 ring-stone-100'
                : 'hover:bg-white/50'
            }`}
          >
            <div className="relative shrink-0">
              <div
                className="bg-center bg-no-repeat bg-cover rounded-full size-12"
                style={{ backgroundImage: `url("${chat.user.avatarUrl}")` }}
              />
              {chat.unreadCount && (
                <div className="absolute -top-1 -right-1 size-5 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full ring-2 ring-background-light">
                  {chat.unreadCount}
                </div>
              )}
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <p className={`text-sm truncate ${selectedChatId === chat.id || chat.unreadCount ? 'text-stone-900 font-bold' : 'text-stone-700 font-semibold'}`}>
                  {chat.user.name}
                </p>
                <p className={`text-xs ${chat.unreadCount || selectedChatId === chat.id ? 'text-primary font-bold' : 'text-stone-400'}`}>
                  {chat.lastTimestamp}
                </p>
              </div>
              <p className={`text-xs truncate ${chat.unreadCount ? 'text-stone-900 font-semibold' : 'text-stone-500 font-medium'}`}>
                {chat.lastMessage}
              </p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default ConversationList;
