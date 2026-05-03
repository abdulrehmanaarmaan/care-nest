'use server'
import { collections, dbConnect } from "../../lib/dbConnect"
import bcrypt from 'bcryptjs'

export const signUp = async payload => {
    const { name, email, contact, password, } = payload

    if (!email || !password) {
        return { success: false }
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const query = { name, email, provider: 'credentials' }

    const existingUser = await dbConnect(collections?.users).findOne(query)

    if (existingUser) {
        return { success: false }
    }

    const newUser = {
        name,
        email,
        contact,
        password: hashedPassword,
        provider: 'credentials',
        role: 'user'
    }

    const result = await dbConnect(collections?.users).insertOne(newUser)

    if (result?.insertedId) {
        return { success: Boolean(result?.insertedId) }
    }
}

export const login = async payload => {
    const { email, password } = payload

    const query = {
        email: email,
        provider: 'credentials'
    }

    const existingUser = await dbConnect(collections?.users).findOne(query)

    const isMatched = await bcrypt.compare(password, existingUser?.password)

    if (!isMatched) {
        return null
    }

    return existingUser
}