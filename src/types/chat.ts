import { Message } from '@/types/message';

export interface Chat {
  uuid: string;
  title: string;
  isPinned: boolean;
  ownerUuid: string;
  createdAt: string;
  updatedAt: string;
}

export interface FullChat extends Chat {
  messages: Message[];
}

export interface CreateChatData {
  message: string;
}

export interface SendMessageData {
  chat_uuid: string;
  parent_uuid: string;
  text: string;
}

export interface RegenerateMessageData {
  chat_uuid: string;
  message_uuid: string;
}

export interface CreateChatData {
  message: string;
}

export interface SendMessageResponse {
  message: Message;
  answer: Message;
}

export interface RegenerateMessageResponse {
  answer: Message;
}
