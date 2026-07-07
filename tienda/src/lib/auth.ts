import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { verifyAdmin } from '@/lib/db'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const admin = verifyAdmin(credentials.email, credentials.password)
        if (!admin) return null

        return {
          id: String(admin.id),
          email: admin.email,
          name: 'Admin',
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'carbonz-admin-secret-2026',
}
