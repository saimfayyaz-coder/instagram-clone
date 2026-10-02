import { baseApi } from '@/shared/api';
import { ApiSuccessResponse } from '@/shared/types';
import { API_ENDPOINTS, HTTP_METHODS } from '@/shared/constants';
import { AuthData } from '@/entities/session';
import { LoginSchemaType } from '../model/loginSchema';

export const loginApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ApiSuccessResponse<AuthData>, LoginSchemaType>({
      query: (credentials) => ({
        url: API_ENDPOINTS.AUTH.LOGIN,
        method: HTTP_METHODS.POST,
        body: {
          email: credentials.identifier,
          identifier: credentials.identifier,
          password: credentials.password,
        },
      }),
    }),
  }),
});

export const { useLoginMutation } = loginApi;
