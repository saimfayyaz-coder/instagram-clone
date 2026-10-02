import { baseApi } from '@/shared/api';
import { ApiSuccessResponse } from '@/shared/types';
import { API_ENDPOINTS, HTTP_METHODS } from '@/shared/constants';
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
        url: API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
        method: HTTP_METHODS.POST,
        body,
      }),
    }),

    resetPassword: builder.mutation<
      ApiSuccessResponse<ResetPasswordResponseData>,
      ResetPasswordRequest
    >({
      query: (body) => ({
        url: API_ENDPOINTS.AUTH.RESET_PASSWORD,
        method: HTTP_METHODS.POST,
        body,
      }),
    }),
  }),
});

export const { useForgotPasswordMutation, useResetPasswordMutation } =
  forgotPasswordApi;
