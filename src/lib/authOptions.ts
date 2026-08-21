import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { login } from "../app/server/actions/auth"
import GoogleProvider from "next-auth/providers/google";
import { collections, dbConnect } from "./dbConnect";

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [

        Credentials({
            name: "Credentials",
            credentials: {},
            async authorize(credentials) {
                if (!credentials) return null

                const result = await login(credentials)

                if (!result?.success) return null;

                const user = result.user
                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    provider: user.provider,
                    account_status: user.account_status
                }
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
        params: {
            prompt: "select_account"
        }
    }
        })
    ],

    pages: {
        error: "/auth/error"
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.email = user.email
                token.account_status = user.account_status
            }
            return token
        },

        async session({ session, token }) {

            if (token.account_status === "deactivated") {
                return null
            }

            if (session.user) {
                session.user.id = token.id
                session.user.email = token.email
                session.user.account_status = token.account_status
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

                if (existingUser.account_status === "deactivated") {
                    return false
                }

                user.id = existingUser._id.toString()
                user.account_status = existingUser.account_status
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
                account_status: 'active',
                created_at: new Date()
            }

            const result = await dbConnect(collections?.users).insertOne(newUser)

            user.id = result.insertedId.toString()
            user.account_status= "active"
            return true
        },
    },
})