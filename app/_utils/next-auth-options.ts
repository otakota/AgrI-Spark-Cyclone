import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

export const nextAuthOptions: NextAuthOptions = {
  debug: false, // 本番は false 推奨（必要な時だけ true）
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // ✅ ユーザー識別子を token に確実に保持
      // user.id が無いケースがあるので token.sub を優先的に使う
      const id = (user as any)?.id ?? token.sub;
      if (id) token.id = id;

      // role を使うなら残す（無いなら undefined）
      if (user) {
        const u = user as any;
        if (u?.role) token.role = u.role;
      }

      // Googleの access_token を使うなら保持（不要なら消してOK）
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }

      return token;
    },

    async session({ session, token }) {
      // ✅ session.user に id を載せる（これが無いと session.user.id が undefined）
      return {
        ...session,
        user: {
          ...session.user,
          id: (token.id ?? token.sub) as string, // ← ここが最重要
          role: token.role as any,
        },
      };
    },
  },
};
