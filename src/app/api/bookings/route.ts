import { ObjectId } from "mongodb"
import { collections, dbConnect } from "../../../lib/dbConnect"

export async function POST(req) {

    const booking = await req.json()

    const result = await dbConnect(collections?.bookings).insertOne(booking)

    const { insertedId } = result

    const { customer } = booking

    if (!customer?.email) {
        return Response.json({ success: false, message: "Missing email" });
    }

    return Response.json({ success: true, bookingId: insertedId })
}

export async function GET(req) {

    const { searchParams } = new URL(req.url)

    const customerId = searchParams.get("customer_ids")

    const status = searchParams.get("status")

    const caregiverId = searchParams.get("caregiver_id")

    let query = {};

    if (customerId) {
        query["customer.id"] = customerId
    }

    if (status && (status !== 'Cancelled' && status !== 'Rejected')) {
        query["status"] = status
    }

    if (caregiverId) {
        query["caregiver_id"] = caregiverId
    }

    const result = await dbConnect(collections?.bookings).find(query).toArray()

    return Response.json(result)
}

export async function PATCH(req) {

    const payload = await req.json()

    const { booking_ids, payout_status } = payload

    const updates = {
        $set: { payout_status }
    }

    const result = await dbConnect(collections?.bookings).updateMany({ _id: { $in: booking_ids.map(id => new ObjectId(id)) } }, updates)

    console.log(result)
    console.log(booking_ids)

    return Response.json({ success: result?.modifiedCount })
}