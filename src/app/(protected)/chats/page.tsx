'use client';

import ChatMessagesTree from '@/components/chat/ChatMessagesTree';
import { Message } from '@/types/message';

export default function Chats() {
  const messages: Message[] = [
    {
      uuid: 'b1c685ee-3643-4a43-a506-b7f84aa7e669',
      text: '',
      mark: 'none',
      author: 'ai',
      parent_uuid: null,
      chat_uuid: '56c5d77b-80bb-440e-b2a4-7cbf2feaaa40',
      created_at: '2025-04-17T16:19:59.100820Z',
      updated_at: '2025-04-17T16:19:59.100820Z',
      children: ['2a51cf9a-2464-4dba-b72f-ada95078dd58', 'd0c13911-6e6f-426e-80e6-02498282f297'],
    },
    {
      uuid: '2a51cf9a-2464-4dba-b72f-ada95078dd58',
      text: 'Hello world',
      mark: 'none',
      author: 'user',
      parent_uuid: 'b1c685ee-3643-4a43-a506-b7f84aa7e669',
      chat_uuid: '56c5d77b-80bb-440e-b2a4-7cbf2feaaa40',
      created_at: '2025-04-21T10:58:55.548743Z',
      updated_at: '2025-04-21T10:58:55.548743Z',
      children: ['da60307d-60a7-4b6a-8b3c-d2cad1cf3f15'],
    },
    {
      uuid: 'da60307d-60a7-4b6a-8b3c-d2cad1cf3f15',
      text: 'Hello, how can I help you?',
      mark: 'none',
      author: 'ai',
      parent_uuid: '2a51cf9a-2464-4dba-b72f-ada95078dd58',
      chat_uuid: '56c5d77b-80bb-440e-b2a4-7cbf2feaaa40',
      created_at: '2025-04-21T10:58:55.563434Z',
      updated_at: '2025-04-21T10:58:55.563434Z',
      children: [],
    },
    {
      uuid: 'd0c13911-6e6f-426e-80e6-02498282f297',
      text: 'Hello world2',
      mark: 'none',
      author: 'user',
      parent_uuid: 'b1c685ee-3643-4a43-a506-b7f84aa7e669',
      chat_uuid: '56c5d77b-80bb-440e-b2a4-7cbf2feaaa40',
      created_at: '2025-04-21T12:26:20.259020Z',
      updated_at: '2025-04-21T12:26:20.259020Z',
      children: ['6902b878-e7cb-4e6f-86ca-da2afce4fa6f'],
    },
    {
      uuid: '6902b878-e7cb-4e6f-86ca-da2afce4fa6f',
      text: 'Hello, how can I help you?',
      mark: 'none',
      author: 'ai',
      parent_uuid: 'd0c13911-6e6f-426e-80e6-02498282f297',
      chat_uuid: '56c5d77b-80bb-440e-b2a4-7cbf2feaaa40',
      created_at: '2025-04-21T12:26:20.265672Z',
      updated_at: '2025-04-21T12:26:20.265672Z',
      children: [],
    },
  ];

  const handleSendClick = () => {
    console.log('Sending...');
  };

  const handleRegenerateClick = () => {
    console.log('Regenerate...');
  };

  return (
    <div className="flex items-center justify-center w-full h-full bg-gray-100">
      <div className="flex justify-between flex-col h-full w-full max-w-[768px] bg-white shadow-lg border border-gray-200">
        <ChatMessagesTree
          messages={messages}
          handleSendClick={handleSendClick}
          handleRegenerateClick={handleRegenerateClick}
        />

        <div className="p-4 border-t border-gray-200">
          <textarea
            rows={2}
            placeholder="Type your message..."
            className="w-full resize-none border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
