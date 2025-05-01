import React from 'react';
import { useAppDispatch } from '@/store/hook';
import { FullChat } from '@/types/chat';
import { setSelectedChat } from '@/store/slices/chatSlice';

interface IChatItemProps {
  chat: FullChat;
}

const ChatItem: React.FC<IChatItemProps> = ({ chat }) => {
  const dispatch = useAppDispatch();

  const handleSelectChat = () => {
    dispatch(setSelectedChat(chat));
  };
  return (
    <div onClick={handleSelectChat} key={chat.uuid} className="p-1 bg-amber-50 cursor-pointer">
      {chat.title}
    </div>
  );
};

export default ChatItem;
