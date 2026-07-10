import { User } from './user.model';

export type GroupRole = 'owner' | 'admin' | 'member';

export interface Group {
  _id: string;
  name: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GroupMember {
  _id: string;
  groupId: string;
  userId: User | string;
  role: GroupRole;
  createdAt?: string;
}
