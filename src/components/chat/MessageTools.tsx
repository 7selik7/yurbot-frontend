'use client';

import React, { useState } from 'react';
import {
  ArrowPathIcon,
  CheckIcon,
  ClipboardIcon,
  HandThumbDownIcon as HandThumbDownOutline,
  HandThumbDownIcon,
  HandThumbUpIcon as HandThumbUpOutline,
  HandThumbUpIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/solid';
import { MarkType, Message } from '@/types/message';
import { markMessageRequest } from '@/lib/chat';
import { useAppDispatch } from '@/store/hook';
import { updateMessageMark } from '@/store/slices/chatSlice';

interface IMessageToolsProps {
  message: Message;
  isVisible: boolean;
  handleEditStart: () => void;
  handleRegenerateClick: (messageUuid: string) => void;
  hideMessageTools: () => void;
  isNowGenerating: boolean;
  isLoading: boolean;
}

const MessageTools: React.FC<IMessageToolsProps> = ({
  message,
  isVisible,
  handleEditStart,
  handleRegenerateClick,
  hideMessageTools,
  isNowGenerating,
  isLoading,
}) => {
  const dispatch = useAppDispatch();

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
    handleRegenerateClick(message.uuid);
  };

  const handleOptionClick = async (selected: MarkType) => {
    const newMark = option === selected ? MarkType.NONE : selected;

    await markMessageRequest(
      message.uuid,
      { mark: newMark },
      () => {
        setOption(newMark);
        dispatch(
          updateMessageMark({
            messageUuid: message.uuid,
            chatUuid: message.chatUuid,
            mark: newMark,
          }),
        );
      },
      () => {},
    );
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
            onClick={() => handleOptionClick(MarkType.LIKE)}
            className="p-1 rounded-md hover:bg-gray-200 transition"
          >
            {option === MarkType.LIKE ? (
              <HandThumbUpIcon className="w-4 h-4 text-blue-500" />
            ) : (
              <HandThumbUpOutline className="w-4 h-4" />
            )}
          </button>

          <button
            title="Dislike"
            onClick={() => handleOptionClick(MarkType.DISLIKE)}
            className="p-1 rounded-md hover:bg-gray-200 transition"
          >
            {option === MarkType.DISLIKE ? (
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
