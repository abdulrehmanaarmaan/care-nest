import { stripe } from "../../../../lib/stripe";
import { collections, dbConnect } from "../../../../lib/dbConnect";
import Stripe from "stripe";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";
import { sendEmail } from "../../../../lib/sendEmail";
import { orderInvoice } from "../../../../lib/orderInvoice";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("stripe-signature");

    if (!signature) {
        return new Response("Missing Stripe signature", { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.NODE_ENV === 'production' ? process.env.STRIPE_WEBHOOK_SECRET as string : process.env.STRIPE_WEBHOOK_SECRET_DEV as string
        );
    } catch (err) {
        console.error("Webhook Error:", err);
        return new Response("Webhook Error", { status: 400 });
    }

    // Handle successful payment
    if (event.type === "checkout.session.completed") {
        console.log("✅ Payment success webhook triggered");
        const session = event.data.object as Stripe.Checkout.Session;
        const bookingId = session.metadata?.bookingId;
        if (!bookingId) {
            console.error("❌ Missing bookingId in metadata");
            return new Response("Missing bookingId", { status: 400 });
        }
        const bookingsCollection = await dbConnect(collections.bookings);
        const query = { _id: new ObjectId(bookingId) };
        await bookingsCollection.updateOne(query, {
            $set: {
                status: "Confirmed",
                payment_status: "Paid",
                payment_intent: session.payment_intent,
                paid_at: new Date(),
            },
        });
        const booking = await bookingsCollection.findOne(query);
        if (!booking) {
            console.error("❌ Booking not found");
            return new Response("Booking not found", { status: 404 });
        }
        const { customer, pricing, _id } = booking;
        console.log("📧 Customer email:", customer?.email);
        const invoiceHtml = orderInvoice(booking);
        try {
            await sendEmail({
                to: customer?.email,
                subject: `Order Confirmation - ${_id}`,
                html: invoiceHtml,
                text: `Your order ${_id} has been confirmed. Total: $${pricing?.total_amount}.`,
            });
            console.log("✅ Email sent successfully");
        } catch (err) {
            console.error("❌ Email sending failed:", err);
        }
    }

    return new Response("Success", { status: 200 });
}