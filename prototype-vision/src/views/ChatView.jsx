import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ConversationList from '../components/chat/ConversationList';
import ChatWindow from '../components/chat/ChatWindow';
import { INITIAL_CHATS } from '../utils/chatConstants';

const ChatView = () => {
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [selectedChatId, setSelectedChatId] = useState('1');

  const handleSendMessage = (chatId, text) => {
    const newMessage = {
      id: `msg_${Date.now()}`,
      senderId: 'chef_joao',
      text,
      timestamp: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [...chat.messages, newMessage],
              lastMessage: text,
              lastTimestamp: newMessage.timestamp
            }
          : chat
      )
    );
  };

  const handleReceiveMessage = (chatId, text) => {
    const newMessage = {
      id: `msg_${Date.now()}`,
      senderId: chats.find(c => c.id === chatId)?.user.id || 'unknown',
      text,
      timestamp: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
    };

    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [...chat.messages, newMessage],
              lastMessage: text,
              lastTimestamp: newMessage.timestamp
            }
          : chat
      )
    );
  };

  const selectedChat = chats.find(chat => chat.id === selectedChatId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-[calc(100vh-120px)] rounded-[40px] overflow-hidden border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-xl"
    >
      <div className="h-full flex">
        <ConversationList
          chats={chats}
          selectedChatId={selectedChatId}
          onSelectChat={setSelectedChatId}
        />
        <ChatWindow
          chat={selectedChat}
          onSendMessage={handleSendMessage}
          onReceiveMessage={handleReceiveMessage}
        />
      </div>
    </motion.div>
  );
};

export default ChatView;
