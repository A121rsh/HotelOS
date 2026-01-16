// File: src/types/next-auth.d.ts

import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role: string; // ✅ Humne Role add kiya taaki TypeScript error na de
    } & DefaultSession["user"]
  }

  interface User {
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
  }
}