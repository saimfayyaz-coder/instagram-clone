import { baseApi } from '@/shared/api';
import { ApiSuccessResponse } from '@/shared/types';
import {
  CheckUsernameResponseData,
  SignupApiRequest,
  SignupResponseData,
} from '../model/types';

export const signupApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    checkUsername: builder.query<
      ApiSuccessResponse<CheckUsernameResponseData>,
      string
    >({
      query: (username) => ({
        url: `/auth/check-username?username=${encodeURIComponent(username)}`,
        method: 'GET',
      }),
    }),

    signup: builder.mutation<
      ApiSuccessResponse<SignupResponseData>,
      SignupApiRequest
    >({
      query: (body) => ({
        url: '/auth/signup',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useCheckUsernameQuery, useLazyCheckUsernameQuery, useSignupMutation } =
  signupApi;
