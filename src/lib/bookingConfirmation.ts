export const bookingConfirmation = (order: any) => {
    return `
        <h2 style="color:#0d9488;">Booking Received ⏳</h2>

        <p>Hi ${order.customer?.name},</p>

        <p>
        Thank you for your request! We've successfully received your booking.
        </p>

        <div style="background:#f9fafb;padding:16px;border-radius:8px;margin:20px 0;">
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Service:</strong> ${order.service_name}</p>
          <p><strong>Total Amount:</strong> $${order.pricing?.total_amount}</p>
          <p><strong>Status:</strong> <span style="color:#f59e0b;font-weight:bold;">Pending Payment</span></p>
        </div>

        <p>
        To confirm your booking and secure your slot, please complete your payment.
        </p>

        <div style="text-align:center;margin:24px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/booking/${order.service_id}"
             style="background:#0d9488;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">
             Complete Payment
          </a>
        </div>

        <p style="color:#dc2626;font-weight:600;">
        ⚠️ This booking may expire if payment is not completed soon.
        </p>

        <p>
        If you have any questions, feel free to contact our support team.
        </p>
    `;
};