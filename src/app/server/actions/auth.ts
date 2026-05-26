'use server'
import { collections, dbConnect } from "../../../lib/dbConnect"
import bcrypt from 'bcryptjs'

// type RegistrationField = "email" | "password" | "password" | "phone"

interface RegistrationResult {
    success: boolean,
    field?: "email";
    message?: string
}

export const signUp = async (payload): Promise<RegistrationResult> => {
    const { name, email, phone, password, } = payload

    if (!email || !password) {
        return { success: false }
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const query = { name, email, provider: 'credentials' }

    const existingUser = await dbConnect(collections?.users).findOne(query)

    if (existingUser) {
        return { success: false, field: "email", message: "Account already exists with this email" }
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
        account_status: 'active',
        created_at: new Date(),
    }

    const result = await dbConnect(collections?.users).insertOne(newUser)

    if (result?.insertedId) {
        return { success: Boolean(result?.insertedId) }
    }
}

type LoginField = "email" | "password"

interface LoginResult {
    success: boolean;
    field?: LoginField;
    message?: string;
    user?: any
}

export const login = async (payload): Promise<LoginResult> => {
    const { email, password } = payload

    const query = {
        email: email,
        provider: 'credentials'
    }

    const existingUser = await dbConnect(collections?.users).findOne(query)

    if (!existingUser) {
        return {
            success: false,
            field: "email",
            message: "No account found with this email."
        }
    }

    if (existingUser.account_status === "deactivated") {
        return {
            success: false,
            field: "email",
            message: "This account has been deactivated."
        }
    }

    const isMatched = await bcrypt.compare(password, existingUser?.password)

    if (!isMatched) {
        return {
            success: false,
            field: "password",
            message: "Incorrect password."
        }
    }

    return {
        success: true,
        user: { ...existingUser, _id: existingUser._id.toString() }
    }
}