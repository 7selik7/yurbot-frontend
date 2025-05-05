import { axiosInstance } from '@/lib/instance';
import {
  CreateChatData,
  FullChat,
  MarkMessageData,
  RegenerateMessageData,
  RegenerateMessageResponse,
  SendMessageData,
  SendMessageResponse,
  UpdateChatTitleData,
} from '@/types/chat';
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

export const regenerateMessageRequest = async (regenerateMessageData: RegenerateMessageData) => {
  try {
    return await axiosInstance.post<RegenerateMessageResponse>(
      `/chats/regenerate_message`,
      regenerateMessageData,
    );
  } catch (e) {
    throw e;
  }
};

export const updateChatTitleRequest = async (
  chatUuid: string,
  updateChatTitleData: UpdateChatTitleData,
  callback: () => void,
  errorCallback: () => void,
) => {
  axiosInstance
    .patch(`/chats/${chatUuid}/title`, updateChatTitleData)
    .then(() => {
      callback();
    })
    .catch(() => {
      errorCallback();
    });
};

export const markMessageRequest = async (
  messageUuid: string,
  markMessageData: MarkMessageData,
  callback: () => void,
  errorCallback: () => void,
) => {
  axiosInstance
    .patch(`/chats/${messageUuid}/mark`, markMessageData)
    .then(() => {
      callback();
    })
    .catch(() => {
      errorCallback();
    });
};

export const deleteChatRequest = async (
  chatUuid: string,
  callback: () => void,
  errorCallback: () => void,
) => {
  axiosInstance
    .delete(`/chats/${chatUuid}`)
    .then(() => {
      callback();
    })
    .catch(() => {
      errorCallback();
    });
};
