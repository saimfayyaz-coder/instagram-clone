import { User } from '@/entities/user';

export interface ForgotPasswordRequest {
  identifier: string;
}

export interface ForgotPasswordResponseData {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  resetToken: string;
  newPassword: string;
}

export interface ResetPasswordResponseData {
  user: User;
  accessToken: string;
  refreshToken: string;
}
