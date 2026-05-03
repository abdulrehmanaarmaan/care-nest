import { existsSync } from "fs"
import { auth } from "../../../../lib/authOptions"
import { collections, dbConnect } from "../../../../lib/dbConnect"

export async function POST(req) {

    const application = await req.json()

    const result = await dbConnect(collections?.applications).insertOne(application)

    return Response.json({ success: result?.insertedId })
}

export async function GET() {

    const { user } = await auth()
    const id = user?.id
    if (!id) {
        return Response.json({ error: "Unauthorized" }, { status: 401 })
    }
    const collection = await dbConnect(collections?.applications)
    const application = await collection.findOne({ userId: id })
    // ✅ ALWAYS return something
    return Response.json({
        exists: !!application,
        application_status: application?.status || null,
        application: application || null
    })
}