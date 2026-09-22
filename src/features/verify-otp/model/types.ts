import { User } from '@/entities/user';

export type OtpPurpose =
  | 'signup'
  | 'login_unverified'
  | 'forgot_password'
  | 'change_password';

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyOtpResponseData {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data?: VerifyOtpResponseData;
}

export interface ResendOtpRequest {
  email: string;
}

export interface ResendOtpResponse {
  success: boolean;
  message: string;
}

export interface OtpFormProps {
  email: string;
  purpose?: OtpPurpose;
  onSuccess?: (data?: VerifyOtpResponseData) => void;
  onBackPress?: () => void;
}
