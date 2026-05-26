import NextAuth from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            provider: string;
            account_status: "active" | "deactivated";
            name?: string | null;
            email?: string | null;
            image?: string | null
        }
    }


    interface User {
        id: string;
        provider: string;
        account_status: "active" | "deactivated"
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        provider: string;
        account_status: "active" | "deactivated"
    }
}