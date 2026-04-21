import { ObjectId } from "mongodb"
import { collections, dbConnect } from "../../../../lib/dbConnect"

export async function GET(req, { params }) {

    const { id } = await params

    const { searchParams } = await new URL(req.url)

    const email = searchParams.get("email")
    const name = searchParams.get("name")
    const service_id = searchParams.get("service_id")

    const query = { _id: new ObjectId(id), "customer.email": email, "customer.name": name, service_id }

    const result = await dbConnect(collections?.bookings).findOne(query)

    console.log(result)

    return Response.json(result)
}

export async function PATCH(req, { params }) {

    let booking;
    try {
        booking = await req.json()
    } catch (error) {
        booking = null
    }

    const { id } = await params

    if (!ObjectId.isValid(id)) {
        return Response.json({ error: "Invalid ID" }, { status: 400 })
    }

    const query = { _id: new ObjectId(id) }

    if (booking) {
        const updatedBooking = {
            $set: { ...booking, updated_at: new Date().toISOString() }
        }

        const result = await dbConnect(collections?.bookings).updateOne(query, updatedBooking)

        return Response.json({ success: result?.modifiedCount })
    }

    else {
        const cancelledBooking = {
            $set: {
                status: 'Cancelled',
                payment_status: 'Failed',
                updated_at: new Date().toISOString()
            }
        }

        const result = await dbConnect(collections?.bookings).updateOne(query, cancelledBooking)

        console.log(result?.modifiedCount)

        return Response.json({ success: result?.modifiedCount })
    }
}
