import { formatCurrency, formatDateTime, Order, sanitizeHtml } from "./bookingReceivedEmail";

export const bookingApprovedEmail = (order: Order): string => {

    const {
        _id,
        service_name,
        pricing,
        booked_at,
        customer,
        location,
    } = order;

    const appUrl =
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const logoUrl =
        process.env.NEXT_PUBLIC_LOGO_URL ||
        "https://res.cloudinary.com/dincextlz/image/upload/v1775977228/Screenshot_2026-03-15_115401_bzcw84.png";

    const safeOrderId = sanitizeHtml(_id);
    const safeCustomerName = sanitizeHtml(customer?.name);
    const safeCustomerEmail = sanitizeHtml(customer?.email);
    const safeServiceName = sanitizeHtml(service_name);
    const safeAddress = sanitizeHtml(location?.detailed_address);

    const { formattedDate, formattedTime } =
        formatDateTime(booked_at);

    return `
<!DOCTYPE html>
<html>
<head>
<title>Booking Approved | Care Nest</title>
</head>

<body style="margin:0;background:#f3f4f6;font-family:Arial,sans-serif;">

<table width="100%">
<tr>
<td align="center">

<table style="max-width:600px;background:#fff;">

<tr>
<td
style="
padding:32px;
text-align:center;
background:linear-gradient(135deg,#0d9488,#0891b2);
">

<img src="${logoUrl}" width="180"/>

<h1 style="color:white;">
Booking Approved ✓
</h1>

<p style="color:#e0f2f1;">
Your booking has been accepted
</p>

</td>
</tr>

<tr>
<td style="padding:32px;">

<p>
Hi ${safeCustomerName},
</p>

<p>
Your booking request has been approved by the Care Nest team.
Your service reservation is now secured.
</p>

<div
style="
background:#f9fafb;
padding:20px;
border-radius:8px;
">

<p><strong>Order:</strong> #${safeOrderId}</p>

<p><strong>Date:</strong>
${formattedDate}
${formattedTime}
</p>

<p><strong>Service:</strong>
${safeServiceName}
</p>

<p><strong>Address:</strong>
${safeAddress}
</p>

<p>
<strong>Total:</strong>
${formatCurrency(pricing.total_amount)}
</p>

</div>

<div
style="
margin-top:24px;
padding:16px;
background:#ecfdf5;
border-radius:8px;
border:1px solid #a7f3d0;
">

Your payment has been accepted and your booking is now approved.

</div>

<div style="margin-top:32px;text-align:center;">

<a
href="${appUrl}/dashboard/my-bookings/${_id}"
style="
background:#0d9488;
color:white;
padding:14px 32px;
border-radius:8px;
text-decoration:none;
"
>

View Booking

</a>

</div>

</td>
</tr>

<tr>
<td
style="
padding:24px;
text-align:center;
color:#6b7280;
"
>

Sent to ${safeCustomerEmail}

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