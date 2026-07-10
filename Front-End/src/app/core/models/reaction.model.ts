import { User } from './user.model';

export type ReactionType = 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry';

export interface Reaction {
  _id: string;
  postId: string;
  userId: User | string;
  type: ReactionType;
}

export interface ReactionSummary {
  counts: Partial<Record<ReactionType, number>>;
  total: number;
  myReaction: ReactionType | null;
  reactions: Reaction[];
}
