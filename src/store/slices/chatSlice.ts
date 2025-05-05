import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FullChat } from '@/types/chat';
import { MarkType, Message } from '@/types/message';

interface ChatState {
  chats: FullChat[];
  selectedChat: FullChat | null;
  isChatsLoading: boolean;
  lastMessageUuid: string | null;
}

const initialState: ChatState = {
  chats: [],
  selectedChat: null,
  isChatsLoading: true,
  lastMessageUuid: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChats(state, action: PayloadAction<FullChat[]>) {
      state.chats = action.payload;
      state.isChatsLoading = false;
    },
    addChat(state, action: PayloadAction<FullChat>) {
      state.chats = [...state.chats, action.payload];
      state.selectedChat = action.payload;
    },
    addMessage(state, action: PayloadAction<Message>) {
      const newMessage = action.payload;

      const chat = state.chats.find((c) => c.uuid === newMessage.chatUuid);
      if (!chat) return;

      if (!chat.messages) {
        chat.messages = [];
      }

      chat.messages.push(newMessage);

      chat.updatedAt = newMessage.createdAt;

      if (newMessage.parentUuid) {
        const parent = chat.messages.find((m) => m.uuid === newMessage.parentUuid);
        if (parent) {
          if (!parent.children) {
            parent.children = [];
          }

          if (!parent.children.includes(newMessage.uuid)) {
            parent.children.push(newMessage.uuid);
          }
        }
      }
    },
    removeMessage(state, action: PayloadAction<string>) {
      const messageToRemoveUuid = action.payload;

      const chat = state.chats.find((chat) =>
        chat.messages?.some((m) => m.uuid === messageToRemoveUuid),
      );
      if (!chat) return;

      const messageToRemove = chat.messages.find((m) => m.uuid === messageToRemoveUuid);
      if (!messageToRemove) return;

      chat.messages = chat.messages.filter((m) => m.uuid !== messageToRemoveUuid);

      if (messageToRemove.parentUuid) {
        const parent = chat.messages.find((m) => m.uuid === messageToRemove.parentUuid);
        if (parent && parent.children) {
          parent.children = parent.children.filter((uuid) => uuid !== messageToRemoveUuid);
        }
      }
    },
    updateMessageMark(
      state,
      action: PayloadAction<{ messageUuid: string; chatUuid: string; mark: MarkType }>,
    ) {
      const { messageUuid, chatUuid, mark } = action.payload;

      const chat = state.chats.find((chat) => chat.uuid === chatUuid);
      if (!chat || !chat.messages) return;

      const message = chat.messages.find((msg) => msg.uuid === messageUuid);
      if (!message) return;

      message.mark = mark;
    },
    updateChatTitle(state, action: PayloadAction<{ chatUuid: string; newTitle: string }>) {
      const { chatUuid, newTitle } = action.payload;
      const chat = state.chats.find((chat) => chat.uuid === chatUuid);
      if (chat) {
        chat.title = newTitle;
      }
    },
    deleteChat(state, action: PayloadAction<string>) {
      const chatUuid = action.payload;
      state.chats = state.chats.filter((chat) => chat.uuid !== chatUuid);

      if (state.selectedChat?.uuid === chatUuid) {
        state.selectedChat = null;
      }
    },
    setSelectedChat(state, action: PayloadAction<FullChat | null>) {
      state.selectedChat = action.payload;
    },
    setLastMessageUuid(state, action: PayloadAction<string | null>) {
      state.lastMessageUuid = action.payload;
    },
  },
});

export const {
  setChats,
  setSelectedChat,
  addChat,
  setLastMessageUuid,
  addMessage,
  removeMessage,
  updateMessageMark,
  updateChatTitle,
  deleteChat,
} = chatSlice.actions;
export default chatSlice.reducer;
