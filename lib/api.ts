import { ROUTES } from '@/constants/routes';

import { fetchHandler } from './handlers/fetch';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

export const api = {
  auth: {
    oAuthSignIn: ({
      user,
      provider,
      providerAccountId,
    }: SignInWithOAuthParams) =>
      fetchHandler(`${API_BASE_URL}/auth/${ROUTES.SIGN_IN_WITH_OAUTH}`, {
        method: 'POST',
        body: JSON.stringify({ user, provider, providerAccountId }),
      }),
  },
  sentiment: {
    getSentiment: (text: string) =>
      fetchHandler(
        'https://api-inference.huggingface.co/models/lxyuan/distilbert-base-multilingual-cased-sentiments-student',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ inputs: text }),
        }
      ),
  },
};
