import { formatCurrency, Order, sanitizeHtml } from "./bookingReceivedEmail";

export const bookingRejectedEmail = (order: Order): string => {

    const {
        _id,
        service_name,
        pricing,
        customer,
    } = order;

    const appUrl =
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const logoUrl =
        process.env.NEXT_PUBLIC_LOGO_URL ||
        "https://res.cloudinary.com/dincextlz/image/upload/v1775977228/Screenshot_2026-03-15_115401_bzcw84.png";

    const safeCustomerName =
        sanitizeHtml(customer?.name);

    const safeCustomerEmail =
        sanitizeHtml(customer?.email);

    return `
<!DOCTYPE html>
<html>

<head>
<title>Booking Not Approved | Care Nest</title>
</head>

<body
style="
margin:0;
background:#f3f4f6;
font-family:Arial;
"
>

<table width="100%">
<tr>
<td align="center">

<table
style="
max-width:600px;
background:white;
"
>

<tr>

<td
style="
padding:32px;
text-align:center;
background:
linear-gradient(
135deg,
#dc2626,
#ef4444
);
"
>

<img
src="${logoUrl}"
width="180"
/>

<h1 style="color:white;">
Booking Not Approved
</h1>

</td>

</tr>

<tr>

<td style="padding:32px;">

<p>
Hi ${safeCustomerName},
</p>

<p>

After reviewing your request,
we were unable to approve
this booking.

</p>

<div
style="
background:#fef2f2;
padding:20px;
border-radius:8px;
border:
1px solid
#fecaca;
"
>

<p>

Order:
#${_id}

</p>

<p>

Service:
${service_name}

</p>

<p>

Amount:
${formatCurrency(
        pricing.total_amount
    )}

</p>

</div>

<div
style="
margin-top:24px;
padding:16px;
background:#fff7ed;
border-radius:8px;
"
>

If applicable,
refund processing
and next steps
will be communicated separately.

</div>

<div
style="
text-align:center;
margin-top:32px;
"
>

<a
href="${appUrl}/services"
style="
background:#111827;
color:white;
padding:14px 32px;
border-radius:8px;
text-decoration:none;
"
>

Browse Services

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