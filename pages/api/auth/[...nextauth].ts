// ============================================================
// NEXTAUTH CONFIG - Autenticación con roles
// ============================================================

import NextAuth, { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  getCredentials,
  getUserByEmail,
} from "@/lib/mock/store";

// Extender tipos de NextAuth para incluir role y projectId
declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    projectId?: string;
  }
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      projectId?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    projectId?: string;
  }
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

        // -------------------------------------------------------
        // TODO: Reemplazar con consulta real a Supabase/PostgreSQL
        // Ejemplo con Supabase:
        //   const { data } = await supabase
        //     .from('users')
        //     .select('*')
        //     .eq('email', credentials.email)
        //     .single()
        //   if (!data) return null
        //   const valid = await bcrypt.compare(credentials.password, data.password_hash)
        //   if (!valid) return null
        //   return { id: data.id, name: data.name, email: data.email, role: data.role, projectId: data.project_id }
        // -------------------------------------------------------

        const storedPassword = getCredentials()[credentials.email];
        if (!storedPassword || storedPassword !== credentials.password) {
          return null;
        }

        const user = getUserByEmail(credentials.email);
        if (!user) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          projectId: user.projectId,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.projectId = user.projectId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.projectId = token.projectId;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 horas
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
