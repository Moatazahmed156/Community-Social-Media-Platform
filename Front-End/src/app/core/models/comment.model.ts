import { User } from './user.model';

export interface Comment {
  _id: string;
  postId: string;
  authorId: User | string;
  content: string;
  createdAt: string;
}
