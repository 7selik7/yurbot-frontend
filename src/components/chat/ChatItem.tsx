'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch } from '@/store/hook';
import { FullChat } from '@/types/chat';
import { deleteChat, setSelectedChat, updateChatTitle } from '@/store/slices/chatSlice';
import {
  EllipsisVerticalIcon,
  TrashIcon,
  PencilIcon,
  ShareIcon,
  CheckIcon,
} from '@heroicons/react/24/solid';
import { deleteChatRequest, updateChatTitleRequest } from '@/lib/chat';

interface IChatItemProps {
  chat: FullChat;
}

const ChatItem: React.FC<IChatItemProps> = ({ chat }) => {
  const dispatch = useAppDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(chat.title);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const editRef = useRef<HTMLDivElement>(null);

  const handleSelectChat = () => {
    dispatch(setSelectedChat(chat));
  };

  const handleEditConfirm = async () => {
    setIsEditing(false);
    await updateChatTitleRequest(
      chat.uuid,
      { new_title: title },
      () => {
        dispatch(updateChatTitle({ chatUuid: chat.uuid, newTitle: title }));
      },
      () => {},
    );
  };

  const handleDelete = async () => {
    await deleteChatRequest(
      chat.uuid,
      () => {
        dispatch(deleteChat(chat.uuid));
      },
      () => {},
    );
  };

  const handleShare = () => {
    console.log('🔗 Поделиться чатом:', chat.uuid);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleClickOutsideEdit = (event: MouseEvent) => {
      if (isEditing && editRef.current && !editRef.current.contains(event.target as Node)) {
        handleEditConfirm();
      }
    };

    document.addEventListener('mousedown', handleClickOutsideEdit);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideEdit);
    };
  }, [isEditing]);

  return (
    <div className="relative group bg-amber-50 p-2 flex justify-between items-center hover:bg-amber-100">
      <div onClick={handleSelectChat} className="flex-1 cursor-pointer">
        {isEditing ? (
          <div ref={editRef} className="flex items-center gap-2">
            <input
              ref={inputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 w-full text-sm"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleEditConfirm()}
            />
            <button onClick={handleEditConfirm}>
              <CheckIcon className="w-4 h-4 text-green-600" />
            </button>
          </div>
        ) : (
          <div className="text-sm text-gray-800 truncate">{chat.title}</div>
        )}
      </div>

      <div className="relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-1 rounded hover:bg-gray-200"
        >
          <EllipsisVerticalIcon className="w-5 h-5 text-gray-600" />
        </button>

        {isMenuOpen && (
          <div
            ref={dropdownRef}
            className="absolute right-0 top-8 z-10 bg-white shadow border rounded w-40 text-sm"
          >
            <button
              onClick={() => {
                setIsEditing(true);
                setIsMenuOpen(false);
                setTimeout(() => inputRef.current?.focus(), 0);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100"
            >
              <PencilIcon className="w-4 h-4 text-gray-600" />
              Редагувати
            </button>
            <button
              onClick={() => {
                handleDelete();
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100"
            >
              <TrashIcon className="w-4 h-4 text-red-500" />
              Видалити
            </button>
            <button
              onClick={() => {
                handleShare();
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100"
            >
              <ShareIcon className="w-4 h-4 text-blue-500" />
              Поділитись
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatItem;
