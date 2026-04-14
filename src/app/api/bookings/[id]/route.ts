import { ObjectId } from "mongodb"
import { collections, dbConnect } from "../../../../lib/dbConnect"

export async function GET(req, { params }) {

    const { id } = await params

    const query = { _id: new ObjectId(id) }

    const result = await dbConnect(collections?.bookings).findOne(query)

    return Response.json(result)
}

export async function PATCH(req, { params }) {
    const { id } = await params

    const query = { _id: new ObjectId(id) }

    const cancelledBooking = {
        $set: {
            status: 'Cancelled',
            updated_at: new Date()
        }
    }

    const result = await dbConnect(collections?.bookings).updateOne(query, cancelledBooking)

    return Response.json({ success: result?.modifiedCount })
}