import { baseApi } from '@/shared/api';
import { setAccessToken, authStorage } from '@/entities/session';
import { setUser } from '@/entities/user';
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
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const authData = data.data;

          if (authData.refreshToken) {
            await authStorage.saveRefreshToken(authData.refreshToken);
          }
          dispatch(setAccessToken(authData.accessToken));
          dispatch(setUser(authData.user));
        } catch {
          // Errors handled by component or baseQuery
        }
      },
    }),
  }),
});

export const { useLoginMutation } = loginApi;
