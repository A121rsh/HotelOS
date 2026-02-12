import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { db } from "@/lib/db"
import { compare } from "bcryptjs"
import { recordAuditLog } from "@/lib/logger"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        // 1. Credentials check karo
        const email = credentials.email as string | undefined;
        const password = credentials.password as string | undefined;

        if (!email || !password) {
          throw new Error("Missing email or password");
        }

        // 2. User ko database me dhoondo
        const user = await db.user.findUnique({
          where: { email }
        });

        // 3. Agar user nahi mila
        if (!user || !user.password) {
          throw new Error("User not found");
        }

        // 4. Password Compare karo
        const isMatch = await compare(password, user.password);

        if (!isMatch) {
          // Log Failed Attempt
          await recordAuditLog({
            type: "FAILED_LOGIN",
            severity: "WARNING",
            message: `Unprivileged access attempt for email: ${email}`,
            metadata: { email }
          });
          throw new Error("Incorrect Password");
        }

        // 5. Sab sahi hai, User return karo
        return user;
      }
    })
  ],
  events: {
    async signIn({ user }) {
      await recordAuditLog({
        type: "LOGIN",
        message: `Node access authorized for ${user.email}`,
        userId: user.id
      });
    },
    async signOut(params) {
      const token = (params as any).token;
      if (token?.sub) {
        await recordAuditLog({
          type: "LOGOUT",
          message: `Node disconnected by user session`,
          userId: token.sub as string
        });
      }
    }
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    // ✅ JWT Callback: Jab token banega, tab database se role utha kar token me daalenge
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id; // User ID
        token.role = user.role; // ✅ User Role (OWNER / FRONT_DESK etc.)
        token.permissions = user.permissions; // ✅ Permissions add kar diya
      }
      return token;
    },
    // ✅ Session Callback: Frontend ko token se role pass karenge
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = token.role as string; // ✅ Frontend ab role padh sakega
        session.user.permissions = token.permissions as string[]; // ✅ Frontend ab permissions padh sakega
      }
      return session;
    }
  }
})