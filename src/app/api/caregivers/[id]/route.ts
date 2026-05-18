import { ObjectId } from "mongodb"
import { collections, dbConnect } from "../../../../lib/dbConnect"

export async function GET(req, { params }) {

    const { id } = await params

    const query = { _id: new ObjectId(id) }

    const result = await dbConnect(collections.applications).findOne(query)

    return Response.json(result)
}