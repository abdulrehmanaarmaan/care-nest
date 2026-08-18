import { ObjectId } from "mongodb";
import { collections, dbConnect } from "../../../lib/dbConnect";

const { users } = collections!

export async function GET() {

    const result = await dbConnect(users).find().toArray()

    return Response.json(result)
}

export async function PATCH(req) {

    const { searchParams } = new URL(req.url)

    const account_status = searchParams.get("account_status")

    const payload = await req.json()

    const objectIds = await payload.map(id => new ObjectId(id))

    const result = await dbConnect(users).updateMany({ _id: { $in: objectIds } }, { $set: { account_status } })

    return Response.json({ success: result?.modifiedCount })
}