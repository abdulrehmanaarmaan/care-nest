'use server'
import { collections, dbConnect } from "../../../lib/dbConnect"
import bcrypt from 'bcryptjs'

export const signUp = async payload => {
    const { name, email, phone, password, } = payload

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
        profile_image: '',
        password: hashedPassword,
        phone,
        emergency_contact: '',
        date_of_birth: '',
        gender: '',
        address: '',
        bio: '',
        medical_notes: '',
        is_verified: false,
        provider: 'credentials',
        role: 'user',
        created_at: new Date(),
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