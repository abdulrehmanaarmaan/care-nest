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
            process.env.STRIPE_WEBHOOK_SECRET as string
        );
    } catch (err) {
        console.error("Webhook Error:", err);
        return new Response("Webhook Error", { status: 400 });
    }


    // Handle successful payment
    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const bookingId = session.metadata?.bookingId;


        if (!bookingId) {
            return new Response("Missing bookingId", { status: 400 });
        }


        const bookingsCollection = await dbConnect(collections.bookings);
        const query = { _id: new ObjectId(bookingId) }


        await bookingsCollection.updateOne(
            query,
            {
                $set: {
                    status: "Confirmed",
                    payment_status: "Paid",
                    payment_intent: session.payment_intent,
                    paid_at: new Date()
                },
            }
        );
    }

    return new Response("Success", { status: 200 });
}