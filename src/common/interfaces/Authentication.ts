import { Request } from 'express';

export interface AuthenticatedUser {
  id: number;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface CustomRequest extends Request {
  user: {
    sub: number;
  };
  params: {
    [key: string]: string;
  };
  body: {
    [key: string]: string;
  };
}

export interface ResourceWithUser {
  id: number;
  user: { id: number };
}
