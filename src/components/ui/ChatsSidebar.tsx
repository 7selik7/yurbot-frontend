'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import ChatItem from '@/components/chat/ChatItem';
import { groupChatsByDate } from '@/utils/utils';
import { FullChat } from '@/types/chat';
import { setSelectedChat } from '@/store/slices/chatSlice';

type ChatGroup = Record<string, FullChat[]>;

const ChatsSidebar = () => {
  const dispatch = useAppDispatch();

  const chats = useAppSelector((state) => state.chat.chats);
  const [chatsToShow, setChatsToShow] = useState<ChatGroup>({});

  const handleNewChat = () => {
    dispatch(setSelectedChat(null));
  };

  useEffect(() => {
    if (chats && chats.length > 0) {
      setChatsToShow(groupChatsByDate(chats));
    }
  }, [chats]);

  return (
    <div className="relative h-screen w-[300px] bg-white border-r border-gray-200 shadow-md flex flex-col">
      <div className="shrink-0 sticky top-0 z-10 bg-white border-b border-gray-200 py-4 px-4">
        <button
          onClick={handleNewChat}
          className="w-full py-2 px-4 bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-all"
        >
          + New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6">
        {Object.entries(chatsToShow).map(([title, chats]) => (
          <div key={title} className="space-y-1">
            <div className="pl-2 text-left font-bold text-gray-700 text-sm">{title}</div>
            {chats.map((chat) => (
              <ChatItem chat={chat} key={chat.uuid} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatsSidebar;
