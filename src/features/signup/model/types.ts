export type SignupStep = 1 | 2 | 3 | 4;

export interface SignupFormData {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  name: string;
}

export interface CheckUsernameResponseData {
  username: string;
  isAvailable: boolean;
}

export interface SignupResponseData {
  email: string;
  username: string;
  requiresOtp: boolean;
}

export interface SignupApiRequest {
  username: string;
  email: string;
  password: string;
  name?: string;
}
