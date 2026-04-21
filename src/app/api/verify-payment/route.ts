import { NextResponse } from "next/server";
import { dbConnect, collections } from "../../../lib/dbConnect";
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const bookingId = searchParams.get("bookingId");

        if (!bookingId) {
            return NextResponse.json({ success: false }, { status: 400 });
        }

        const bookingsCollection = await dbConnect(collections.bookings);

        const booking = await bookingsCollection.findOne({
            _id: new ObjectId(bookingId),
        });

        if (!booking) {
            return NextResponse.json({ success: false }, { status: 404 });
        }

        // ✅ REAL CHECK (from webhook-updated DB)
        if (booking.payment_status === "Paid") {
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ success: false });

    } catch (error) {
        console.error("Verify Payment Error:", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}