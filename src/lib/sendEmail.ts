'use server';

import nodemailer, { Transporter } from 'nodemailer';

// ===============================
// Type Definitions
// ===============================
interface SendEmailOptions {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
    replyTo?: string;
    attachments?: nodemailer.Attachment[];
}


interface SendEmailResponse {
    success: boolean;
    messageId?: string;
    error?: string;
}


// ===============================
// Environment Variables
// ===============================
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;


// Validate environment variables
if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error(
        'Missing EMAIL_USER or EMAIL_PASS in environment variables.'
    );
}


// ===============================
// Cached Transporter (Singleton)
// ===============================
let transporter: Transporter;


const getTransporter = (): Transporter => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS, // Use Gmail App Password
            },
        });
    }
    return transporter;
};


// ===============================
// Send Email Function
// ===============================
export const sendEmail = async (
    options: SendEmailOptions
): Promise<SendEmailResponse> => {
    try {
        const transporter = getTransporter();


        // Verify transporter in development mode
        if (process.env.NODE_ENV !== 'production') {
            await transporter.verify();
        }


        const info = await transporter.sendMail({
            from: `"Care Nest" <${EMAIL_USER}>`,
            to: options.to,
            subject: options.subject,
            html: options.html,
            text: options.text,
            replyTo: options.replyTo,
            attachments: options.attachments,
        });


        return {
            success: true,
            messageId: info.messageId,
        };
    } catch (error) {
        console.error('Email sending failed:', error);


        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Failed to send email',
        };
    }
};