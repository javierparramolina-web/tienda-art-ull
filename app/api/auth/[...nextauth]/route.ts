import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";

import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                try {
                    if (!credentials?.username || !credentials.password) return null;

                    const user = await prisma.user.findUnique({
                        where: { username: credentials.username }
                    });

                    if (!user) {
                        console.log("User not found:", credentials.username);
                        return null;
                    }

                    // Dynamic import for bcrypt to avoid build issues if not used elsewhere on edge
                    const bcrypt = await import('bcryptjs');
                    const isValid = await bcrypt.compare(credentials.password, user.password);

                    if (isValid) {
                        return { id: user.id, name: user.username, email: "admin@art-ull.es" };
                    } else {
                        console.log("Invalid password for user:", credentials.username);
                    }
                    return null;
                } catch (error) {
                    console.error("Auth Error:", error);
                    return null;
                }
            },
        }),
    ],
    pages: {
        signIn: '/auth/signin',
    },
    debug: true,
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/', // Global path so it works everywhere
                secure: process.env.NODE_ENV === 'production',
            },
        },
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = "admin";
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                // @ts-ignore
                session.user.role = token.role;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
