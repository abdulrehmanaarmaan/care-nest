import { collections, dbConnect } from "../../../lib/dbConnect"

export async function GET() {
    const result = await dbConnect(collections?.services).find().toArray()

    return Response.json(result)
}