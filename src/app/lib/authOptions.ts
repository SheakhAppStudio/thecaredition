import CredentialsProvider from "next-auth/providers/credentials";
import type { AuthOptions } from "next-auth";
import { dbConnect, collections } from "@/app/lib/dbConnect";

// Extend Session interface to include custom fields
declare module "next-auth" {
  interface Session {
    user?: {
      id: string;
      name?: string | null;
      email?: string | null;
      adminPhoto?: string | null;
      role: string;
      instituteId?: string;
      permissions :string[]

    };
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@gmail.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Missing credentials");
        }

        const { email, password } = credentials;

        const user = await dbConnect(collections.users).findOne<{
          _id: string;
          name?: string;
          email: string;
          password: string;
          role: string;
          adminPhoto: string;
          instituteId?: string;
          permissions?: string[];
        }>({ email,password });

        if (!user) {
          throw new Error("Invalid email or password");
        }

console.log(user)

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          adminPhoto: user.adminPhoto,
          instituteId: user.instituteId ?? "",
          permissions: user.permissions ?? [] ,
        };
      },
    }),
  ],

  pages: {
    signIn: "/signin",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id: string }).id;
        token.name = user.name;
        token.adminPhoto = (user as { adminPhoto?: string }).adminPhoto;
        token.email = user.email;
        if ('role' in user) {
          token.role = user.role;
        }
        token.instituteId = (user as { instituteId?: string }).instituteId;
        token.permissions = (user as { permissions?: string[] }).permissions;
      }
      return token;
    },

    async session({ session, token }) {
      if (!session.user) {
        session.user = {
          id: "",
          name: null,
          email: null,
          adminPhoto: null,
          role: "",
          instituteId: "",
          permissions: []
        };
      }

      session.user.id = token.id as string;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.adminPhoto = token.adminPhoto  as string | null | undefined;
      session.user.role = typeof token.role === "string" ? token.role : "";
      session.user.instituteId = typeof token.instituteId === "string" ? token.instituteId : "";
      session.user.permissions = token.permissions as string[]

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
