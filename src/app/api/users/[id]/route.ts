import { ObjectId } from "mongodb"
import { collections, dbConnect } from "../../../../lib/dbConnect"

export async function PATCH(req, { params }) {

    const { id } = await params

    const body = await req.json()

    const updatedAccount = {
        $set: {
            ...body
        }
    }

    const result = await dbConnect(collections.users).updateOne({ _id: new ObjectId(id) }, updatedAccount)

    return Response.json({ success: result?.modifiedCount })
}