export interface AuthenticatedUser {
  userId: number;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
