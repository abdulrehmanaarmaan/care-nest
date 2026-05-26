import { ObjectId } from "mongodb"
import { collections, dbConnect } from "../../../../lib/dbConnect"
// import { useSearchParams } from "next/navigation"

export async function GET(req, { params }) {

    const { id } = await params

    const query = { _id: new ObjectId(id) }

    const result = await dbConnect(collections.applications).findOne(query)

    return Response.json(result)
}

export async function PATCH(req, { params }) {
    const { id } = await params

    // const { searchParams } = new URL(req.url)

    const updatedStatus = await req.json()
    console.log(updatedStatus)

    // const status = searchParams.get("status")

    const query = { _id: new ObjectId(id) }

    const updatedApplication = {
        $set: {
            ...updatedStatus
        }
    }

    const result = await dbConnect(collections.applications).updateOne(query, updatedApplication)

    return Response.json({ success: result.modifiedCount })
}