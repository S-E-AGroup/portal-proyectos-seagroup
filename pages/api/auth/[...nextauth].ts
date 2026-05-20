import NextAuth, { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyUserPassword } from "@/lib/supabase-store";

declare module "next-auth" {
  interface User { id: string; role: string; projectId?: string; }
  interface Session { user: { id: string; name: string; email: string; role: string; projectId?: string; }; }
}
declare module "next-auth/jwt" {
  interface JWT { id: string; role: string; projectId?: string; }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials): Promise<NextAuthUser | null> {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const user = await verifyUserPassword(credentials.email, credentials.password);
          if (!user) return null;
          return { id: user.id, name: user.name, email: user.email, role: user.role, projectId: user.projectId };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.id = user.id; token.role = user.role; token.projectId = user.projectId; }
      return token;
    },
    async session({ session, token }) {
      if (session.user) { session.user.id = token.id; session.user.role = token.role; session.user.projectId = token.projectId; }
      return session;
    },
  },
  pages: { signIn: "/login", error: "/login" },
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
