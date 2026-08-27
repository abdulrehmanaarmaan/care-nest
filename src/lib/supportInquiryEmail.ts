const sanitizeHtml = (value: unknown): string =>
    String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;");

interface SupportInquiryEmailData {
    inquiryId: string;
    name: string;
    email: string;
    role: string;
    topic: string;
    bookingId?: string | null;
    message: string;
}

export const supportInquiryEmail = ({
    inquiryId,
    name,
    email,
    role,
    topic,
    bookingId,
    message,
}: SupportInquiryEmailData): string => {
    const appUrl =
        process.env.NEXT_PUBLIC_APP_URL ||
        "http://localhost:3000";

    const logoUrl =
        process.env.NEXT_PUBLIC_LOGO_URL || "";

    const safeInquiryId = sanitizeHtml(inquiryId);
    const safeName = sanitizeHtml(name);
    const safeEmail = sanitizeHtml(email);
    const safeRole = sanitizeHtml(role);
    const safeTopic = sanitizeHtml(topic);
    const safeBookingId = sanitizeHtml(bookingId || "N/A");
    const safeMessage = sanitizeHtml(message);
    const safeAppUrl = sanitizeHtml(appUrl);
    const safeReplyEmail = encodeURIComponent(email);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    />
    <title>New Support Inquiry | Care Nest</title>
</head>

<body
    style="
        margin:0;
        padding:0;
        background:#f3f4f6;
        font-family:Arial,Helvetica,sans-serif;
        color:#0f172a;
    "
>
    <table
        role="presentation"
        width="100%"
        cellpadding="0"
        cellspacing="0"
        border="0"
        style="
            background:#f3f4f6;
            padding:32px 16px;
        "
    >
        <tr>
            <td align="center">

                <table
                    role="presentation"
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    style="
                        max-width:600px;
                        background:#ffffff;
                        border-radius:16px;
                        overflow:hidden;
                    "
                >

                    <!-- Header -->
                    <tr>
                        <td
                            style="
                                padding:32px;
                                text-align:center;
                                background:linear-gradient(
                                    135deg,
                                    #0d9488,
                                    #0891b2
                                );
                            "
                        >

                            ${
                                logoUrl
                                    ? `
                                        <img
                                            src="${sanitizeHtml(logoUrl)}"
                                            width="180"
                                            alt="Care Nest"
                                            style="
                                                display:block;
                                                width:180px;
                                                max-width:100%;
                                                height:auto;
                                                margin:0 auto 20px;
                                            "
                                        />
                                    `
                                    : ""
                            }

                            <h1
                                style="
                                    margin:0;
                                    color:#ffffff;
                                    font-size:24px;
                                    line-height:1.3;
                                    font-weight:700;
                                "
                            >
                                New Support Inquiry
                            </h1>

                            <p
                                style="
                                    margin:8px 0 0;
                                    color:#e0f2f1;
                                    font-size:14px;
                                    line-height:1.5;
                                "
                            >
                                A new message has been received
                            </p>

                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding:32px;">

                            <p
                                style="
                                    margin:0 0 24px;
                                    color:#334155;
                                    font-size:15px;
                                    line-height:1.6;
                                "
                            >
                                A new support inquiry has been submitted
                                through the Care Nest contact form.
                            </p>

                            <!-- Inquiry Details -->
                            <table
                                role="presentation"
                                width="100%"
                                cellpadding="0"
                                cellspacing="0"
                                border="0"
                                style="
                                    background:#f9fafb;
                                    border-radius:8px;
                                "
                            >
                                <tr>
                                    <td style="padding:20px;">

                                        <p
                                            style="
                                                margin:0 0 12px;
                                                font-size:14px;
                                                line-height:1.5;
                                                color:#334155;
                                            "
                                        >
                                            <strong>Inquiry:</strong>
                                            #${safeInquiryId}
                                        </p>

                                        <p
                                            style="
                                                margin:0 0 12px;
                                                font-size:14px;
                                                line-height:1.5;
                                                color:#334155;
                                            "
                                        >
                                            <strong>Name:</strong>
                                            ${safeName}
                                        </p>

                                        <p
                                            style="
                                                margin:0 0 12px;
                                                font-size:14px;
                                                line-height:1.5;
                                                color:#334155;
                                            "
                                        >
                                            <strong>Email:</strong>
                                            ${safeEmail}
                                        </p>

                                        <p
                                            style="
                                                margin:0 0 12px;
                                                font-size:14px;
                                                line-height:1.5;
                                                color:#334155;
                                            "
                                        >
                                            <strong>Role:</strong>
                                            ${safeRole}
                                        </p>

                                        <p
                                            style="
                                                margin:0 0 12px;
                                                font-size:14px;
                                                line-height:1.5;
                                                color:#334155;
                                            "
                                        >
                                            <strong>Topic:</strong>
                                            ${safeTopic}
                                        </p>

                                        <p
                                            style="
                                                margin:0;
                                                font-size:14px;
                                                line-height:1.5;
                                                color:#334155;
                                            "
                                        >
                                            <strong>Booking:</strong>
                                            ${safeBookingId}
                                        </p>

                                    </td>
                                </tr>
                            </table>

                            <!-- Customer Message -->
                            <h2
                                style="
                                    margin:28px 0 12px;
                                    color:#0f172a;
                                    font-size:17px;
                                    line-height:1.4;
                                "
                            >
                                Customer Message
                            </h2>

                            <div
                                style="
                                    padding:20px;
                                    background:#ffffff;
                                    border:1px solid #e5e7eb;
                                    border-radius:8px;
                                    color:#334155;
                                    font-size:14px;
                                    line-height:1.7;
                                    white-space:pre-line;
                                "
                            >
                                ${safeMessage}
                            </div>

                            <!-- Reply CTA -->
                            <div
                                style="
                                    margin-top:32px;
                                    text-align:center;
                                "
                            >
                                <a
                                    href="mailto:${safeReplyEmail}"
                                    style="
                                        display:inline-block;
                                        background:#0d9488;
                                        color:#ffffff;
                                        padding:14px 32px;
                                        border-radius:8px;
                                        text-decoration:none;
                                        font-size:14px;
                                        font-weight:700;
                                    "
                                >
                                    Reply to Customer
                                </a>
                            </div>

                            <!-- Support Note -->
                            <div
                                style="
                                    margin-top:24px;
                                    padding:16px;
                                    background:#ecfdf5;
                                    border-radius:8px;
                                    border:1px solid #a7f3d0;
                                    color:#065f46;
                                    font-size:13px;
                                    line-height:1.6;
                                "
                            >
                                This inquiry has been saved in the
                                Care Nest support system and can be
                                managed from the administrative dashboard.
                            </div>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td
                            style="
                                padding:24px;
                                text-align:center;
                                color:#6b7280;
                            "
                        >

                            <p
                                style="
                                    margin:0;
                                    font-size:12px;
                                    line-height:1.5;
                                "
                            >
                                Care Nest Support
                            </p>

                            <p
                                style="
                                    margin:6px 0 0;
                                    color:#94a3b8;
                                    font-size:11px;
                                    line-height:1.5;
                                "
                            >
                                Automated support notification
                            </p>

                            <p
                                style="
                                    margin:6px 0 0;
                                    color:#cbd5e1;
                                    font-size:11px;
                                    line-height:1.5;
                                "
                            >
                                ${safeAppUrl}
                            </p>

                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>
</body>
</html>
`;
};