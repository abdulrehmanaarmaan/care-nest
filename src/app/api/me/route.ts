import { ObjectId } from "mongodb";
import { auth } from "../../../lib/authOptions";
import { collections, dbConnect } from "../../../lib/dbConnect";

export async function GET() {
    const { user } = await auth()

    const { id } = user || {}

    console.log(user)

    if (!id || !ObjectId.isValid(id)) {
        return Response.json({ error: "Invalid user id" }, { status: 400 })
    }

    console.log(user)

    const query = { _id: new ObjectId(id) }

    const result = await dbConnect(collections?.users).findOne(query)

    console.log(result)

    return Response.json(result)
}