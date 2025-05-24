import { Document } from '@/types/document';

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
  documents: Document[];
  createdAt: string;
  updatedAt: string;
}
