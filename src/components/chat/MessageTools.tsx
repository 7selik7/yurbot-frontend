'use client';

import React, { useState } from 'react';
import {
  CheckIcon,
  ClipboardIcon,
  PencilSquareIcon,
  HandThumbUpIcon,
  HandThumbUpIcon as HandThumbUpOutline,
  HandThumbDownIcon,
  HandThumbDownIcon as HandThumbDownOutline,
  ArrowPathIcon,
} from '@heroicons/react/24/solid';
import { Message } from '@/types/message';

interface IMessageToolsProps {
  message: Message;
  isVisible: boolean;
  handleEditStart: () => void;
  handleRegenerateClick: () => void;
  hideMessageTools: () => void;
  isNowGenerating: boolean;
  isLoading: boolean;
}

const MessageTools: React.FC<IMessageToolsProps> = ({
  message,
  isVisible,
  handleEditStart,
  hideMessageTools,
  isNowGenerating,
  isLoading,
}) => {
  const [messageCopied, setMessageCopied] = useState(false);
  const [option, setOption] = useState(message.mark);

  const handleClickCopyMessage = () => {
    navigator.clipboard.writeText(message.text);
    if (!messageCopied) {
      setMessageCopied(true);
      setTimeout(() => setMessageCopied(false), 2000);
    }
  };

  const regenerateClick = () => {
    console.log('Regenerate click');
  };

  const handleOptionClick = () => {
    console.log('Update option');
  };

  if (!isVisible) {
    return <div className="h-[24px] mb-2" />;
  }

  return (
    <div className="flex flex-row gap-2 mb-2">
      {message?.text && (
        <button
          title={messageCopied ? 'Copied!' : 'Copy'}
          onClick={handleClickCopyMessage}
          className="p-1 rounded-md hover:bg-gray-200 transition"
        >
          {messageCopied ? (
            <CheckIcon className="w-4 h-4" />
          ) : (
            <ClipboardIcon className="w-4 h-4" />
          )}
        </button>
      )}

      {message.author === 'user' && (
        <button
          onClick={handleEditStart}
          title="Edit"
          disabled={isNowGenerating || isLoading}
          className="p-1 rounded-md hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PencilSquareIcon className="w-4 h-4" />
        </button>
      )}

      {message.author === 'ai' && (
        <>
          <button
            title="Like"
            onClick={handleOptionClick}
            className="p-1 rounded-md hover:bg-gray-200 transition"
          >
            {/*TODO add ENUM*/}
            {option === 'like' ? (
              <HandThumbUpIcon className="w-4 h-4 text-blue-500" />
            ) : (
              <HandThumbUpOutline className="w-4 h-4" />
            )}
          </button>

          <button
            title="Dislike"
            onClick={handleOptionClick}
            className="p-1 rounded-md hover:bg-gray-200 transition"
          >
            {option === 'dislike' ? (
              <HandThumbDownIcon className="w-4 h-4 text-red-500" />
            ) : (
              <HandThumbDownOutline className="w-4 h-4" />
            )}
          </button>

          {message.children?.length === 0 && (
            <button
              title="Regenerate"
              onClick={regenerateClick}
              disabled={isNowGenerating || isLoading}
              className="p-1 rounded-md hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowPathIcon className="w-4 h-4" />
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default MessageTools;
