import { User } from '@/entities/user';

export interface SessionState {
  accessToken: string | null;
  isInitializing: boolean;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenData {
  accessToken: string;
}

export interface LogoutRequest {
  refreshToken?: string;
}

export interface AuthData {
  user: User;
  accessToken: string;
  refreshToken?: string;
}
