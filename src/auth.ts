import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { db } from "@/lib/db"
import { compare } from "bcryptjs" // ✅ Ye zaroori hai (Registration se match karne ke liye)

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

        // 4. Password Compare karo (Bcryptjs use karke)
        const isMatch = await compare(password, user.password);

        if (!isMatch) {
          throw new Error("Incorrect Password"); // <-- Ye wahi error hai jo aapko aa raha tha
        }

        // 5. Sab sahi hai, User return karo
        return user;
      }
    })
  ],
  pages: {
    signIn: '/login', // Custom login page
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      // Role bhi session me daal dete hain (Future use ke liye)
      // session.user.role = token.role; 
      return session;
    },
    async jwt({ token }) {
      return token;
    }
  }
})