declare global {
  interface SignInWithOAuthParams {
    provider: 'google';
    providerAccountId: string;
    user: {
      email: string;
      name: string;
      image: string;
      username: string;
    };
  }
}

export {};
