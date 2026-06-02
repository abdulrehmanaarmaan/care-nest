import { ObjectId } from "mongodb"
import { collections, dbConnect } from "../../../../lib/dbConnect"

export async function PATCH(req, { params }) {

    const { id } = await params
    const { searchParams } = new URL(req.url)

    const status = searchParams.get("status")

    let result

    if (status === 'Processing') {
        result = await dbConnect(collections.withdrawals).updateOne({ _id: new ObjectId(id) }, { $set: { status, approved_at: new Date().toISOString() } })
    }

    if (status === 'Rejected') {
        result = await dbConnect(collections.withdrawals).updateOne({ _id: new ObjectId(id) }, { $set: { status, rejected_at: new Date().toISOString() } })
    }

    if (status === 'Paid') {
        result = await dbConnect(collections.withdrawals).updateOne({ _id: new ObjectId(id) }, { $set: { status, paid_at: new Date().toISOString() } })
    }

    return Response.json({ success: result?.modifiedCount })
}