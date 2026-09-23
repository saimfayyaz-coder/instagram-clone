import { baseApi } from '@/shared/api';
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
