import { baseApi } from '@/shared/api';
import { ApiSuccessResponse } from '@/shared/types';
import { API_ENDPOINTS, HTTP_METHODS } from '@/shared/constants';
import { SignupApiRequest, SignupResponseData } from '../model/types';

export const signupApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation<
      ApiSuccessResponse<SignupResponseData>,
      SignupApiRequest
    >({
      query: (body) => ({
        url: API_ENDPOINTS.AUTH.SIGNUP,
        method: HTTP_METHODS.POST,
        body,
      }),
    }),
  }),
});

export const { useSignupMutation } = signupApi;
