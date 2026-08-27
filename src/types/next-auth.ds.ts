import NextAuth from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            provider: string;
            account_status: "active" | "deactivated";
            name?: string | null;
            email?: string | null;
            image?: string | null;
            role: "user" | "caregiver" | "admin"
        }
    }


    interface User {
        id: string;
        provider: string;
        account_status: "active" | "deactivated";
        role: "user" | "caregiver" | "admin"
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        provider: string;
        account_status: "active" | "deactivated";
        role: "user" | "caregiver" | "admin"
    }
}