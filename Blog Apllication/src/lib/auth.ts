import { Auth } from '@auth/core';
import GitHub from '@auth/core/providers/github';
import { defineConfig } from '@auth/core/config';

export const authConfig = defineConfig({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
});

export const { GET, POST } = Auth(authConfig);