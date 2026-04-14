import { sendEmail } from "../../../lib/sendEmail";
import { resetPasswordEmail } from "../../../lib/resetPasswordEmail";
import { collections, dbConnect } from "../../../lib/dbConnect";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return Response.json(
                { success: false, message: "Email is required" },
                { status: 400 }
            );
        }

        const userCollection = dbConnect(collections.users);
        const user = await userCollection.findOne({ email, provider: "credentials" });

        if (!user) {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        // Generate reset token
        const token = jwt.sign(
            { email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: "1h" }
        );

        const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

        // Send email
        await sendEmail({
            to: user.email,
            subject: "Reset Your Care Nest Password",
            html: resetPasswordEmail(user.name, resetLink),
            text: `Reset your password: ${resetLink}`,
        });

        return Response.json({
            success: true,
            message: "Password reset email sent.",
        });
    } catch (error) {
        console.error(error);
        return Response.json(
            { success: false, message: "Something went wrong" },
            { status: 500 }
        );
    }
}