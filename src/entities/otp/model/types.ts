import { User } from '@/entities/user';
import type { OtpPurpose } from '@/shared/constants';

export type { OtpPurpose };

export interface VerifyOtpRequest {
  email: string;
  otp: string;
  purpose?: OtpPurpose;
}

export interface VerifyOtpResponseData {
  user?: User;
  accessToken?: string;
  refreshToken?: string;
  resetToken?: string;
  email?: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data?: VerifyOtpResponseData;
}

export interface ResendOtpRequest {
  email: string;
  purpose?: OtpPurpose;
}

export interface ResendOtpResponse {
  success: boolean;
  message: string;
}
