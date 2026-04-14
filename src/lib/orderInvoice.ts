/**
 * Care Nest - Professional Order Invoice Generator (2026)
 * Generates a secure and responsive HTML email for booking confirmations.
 */

/* ================================
   Type Definitions
================================= */

interface Pricing {
    base_price: number;
    quantity: number;
    total_amount: number;
    unit: string;
}

interface Customer {
    name: string;
    email: string;
}

interface Location {
    division: string;
    district: string;
    detailed_address: string;
}

interface Order {
    orderId: string;
    service_name: string;
    pricing: Pricing;
    booked_at?: Date | string;
    customer: Customer;
    location: Location;
}

/* ================================
   Utility Functions
================================= */

/**
 * Sanitizes HTML to prevent XSS attacks.
 */
const sanitizeHtml = (str: string | number | undefined | null): string => {
    if (str === undefined || str === null) return "";
    if (typeof str === "number") return str.toString();

    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;")
        .replace(/\//g, "&#x2F;");
};

/**
 * Formats currency in USD with 2 decimal places.
 */
const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);;
};

/**
 * Formats date and time.
 */
const formatDateTime = (dateInput: Date | string) => {

    const date =
        typeof dateInput === "string" ? new Date(dateInput) : dateInput;

    if (!date || isNaN(date.getTime())) {
        throw new Error("Invalid date in orderInvoice");
    }

    return {
        formattedDate: date.toLocaleDateString("en-BD", {
            year: "numeric",
            month: "long",
            day: "numeric",
        }),
        formattedTime: date.toLocaleTimeString("en-BD", {
            hour: "2-digit",
            minute: "2-digit",
        }),
    };
};

/* ================================
   Invoice Generator
================================= */

export const orderInvoice = (order: Order): string => {
    const {
        orderId,
        service_name,
        pricing,
        booked_at,
        customer,
        location,
    } = order;

    // Environment Variables
    const appUrl =
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const logoUrl =
        process.env.NEXT_PUBLIC_LOGO_URL ||
        "https://res.cloudinary.com/dincextlz/image/upload/v1775977228/Screenshot_2026-03-15_115401_bzcw84.png";

    // Sanitize Inputs
    const safeOrderId = sanitizeHtml(orderId);
    const safeCustomerName = sanitizeHtml(customer?.name);
    const safeCustomerEmail = sanitizeHtml(customer?.email);
    const safeServiceName = sanitizeHtml(service_name);
    const safeAddress = sanitizeHtml(location?.detailed_address);

    // Format Date & Time
    const { formattedDate, formattedTime } =
        formatDateTime(booked_at);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>Order Confirmation - Care Nest</title>

<!--[if mso]>
<style type="text/css">
body, table, td {font-family: Arial, sans-serif !important;}
</style>
<![endif]-->

<style>
  body {
    margin: 0;
    padding: 0;
    background-color: #f3f4f6;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
      Roboto, 'Helvetica Neue', Arial, sans-serif;
  }

  .email-container {
    max-width: 600px;
    margin: 0 auto;
    background-color: #ffffff;
  }

  .header {
    background: linear-gradient(135deg, #0d9488 0%, #0891b2 100%);
    padding: 32px 24px;
    text-align: center;
  }

  .header img {
    max-width: 180px;
    height: auto;
    margin: 0 auto;
    display: block;
  }

  .header h1 {
    color: #ffffff;
    font-size: 28px;
    font-weight: 700;
    margin: 16px 0 8px;
  }

  .header p {
    color: #e0f2f1;
    font-size: 16px;
    margin: 0;
  }

  .content {
    padding: 32px 24px;
  }

  .greeting {
    font-size: 18px;
    font-weight: 600;
    color: #111827;
  }

  .message {
    font-size: 15px;
    color: #4b5563;
    line-height: 1.6;
  }

  .order-details {
    background-color: #f9fafb;
    border-radius: 8px;
    padding: 20px;
    margin: 24px 0;
    border: 1px solid #e5e7eb;
  }

  .order-details-row {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    font-size: 14px;
  }

  .order-details-label {
    color: #6b7280;
    font-weight: 500;
    margin-right: 1px;
  }

  .order-details-value {
    color: #111827;
    font-weight: 600;
    text-align: right;
  }

  .products-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }

  .products-table th {
    background-color: #f9fafb;
    padding: 12px;
    text-align: left;
    font-size: 13px;
    border-bottom: 2px solid #e5e7eb;
  }

  .products-table td {
    padding: 14px 12px;
    border-bottom: 1px solid #f3f4f6;
    font-size: 14px;
  }

  .product-name {
    font-weight: 600;
    color: #111827;
  }

  .text-right {
    text-align: right;
  }

  .totals {
    margin-top: 20px;
    border-top: 2px solid #e5e7eb;
    padding-top: 12px;
  }

  .totals-row {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    font-size: 15px;
  }

  .total-final {
    background-color: #f0fdfa;
    padding: 12px;
    border-radius: 6px;
    font-weight: 700;
    color: #0d9488;
  }

  .cta-section {
    text-align: center;
    margin: 32px 0;
  }

  .cta-button {
    display: inline-block;
    background-color: #0d9488;
    color: #ffffff !important;
    text-decoration: none;
    padding: 14px 32px;
    border-radius: 8px;
    font-weight: 600;
  }

  .footer {
    background-color: #f9fafb;
    padding: 24px;
    text-align: center;
    border-top: 1px solid #e5e7eb;
    font-size: 13px;
    color: #6b7280;
  }

  .footer a {
    color: #0d9488;
    text-decoration: none;
    font-weight: 500;
  }

  @media only screen and (max-width: 600px) {
    .content {
      padding: 24px 16px;
    }
  }
</style>
</head>

<body>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center" style="padding: 20px;">
<table class="email-container" role="presentation" width="600">

<!-- Header -->
<tr>
<td class="header">
  <img src="${logoUrl}" alt="Care Nest Logo" />
  <h1>Order Confirmed! 🎉</h1>
  <p>Thank you for choosing Care Nest</p>
</td>
</tr>

<!-- Content -->
<tr>
<td class="content">
  <p class="greeting">Hi ${safeCustomerName},</p>
  <p class="message">
    Great news! We've received your booking and it's being processed.
  </p>

  <!-- Order Details -->
  <div class="order-details">
    <div class="order-details-row">
      <span class="order-details-label mr-1">Order Number:</span>
      <span class="order-details-value">#${safeOrderId}</span>
    </div>
    <div class="order-details-row">
      <span class="order-details-label">Order Date:</span>
      <span class="order-details-value">${formattedDate} at ${formattedTime}</span>
    </div>
    <div class="order-details-row">
      <span class="order-details-label mr-1">Email:</span>
      <span class="order-details-value">${safeCustomerEmail}</span>
    </div>
    <div class="order-details-row">
      <span class="order-details-label mr-1">Service Address:</span>
      <span class="order-details-value">${safeAddress}</span>
    </div>
  </div>

  <h2 style="font-size:20px;color:#111827;">Order Summary</h2>

  <!-- Products Table -->
  <table class="products-table">
    <thead>
      <tr>
        <th>Service</th>
        <th style="text-align:center;">Qty</th>
        <th style="text-align:right;">Price</th>
        <th style="text-align:right;">Total</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="product-name">${safeServiceName}</td>
        <td class="text-right">${sanitizeHtml(String(pricing.quantity))}</td>
        <td class="text-right">${formatCurrency(pricing.base_price)}</td>
        <td class="text-right">${formatCurrency(pricing.total_amount)}</td>
      </tr>
    </tbody>
  </table>

  <!-- Totals -->
  <div class="totals">
    <div class="totals-row total-final">
      <span style="margin-right: 1px">Total:</span>
      <span>${formatCurrency(pricing.total_amount)}</span>
    </div>
  </div>

  <!-- CTA -->
  <div class="cta-section">
    <a href="${appUrl}/dashboard/my-bookings" class="cta-button">
      Track Your Booking
    </a>
  </div>

  <p class="message">
    If you have any questions, please contact us at
    <a href="mailto:abdulrehmanaarmaan@gmail.com">support@care-nest.com</a>.
  </p>
</td>
</tr>

<!-- Footer -->
<tr>
<td class="footer">
  <p><strong>Care Nest</strong><br>Your trusted healthcare service provider</p>
  <p>
    Questions? Email us at
    <a href="mailto:abdulrehmanaarmaan@gmail.com">support@care-nest.com</a>
  </p>
  <p>© ${new Date().getFullYear()} Care Nest. All rights reserved.</p>
  <p>
    This email was sent to ${safeCustomerEmail} because you placed a booking on Care Nest.
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