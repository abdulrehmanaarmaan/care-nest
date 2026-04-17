import { collections, dbConnect } from "../../../lib/dbConnect"
import { orderInvoice } from "../../../lib/orderInvoice";
import { sendEmail } from "../../../lib/sendEmail";

export async function POST(req) {

    const booking = await req.json()

    const result = await dbConnect(collections?.bookings).insertOne(booking)

    const { insertedId } = result

    const invoiceHtml = orderInvoice({ orderId: insertedId.toString(), ...booking });

    const { customer, pricing } = booking

    if (!customer?.email) {
        return Response.json({ success: false, message: "Missing email" });
    }

    await sendEmail({
        to: customer?.email,
        subject: `Order Confirmation - ${insertedId}`,
        html: invoiceHtml,
        text: `Your order ${insertedId} has been confirmed. Total: $${pricing?.total_amount}.`,
    });

    return Response.json({ success: true, bookingId: insertedId.toString() })
}

export async function GET(req) {

    const { searchParams } = new URL(req.url)

    const email = searchParams.get("email")

    // const provider = searchParams.get("provider")

    const query = email ? { "customer.email": email } : {}

    const result = await dbConnect(collections?.bookings).find(query).toArray()

    return Response.json(result)
}