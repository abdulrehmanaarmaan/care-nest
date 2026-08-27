import { NextResponse } from "next/server";
import { collections, dbConnect } from "../../../lib/dbConnect";
import { auth } from "../../../lib/authOptions";
import { sendEmail } from "../../../lib/sendEmail";
import { supportInquiryEmail } from "../../../lib/supportInquiryEmail";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const {
            name,
            email,
            topic,
            booking_id,
            message,
        } = body;

        // -----------------------------
        // Validate required fields
        // -----------------------------

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof message !== "string" ||
            !name.trim() ||
            !email.trim() ||
            !message.trim()
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Name, email, and message are required.",
                },
                { status: 400 }
            );
        }

        // -----------------------------
        // Get authenticated user
        // -----------------------------

        const session = await auth();

        const userId = session?.user?.id?.toString() || null;

        const role = session?.user?.role || "guest";

        // -----------------------------
        // Normalize input
        // -----------------------------

        const normalizedTopic =
            typeof topic === "string" && topic.trim()
                ? topic.trim()
                : "General Inquiry";

        const normalizedBookingId =
            typeof booking_id === "string" && booking_id.trim()
                ? booking_id.trim()
                : null;

        const normalizedInquiry = {
            name: name.trim(),
            email: email.trim().toLowerCase(),

            user_id: userId,
            role,

            topic: normalizedTopic,
            booking_id: normalizedBookingId,

            message: message.trim(),

            status: "open",
            priority: "normal",

            email_status: "pending",
            email_error: null,

            admin_notes: "",

            created_at: new Date(),
            updated_at: new Date(),

            resolved_at: null,
        };

        // -----------------------------
        // Save inquiry
        // -----------------------------

        const inquiryCollection =
            await dbConnect(collections.support_inquiries);

        const result =
            await inquiryCollection.insertOne(normalizedInquiry);

        if (!result.insertedId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unable to create support inquiry.",
                },
                { status: 500 }
            );
        }

        const inquiryId = await result.insertedId.toString();

        // -----------------------------
        // Build support email
        // -----------------------------

        const emailHtml = supportInquiryEmail({
            inquiryId,
            name: normalizedInquiry.name,
            email: normalizedInquiry.email,
            role: normalizedInquiry.role,
            topic: normalizedInquiry.topic,
            bookingId: normalizedInquiry.booking_id,
            message: normalizedInquiry.message,
        });

        const emailText = `
New CareNest Support Inquiry

Inquiry ID: ${inquiryId}

Name: ${normalizedInquiry.name}
Email: ${normalizedInquiry.email}
Role: ${normalizedInquiry.role}
Topic: ${normalizedInquiry.topic}
Booking ID: ${normalizedInquiry.booking_id || "N/A"}

Message:
${normalizedInquiry.message}
        `.trim();

        // -----------------------------
        // Send support email
        // -----------------------------

        const supportEmail = process.env.SUPPORT_EMAIL;

if (!supportEmail) {
    throw new Error("SUPPORT_EMAIL is not configured");
}

        const emailResult = await sendEmail({
            to: supportEmail,
            replyTo: normalizedInquiry.email,
            subject: `CareNest Support: ${normalizedInquiry.topic}`,
            text: emailText,
            html: emailHtml,
        });

        // -----------------------------
        // Update email delivery status
        // -----------------------------

        await inquiryCollection.updateOne(
            { _id: result.insertedId },
            {
                $set: {
                    email_status: emailResult.success
                        ? "sent"
                        : "failed",

                    email_error: emailResult.success
                        ? null
                        : emailResult.error || "Email delivery failed.",

                    updated_at: new Date(),
                },
            }
        );

        // -----------------------------
        // Return success
        // -----------------------------

        return NextResponse.json(
            {
                success: true,
                message:
                    "Your message has been received. Our support team will get back to you soon.",
                inquiry_id: inquiryId,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("CareNest contact API error:", error);

        return NextResponse.json(
            {
                success: false,
                message:
                    "Unable to submit your message. Please try again later.",
            },
            { status: 500 }
        );
    }
}