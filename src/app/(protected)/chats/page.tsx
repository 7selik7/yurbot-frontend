'use client';

import ChatMessagesTree from '@/components/chat/ChatMessagesTree';
import { Message } from '@/types/message';
import { useEffect, useRef, useState } from 'react';
import {
  createChatRequest,
  getChatMessagesRequest,
  getUserChatsRequest,
  regenerateMessageRequest,
  sendMessageRequest,
} from '@/lib/chat';
import { useAppDispatch, useAppSelector } from '@/store/hook';

import { addChat, addMessage, removeMessage, setChats } from '@/store/slices/chatSlice';
import ChatsSidebar from '@/components/ui/ChatsSidebar';
import { hasItems } from '@/utils/utils';
import WelcomeBlock from '@/components/ui/WelcomeBlock';
import { toCamelCase } from '@/utils/toCamelCase';
import MessageTyping from '@/components/chat/MessageTyping';

export default function Chats() {
  const dispatch = useAppDispatch();
  const selectedChat = useAppSelector((state) => state.chat.selectedChat);
  const lastMessageUuid = useAppSelector((state) => state.chat.lastMessageUuid);

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageValue, setMessageValue] = useState<string>('');
  const [botResponse, setBotResponse] = useState<string>('');

  const [nowGeneratingChatUuid, setNowGeneratingChatUuid] = useState<string | null>(null);

  const [isMessageRequestsLoading, setIsMessageRequestsLoading] = useState<boolean>(false);
  const [isAnswerPreparing, setIsAnswerPreparing] = useState<boolean>(false);

  const [selectedChildIndices, setSelectedChildIndices] = useState<Record<string, number>>({});

  const scrollRef = useRef<HTMLDivElement>(null);

  // ------- Functions -------

  const ensureChatCreated = async (text: string) => {
    const response = await createChatRequest({ message: text });
    const newChat = response.data;
    dispatch(addChat(newChat));
    return {
      chat: newChat,
      parentUuid: newChat.messages[0].uuid,
    };
  };

  const sendMessageAndUpdateTree = async (chatUuid: string, parentUuid: string, text: string) => {
    const messageResponse = await sendMessageRequest({
      chat_uuid: chatUuid,
      parent_uuid: parentUuid,
      text,
    });
    const newMessage = messageResponse.data.message;

    dispatch(addMessage(newMessage));
    setMessages((prev) => {
      const updated = [...prev, newMessage];

      if (newMessage.parentUuid) {
        const parentIndex = updated.findIndex((m) => m.uuid === newMessage.parentUuid);
        if (parentIndex !== -1) {
          updated[parentIndex] = {
            ...updated[parentIndex],
            children: [...(updated[parentIndex].children || []), newMessage.uuid],
          };
        }
      }

      return updated;
    });

    setSelectedChildIndices((prev) => {
      if (!newMessage.parentUuid) return prev;
      const childrenCount = messages.filter((m) => m.parentUuid === newMessage.parentUuid).length;

      return {
        ...prev,
        [newMessage.parentUuid]: childrenCount,
      };
    });

    return messageResponse.data;
  };

  const regenerateMessageAndUpdateTree = async (messageUuid: string, chatUuid: string) => {
    const messageResponse = await regenerateMessageRequest({
      chat_uuid: chatUuid,
      message_uuid: messageUuid,
    });

    dispatch(removeMessage(messageUuid));
    setMessages((prev) => {
      const messageToRemove = prev.find((m) => m.uuid === messageUuid);
      if (!messageToRemove) return prev;

      const updated = prev.filter((m) => m.uuid !== messageUuid);

      if (messageToRemove.parentUuid) {
        const parentIndex = updated.findIndex((m) => m.uuid === messageToRemove.parentUuid);
        if (parentIndex !== -1) {
          const parent = updated[parentIndex];
          updated[parentIndex] = {
            ...parent,
            children: (parent.children || []).filter((childUuid) => childUuid !== messageUuid),
          };
        }
      }

      return updated;
    });

    return messageResponse.data;
  };

  const openWebSocket = (answerUuid: string) => {
    const ws = new WebSocket(`ws://localhost:8000/chats/ws/${answerUuid}`);

    ws.onopen = () => console.log('WebSocket opened');

    ws.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === 'message') {
        setIsAnswerPreparing(false);
        setBotResponse(data.message);
      } else if (data.type === 'close') {
        const newMessage = toCamelCase(data.message);
        dispatch(addMessage(newMessage));
        setMessages((prev) => {
          const updated = [...prev, newMessage];
          if (newMessage.parentUuid) {
            const parentIndex = updated.findIndex((m) => m.uuid === newMessage.parentUuid);
            if (parentIndex !== -1) {
              updated[parentIndex] = {
                ...updated[parentIndex],
                children: [...(updated[parentIndex].children || []), newMessage.uuid],
              };
            }
          }
          return updated;
        });
        setBotResponse('');
      }
    };
  };

  const handleSendClick = async (parentUuid?: string, text?: string) => {
    setMessageValue('');
    setIsMessageRequestsLoading(true);

    const messageText = text ?? messageValue;

    let chatUuid: string;
    let parentToUse: string;

    if (!selectedChat || !lastMessageUuid) {
      setIsAnswerPreparing(true);
      const { chat, parentUuid: generatedParent } = await ensureChatCreated(messageText);
      setNowGeneratingChatUuid(chat.uuid);
      chatUuid = chat.uuid;
      parentToUse = generatedParent;
    } else {
      chatUuid = selectedChat.uuid;
      parentToUse = parentUuid ?? lastMessageUuid;
    }

    const { message, answer } = await sendMessageAndUpdateTree(chatUuid, parentToUse, messageText);

    setIsMessageRequestsLoading(false);
    setIsAnswerPreparing(true);
    openWebSocket(answer.uuid);
    setNowGeneratingChatUuid(null);
  };

  const handleRegenerateClick = async (messageUuid: string) => {
    if (!selectedChat) return;

    setIsMessageRequestsLoading(true);
    setNowGeneratingChatUuid(selectedChat.uuid);

    const { answer } = await regenerateMessageAndUpdateTree(messageUuid, selectedChat.uuid);

    setIsMessageRequestsLoading(false);
    setIsAnswerPreparing(true);
    openWebSocket(answer.uuid);
    setNowGeneratingChatUuid(null);
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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, botResponse]);

  return (
    <div className="flex w-full h-full bg-gray-100 p-0">
      <ChatsSidebar />

      <div className="flex flex-col h-screen w-full max-w-[768px] bg-white shadow-lg border border-gray-200 m-auto ">
        <div className="p-4 space-y-4 h-full max-h-full overflow-y-auto">
          {hasItems(messages) ? (
            <>
              <ChatMessagesTree
                messages={messages}
                handleSendClick={handleSendClick}
                handleRegenerateClick={handleRegenerateClick}
                selectedChildIndices={selectedChildIndices}
                setSelectedChildIndices={setSelectedChildIndices}
              />
              <MessageTyping botResponse={botResponse} isAnswerPreparing={isAnswerPreparing} />
            </>
          ) : (
            <WelcomeBlock />
          )}
          <div ref={scrollRef} className="w-full h-[1px]" />
        </div>
        <div className="p-4 border-t border-gray-200 flex items-center gap-2">
          <textarea
            rows={2}
            placeholder="Type your message..."
            value={messageValue}
            onChange={(e) => setMessageValue(e.target.value)}
            className="w-full resize-none border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => handleSendClick()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
            disabled={!messageValue.trim()}
          >
            {isMessageRequestsLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
