export enum MarkType {
  LIKE = 'like',
  DISLIKE = 'dislike',
  NONE = 'none',
}

export interface Message {
  uuid: string;
  text: string;
  mark: MarkType;
  author: 'user' | 'ai';
  parentUuid: string | null;
  chatUuid: string;
  children: string[];
  createdAt: string;
  updatedAt: string;
}
