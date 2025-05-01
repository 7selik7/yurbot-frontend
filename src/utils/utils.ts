import { FullChat } from '@/types/chat';
import { parseISO, isToday, isYesterday, isThisMonth, subDays, format } from 'date-fns';

export type ChatGroup = Record<string, FullChat[]>;

export const groupChatsByDate = (chats: FullChat[]) => {
  const groupedChats: ChatGroup = {
    Today: [],
    Yesterday: [],
    'Previous 7 days': [],
    'Earlier this month': [],
  };

  const validChats = chats.filter((chat) => chat.updatedAt);

  const sortedChats = [...validChats].sort((a, b) => {
    return new Date(a.updatedAt) < new Date(b.updatedAt) ? 1 : -1;
  });

  sortedChats.forEach((chat) => {
    const chatDate = parseISO(chat.updatedAt);
    if (isToday(chatDate)) {
      groupedChats.Today.push(chat);
    } else if (isYesterday(chatDate)) {
      groupedChats.Yesterday.push(chat);
    } else if (chatDate >= subDays(new Date(), 7)) {
      groupedChats['Previous 7 days'].push(chat);
    } else if (isThisMonth(chatDate)) {
      groupedChats['Earlier this month'].push(chat);
    } else {
      const monthKey = format(chatDate, 'MMMM yyyy');
      if (!groupedChats[monthKey]) groupedChats[monthKey] = [];
      groupedChats[monthKey].push(chat);
    }
  });

  return groupedChats;
};

export const hasItems = <T>(arr: T[] | undefined | null): boolean => {
  return Array.isArray(arr) && arr.length > 0;
};
