import { baseApi } from '@/shared/api';
import { ApiSuccessResponse } from '@/shared/types';
import { API_ENDPOINTS, HTTP_METHODS } from '@/shared/constants';
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
        url: API_ENDPOINTS.AUTH.VERIFY_OTP,
        method: HTTP_METHODS.POST,
        body,
      }),
    }),

    resendOtp: builder.mutation<
      ApiSuccessResponse<{ email: string }>,
      ResendOtpRequest
    >({
      query: (body) => ({
        url: API_ENDPOINTS.AUTH.RESEND_OTP,
        method: HTTP_METHODS.POST,
        body,
      }),
    }),
  }),
});

export const { useVerifyOtpMutation, useResendOtpMutation } = otpApi;
