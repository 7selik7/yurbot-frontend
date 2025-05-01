'use client';

import React, { useState } from 'react';
import UserAvatar from '@/components/chat/UserAvatar';
import MessageTools from '@/components/chat/MessageTools';
import Markdown from 'react-markdown';
import { Message } from '@/types/message';

interface IChatMessageProps {
  message: Message;
  handleSendClick: () => void;
  handleRegenerateClick: () => void;
}

const ChatMessage: React.FC<IChatMessageProps> = ({
  message,
  handleSendClick,
  handleRegenerateClick,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(message.text || '');
  const [isHovered, setIsHovered] = useState(false);

  const userData = { username: 'You' };

  const handleEditStart = () => setIsEditing(true);
  const handleEditCancel = () => {
    setEditedText(message.text || '');
    setIsEditing(false);
  };
  const handleEditConfirm = () => {
    // handleSendClick(editedText);
    console.log('Edit confirm');
    setIsEditing(false);
  };

  if (message.parentUuid === null) {
    return null;
  }

  return (
    <div
      className="flex flex-row gap-3 w-full max-w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {message.author === 'user' ? (
        <UserAvatar />
      ) : (
        <div className="w-[30px] h-[30px] rounded-full bg-black flex items-center justify-center flex-shrink-0">
          <span className="text-white">Y</span>
        </div>
      )}

      <div className="flex flex-col w-full">
        <div className="text-sm font-semibold mb-1 pl-[5px]">
          {message.author === 'user' ? userData.username || 'You' : 'YurBot'}
        </div>

        {isEditing ? (
          <textarea
            className="w-full resize-none border border-gray-300 rounded-md px-2 py-1 mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
          />
        ) : (
          <Markdown>{message.text}</Markdown>
        )}

        {isEditing ? (
          <div className="flex flex-row gap-2 mt-2">
            <button
              onClick={handleEditConfirm}
              className="px-2 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600"
              title="Confirm"
            >
              ✅
            </button>
            <button
              onClick={handleEditCancel}
              className="px-2 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
              title="Cancel"
            >
              ❌
            </button>
          </div>
        ) : (
          <MessageTools
            message={message}
            isVisible={isHovered}
            handleEditStart={handleEditStart}
            handleRegenerateClick={handleRegenerateClick}
            hideMessageTools={() => setIsHovered(false)}
            isNowGenerating={false}
            isLoading={false}
          />
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
