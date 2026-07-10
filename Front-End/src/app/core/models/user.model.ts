export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  bio?: string;
  profilePicture?: string;
  coverPicture?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}
