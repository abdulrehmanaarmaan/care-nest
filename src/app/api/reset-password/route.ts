import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { collections, dbConnect } from "../../../lib/dbConnect";

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return Response.json(
                { success: false, message: "Invalid request" },
                { status: 400 }
            );
        }

        // Verify JWT token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as { email: string };

        const userCollection = dbConnect(collections.users);
        const user = await userCollection.findOne({ email: decoded.email, provider: "credentials" });

        if (!user) {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        // Check if new password matches the old one
        const isSamePassword = await bcrypt.compare(
            password,
            user.password
        );

        if (isSamePassword) {
            return Response.json(
                {
                    success: false,
                    message:
                        "New password cannot be the same as the previous password.",
                },
                { status: 400 }
            );
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update password in the database
        await userCollection.updateOne(
            { email: decoded.email },
            { $set: { password: hashedPassword } }
        );

        return Response.json({
            success: true,
            message: "Password reset successfully.",
        });
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Invalid or expired reset token.",
            },
            { status: 400 }
        );
    }
}