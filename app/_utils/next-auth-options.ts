import type { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";

export const nextAuthOptions: NextAuthOptions = {
  debug: true,
  session: { strategy: "jwt" },

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      // user がある場合（初回ログイン時）
      if (user) {
        token.user = user;
        const u = user as any;
        token.role = u.role;
      }

      // アクセストークン（Google 認証情報）の保存
      if (account) {
        token.accessToken = account.access_token;
      }

      return token;
    },

    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,   // ← ユーザーIDを Supabase 保存に使える！
          role: token.role,
        },
        accessToken: token.accessToken,
      };
    },
  },
};
