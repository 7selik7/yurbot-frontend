export interface Message {
  uuid: string;
  text: string;
  mark: 'none' | 'like' | 'dislike';
  author: 'user' | 'ai';
  parent_uuid: string | null;
  chat_uuid: string;
  children: string[];
  created_at: string;
  updated_at: string;
}
