export interface Message {
  uuid: string;
  text: string;
  mark: 'none' | 'like' | 'dislike';
  author: 'user' | 'ai';
  parentUuid: string | null;
  chatUuid: string;
  children: string[];
  createdAt: string;
  updatedAt: string;
}
