import { baseApi } from '@/shared/api';
import { ApiSuccessResponse } from '@/shared/types';
import {
  ForgotPasswordRequest,
  ForgotPasswordResponseData,
  ResetPasswordRequest,
  ResetPasswordResponseData,
} from '../model/types';

export const forgotPasswordApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    forgotPassword: builder.mutation<
      ApiSuccessResponse<ForgotPasswordResponseData>,
      ForgotPasswordRequest
    >({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),

    resetPassword: builder.mutation<
      ApiSuccessResponse<ResetPasswordResponseData>,
      ResetPasswordRequest
    >({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useForgotPasswordMutation, useResetPasswordMutation } =
  forgotPasswordApi;
