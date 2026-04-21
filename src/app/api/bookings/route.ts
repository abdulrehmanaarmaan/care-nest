import { bookingConfirmation } from "../../../lib/bookingConfirmation";
import { collections, dbConnect } from "../../../lib/dbConnect"
import { orderInvoice } from "../../../lib/orderInvoice";
import { sendEmail } from "../../../lib/sendEmail";

export async function POST(req) {

    const booking = await req.json()

    const result = await dbConnect(collections?.bookings).insertOne(booking)

    const { insertedId } = result

    const emailHtml = bookingConfirmation({ _id: insertedId.toString(), ...booking });

    const { customer } = booking

    if (!customer?.email) {
        return Response.json({ success: false, message: "Missing email" });
    }

    await sendEmail({
        to: customer?.email,
        subject: `Booking Received - ${insertedId}`,
        html: emailHtml,
        text: `Your booking ${insertedId} is created. Please complete payment.`,
    });

    return Response.json({ success: true, bookingId: insertedId })
}

export async function GET(req) {

    const { searchParams } = new URL(req.url)

    const email = searchParams.get("email")

    // const provider = searchParams.get("provider")

    const query = email ? { "customer.email": email } : {}

    const result = await dbConnect(collections?.bookings).find(query).toArray()

    return Response.json(result)
}