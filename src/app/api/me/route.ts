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

export async function PATCH(req) {
    const profile = await req.json()

    const { updated_at, ...rest } = profile

    const { user } = await auth()
    const { id } = user || {}

    const query = { _id: new ObjectId(id) }

    const updatedProfile = {
        $set: {
            ...rest
        }
    }

    console.log(updatedProfile)

    const result = await dbConnect(collections?.users).updateOne(query, updatedProfile)

    console.log(result)

    if (!result.modifiedCount) {
        return Response.json({ success: result?.modifiedCount })
    }

    const result2 = await dbConnect(collections?.users).updateOne(query, { $set: { ...rest, updated_at } })

    return Response.json({ success: result2?.modifiedCount })
}