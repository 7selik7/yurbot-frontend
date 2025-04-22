'use client';

import { useAppDispatch } from '@/store/hook';
import React, { useEffect, useState } from 'react';
import { Message } from '@/types/message';
import ChatMessage from '@/components/chat/ChatMessage';

interface IChatMessageTreeProps {
  messages: Message[];
  handleSendClick: () => void;
  handleRegenerateClick: () => void;
}

const ChatMessagesTree: React.FC<IChatMessageTreeProps> = ({
  messages,
  handleSendClick,
  handleRegenerateClick,
}) => {
  const dispatch = useAppDispatch();
  const [selectedChildIndices, setSelectedChildIndices] = useState<Record<string, number>>({});

  const buildMessageBranch = (): Message[] => {
    const branch: Message[] = [];
    const rootMessage = messages.find((m) => m.parent_uuid === null);

    if (!rootMessage) {
      return branch;
    }

    let currentMessage = rootMessage;
    branch.push(currentMessage);

    while (currentMessage.children && currentMessage.children.length > 0) {
      const selectedIndex = selectedChildIndices[currentMessage.uuid] || 0;
      const nextMessageUuid = currentMessage.children[selectedIndex];
      const nextMessage = messages.find((m) => m.uuid === nextMessageUuid);

      if (!nextMessage) {
        break;
      }

      branch.push(nextMessage);
      currentMessage = nextMessage;
    }

    return branch;
  };

  const handleChildSelect = (messageUuid: string, direction: 'prev' | 'next') => {
    const currentIndex = selectedChildIndices[messageUuid] || 0;
    const childrenCount = messages.find((m) => m.uuid === messageUuid)?.children.length || 0;

    let newIndex = currentIndex;

    if (direction === 'prev' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else if (direction === 'next' && currentIndex < childrenCount - 1) {
      newIndex = currentIndex + 1;
    }

    setSelectedChildIndices((prev) => ({
      ...prev,
      [messageUuid]: newIndex,
    }));
  };

  const messagesBranch = buildMessageBranch();

  useEffect(() => {
    if (messagesBranch.length > 0) {
      const lastMessage = messagesBranch[messagesBranch.length - 1];
      console.log(lastMessage);
      // dispatch(setLastMessage(lastMessage));
    }
  }, [messagesBranch, dispatch]);

  useEffect(() => {
    setSelectedChildIndices({});
  }, []);

  return (
    <div className="p-4 space-y-4 overflow-y-auto">
      {messagesBranch.map((message) => (
        <div key={message.uuid}>
          <ChatMessage
            key={message.uuid}
            message={message}
            handleSendClick={handleSendClick}
            handleRegenerateClick={handleRegenerateClick}
          />
          {message.children && message.children.length > 1 && (
            <div className="flex flex-row items-center justify-center w-full max-w-[768px] mx-auto mb-2 gap-2">
              <button
                onClick={() => handleChildSelect(message.uuid, 'prev')}
                disabled={(selectedChildIndices[message.uuid] || 0) === 0}
                className="p-1 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <span className="text-sm">
                {(selectedChildIndices[message.uuid] || 0) + 1} / {message.children.length}
              </span>

              <button
                onClick={() => handleChildSelect(message.uuid, 'next')}
                disabled={(selectedChildIndices[message.uuid] || 0) === message.children.length - 1}
                className="p-1 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatMessagesTree;
