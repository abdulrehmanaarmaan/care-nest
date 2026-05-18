import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { login } from "../app/server/actions/auth"
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
                    provider: user.provider
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
                token.id = user.id
                token.email = user.email
            }
            return token
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id
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
                profile_image: image,
                phone: '',
                emergency_contact: '',
                password: 'unaccessible',
                date_of_birth: '',
                gender: '',
                address: '',
                bio: '',
                medical_notes: '',
                is_verified: false,
                provider,
                role: 'user',
                created_at: new Date()
            }

            const result = await dbConnect(collections?.users).insertOne(newUser)

            user.id = result.insertedId.toString()
            return true
        },
    },
})