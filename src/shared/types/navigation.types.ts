export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  OtpVerification: { email: string };
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};
