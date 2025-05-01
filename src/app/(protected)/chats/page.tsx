'use client';

import ChatMessagesTree from '@/components/chat/ChatMessagesTree';
import { Message } from '@/types/message';
import { useEffect, useState } from 'react';
import {
  createChatRequest,
  getChatMessagesRequest,
  getUserChatsRequest,
  sendMessageRequest,
} from '@/lib/chat';
import { useAppDispatch, useAppSelector } from '@/store/hook';

import { addChat, addMessage, setChats } from '@/store/slices/chatSlice';
import ChatsSidebar from '@/components/ui/ChatsSidebar';
import { hasItems } from '@/utils/utils';
import WelcomeBlock from '@/components/ui/WelcomeBlock';

export default function Chats() {
  const dispatch = useAppDispatch();
  const selectedChat = useAppSelector((state) => state.chat.selectedChat);
  const lastMessageUuid = useAppSelector((state) => state.chat.lastMessageUuid);

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageValue, setMessageValue] = useState<string>('');
  const [nowGeneratingChatUuid, setNowGeneratingChatUuid] = useState<string | null>(null);

  const handleSendClick = async () => {
    setMessageValue('');

    if (!selectedChat || !lastMessageUuid) {
      const response = await createChatRequest({ message: messageValue });
      const newChat = response.data;
      setNowGeneratingChatUuid(newChat.uuid);
      dispatch(addChat(newChat));

      const messageResponse = await sendMessageRequest({
        chat_uuid: newChat.uuid,
        parent_uuid: newChat.messages[0].uuid,
        text: messageValue,
      });
    } else {
      const messageResponse = await sendMessageRequest({
        chat_uuid: selectedChat.uuid,
        parent_uuid: lastMessageUuid,
        text: messageValue,
      });
      dispatch(addMessage(messageResponse.data.message));
      setMessages((prevMessages) => {
        const newMessage = messageResponse.data.message;

        const updatedMessages = [...prevMessages];

        updatedMessages.push(newMessage);

        if (newMessage.parentUuid) {
          const parentIndex = updatedMessages.findIndex(
            (msg) => msg.uuid === newMessage.parentUuid,
          );

          if (parentIndex !== -1) {
            const parent = updatedMessages[parentIndex];

            updatedMessages[parentIndex] = {
              ...parent,
              children: [...(parent.children || []), newMessage.uuid],
            };
          }
        }

        return updatedMessages;
      });
    }
    console.log('After Chat Created');
    setNowGeneratingChatUuid(null);
  };

  const handleRegenerateClick = () => {
    console.log('Regenerate...');
  };

  const getUserChats = async () => {
    await getUserChatsRequest(
      (res) => {
        dispatch(setChats(res));
        // setIsPageLoading(false);
      },
      (err) => {
        // TODO add handler for error
        // router.replace('/login');
      },
    );
  };

  const getChatMessages = async (chatUuid: string) => {
    await getChatMessagesRequest(
      chatUuid,
      (res) => {
        setMessages(res);
      },
      () => {},
    );
  };

  useEffect(() => {
    getUserChats();
  }, []);

  useEffect(() => {
    if (selectedChat?.uuid === nowGeneratingChatUuid) {
      return;
    }

    if (!selectedChat) {
      setMessages([]);
      return;
    }

    if (selectedChat.messages.length === 0) {
      getChatMessages(selectedChat.uuid);
    } else {
      setMessages(selectedChat.messages);
    }
  }, [selectedChat]);

  return (
    <div className="flex w-full h-full bg-gray-100 p-0">
      <ChatsSidebar />

      <div className="flex flex-col justify-between h-full w-full max-w-[768px] bg-white shadow-lg border border-gray-200 m-auto">
        {hasItems(messages) ? (
          <ChatMessagesTree
            messages={messages}
            handleSendClick={handleSendClick}
            handleRegenerateClick={handleRegenerateClick}
          />
        ) : (
          <WelcomeBlock />
        )}

        <div className="p-4 border-t border-gray-200 flex items-center gap-2">
          <textarea
            rows={2}
            placeholder="Type your message..."
            value={messageValue}
            onChange={(e) => setMessageValue(e.target.value)}
            className="w-full resize-none border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendClick}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
            disabled={!messageValue.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
