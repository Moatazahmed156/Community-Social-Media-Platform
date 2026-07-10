import { User } from './user.model';

export type NotificationType =
  | 'postApproved'
  | 'postRejected'
  | 'comment'
  | 'reaction'
  | 'announcement';

export interface AppNotification {
  _id: string;
  recipientId: string;
  senderId?: User | string;
  type: NotificationType;
  message: string;
  referenceId?: string;
  isRead: boolean;
  createdAt: string;
}
