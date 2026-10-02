import { baseApi } from '@/shared/api';
import { ApiSuccessResponse } from '@/shared/types';
import { SignupApiRequest, SignupResponseData } from '../model/types';

export const signupApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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

export const { useSignupMutation } = signupApi;
