import { baseApi } from '@/shared/api';
import { ApiSuccessResponse } from '@/shared/types';
import { AuthData } from '@/entities/session';
import { LoginSchemaType } from '../model/loginSchema';

export const loginApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ApiSuccessResponse<AuthData>, LoginSchemaType>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
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
