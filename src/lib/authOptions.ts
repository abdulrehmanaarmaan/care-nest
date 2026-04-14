import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { login } from "../server/actions/auth"
import GoogleProvider from "next-auth/providers/google";
import { collections, dbConnect } from "./dbConnect";
import bcrypt from 'bcryptjs'

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [

        Credentials({
            name: "Credentials",
            credentials: {},
            async authorize(credentials) {
                if (!credentials) return null

                const user = await login(credentials)
                if (!user) return null

                return {
                    id: user._id.toString(), // MUST convert Mongo ObjectId
                    name: user.name,
                    email: user.email,
                }
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.email = user.email
            }
            return token
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.email = token.email
            }
            return session
        },
        async signIn({ user, account }) {

            const { name, email, image } = user

            const { provider } = account

            // const toString = password.toString()

            const query = {
                email: email,
                provider: provider
            }

            const existingUser = await dbConnect(collections?.users).findOne(query)

            if (existingUser) {
                return true
            }

            const newUser = {
                name,
                email,
                // password: await bcrypt.hash(toString, 12),
                image,
                provider: provider
            }

            const result = await dbConnect(collections?.users).insertOne(newUser)

            return result?.insertedId
        },
    },
})