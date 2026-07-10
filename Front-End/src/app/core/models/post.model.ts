import { User } from './user.model';

export type PostStatus = 'pending' | 'approved' | 'rejected';

export interface Post {
  _id: string;
  groupId: string;
  authorId: User | string;
  content: string;
  images?: string[];
  status: PostStatus;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt?: string;
}
