import { baseApi } from '@/shared/api';
import { setAccessToken, authStorage } from '@/entities/session';
import { setUser } from '@/entities/user';
import { ApiSuccessResponse } from '@/shared/types';
import {
  VerifyOtpRequest,
  VerifyOtpResponseData,
  ResendOtpRequest,
} from '../model/types';

export const otpApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    verifyOtp: builder.mutation<
      ApiSuccessResponse<VerifyOtpResponseData>,
      VerifyOtpRequest
    >({
      query: (body) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const authData = data.data;

          if (authData?.refreshToken) {
            await authStorage.saveRefreshToken(authData.refreshToken);
          }
          if (authData?.accessToken) {
            dispatch(setAccessToken(authData.accessToken));
          }
          if (authData?.user) {
            dispatch(setUser(authData.user));
          }
        } catch {
          // Errors handled by caller / component
        }
      },
    }),

    resendOtp: builder.mutation<
      ApiSuccessResponse<{ email: string }>,
      ResendOtpRequest
    >({
      query: (body) => ({
        url: '/auth/resend-otp',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useVerifyOtpMutation, useResendOtpMutation } = otpApi;
