import { NextResponse } from "next/server";
import { stripe } from "../../../lib/stripe";

export async function POST(req: Request) {
    try {
        const { serviceName, amount, bookingId, serviceId } = await req.json();

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: serviceName,
                        },
                        unit_amount: Math.round(amount * 100), // Convert to cents
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                bookingId,
            },
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-success?bookingId=${bookingId}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-cancel?serviceId=${serviceId}`,
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error("Stripe Error:", error);
        return NextResponse.json(
            { error: "Unable to create checkout session" },
            { status: 500 }
        );
    }
}