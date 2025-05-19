export interface AuthenticatedUser {
  userId: number;
  username: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
