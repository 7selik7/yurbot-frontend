import { axiosInstance } from '@/lib/instance';
import { CreateChatData, FullChat, SendMessageData, SendMessageResponse } from '@/types/chat';
import { Message } from '@/types/message';

export const getUserChatsRequest = async (
  callback: (res: FullChat[]) => void,
  errorCallback: (err: unknown) => void,
) => {
  axiosInstance
    .get<FullChat[]>('/chats/')
    .then((response) => {
      callback(response.data);
    })
    .catch((err) => {
      errorCallback(err);
    });
};

export const getChatMessagesRequest = async (
  chatId: string,
  callback: (res: Message[]) => void,
  errorCallback: (err: unknown) => void,
) => {
  axiosInstance
    .get<Message[]>(`/chats/${chatId}/messages`)
    .then((response) => {
      callback(response.data);
    })
    .catch((err) => {
      errorCallback(err);
    });
};

export const createChatRequest = async (createChatData: CreateChatData) => {
  try {
    return await axiosInstance.post<FullChat>('/chats', createChatData);
  } catch (e) {
    throw e;
  }
};

export const sendMessageRequest = async (sendMessageData: SendMessageData) => {
  try {
    return await axiosInstance.post<SendMessageResponse>(`/chats/send_message`, sendMessageData);
  } catch (e) {
    throw e;
  }
};
