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

    const customerId = searchParams.get("customer_id")

    const status = searchParams.get("status")

    let query = {};

    if (customerId) {
        query["customer.id"] = customerId 
    }

    if (status) {
        query["status"] = {
            $in: ["Pending Payment", "Pending Approval", "Approved"]
        }
    }

    const result = await dbConnect(collections?.bookings).find(query).toArray()

    return Response.json(result)
}