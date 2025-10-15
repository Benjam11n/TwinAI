import { ROUTES } from '@/constants/routes';
import { IAccount } from '@/database/account.model';
import { ITherapist } from '@/database/therapist.model';

import { fetchHandler } from './handlers/fetch';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

export const api = {
  auth: {
    oAuthSignIn: ({ user, provider, providerAccountId }: SignInWithOAuthParams) =>
      fetchHandler(`${API_BASE_URL}/auth/${ROUTES.SIGN_IN_WITH_OAUTH}`, {
        method: 'POST',
        body: JSON.stringify({ user, provider, providerAccountId }),
      }),
  },
  therapists: {
    getAll: () => fetchHandler(`${API_BASE_URL}/therapists`),
    getById: (id: string) => fetchHandler(`${API_BASE_URL}/therapists/${id}`),
    getByEmail: (email: string) =>
      fetchHandler(`${API_BASE_URL}/therapists/email`, {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),
    create: (userData: Partial<ITherapist>) =>
      fetchHandler(`${API_BASE_URL}/therapists`, {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    update: (id: string, therapistData: Partial<ITherapist>) =>
      fetchHandler(`${API_BASE_URL}/therapists/${id}`, {
        method: 'PUT',
        body: JSON.stringify(therapistData),
      }),
    delete: (id: string) =>
      fetchHandler(`${API_BASE_URL}/therapists/${id}`, {
        method: 'DELETE',
      }),
  },
  accounts: {
    getAll: () => fetchHandler(`${API_BASE_URL}/accounts`),
    getById: (id: string) => fetchHandler(`${API_BASE_URL}/accounts/${id}`),
    getByProvider: (providerAccountId: string) =>
      fetchHandler(`${API_BASE_URL}/accounts/provider`, {
        method: 'POST',
        body: JSON.stringify({ providerAccountId }),
      }),
    create: (accountData: Partial<IAccount>) =>
      fetchHandler(`${API_BASE_URL}/accounts`, {
        method: 'POST',
        body: JSON.stringify(accountData),
      }),
    update: (id: string, accountData: Partial<IAccount>) =>
      fetchHandler(`${API_BASE_URL}/accounts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(accountData),
      }),
    delete: (id: string) => fetchHandler(`${API_BASE_URL}/accounts/${id}`, { method: 'DELETE' }),
  },
};
