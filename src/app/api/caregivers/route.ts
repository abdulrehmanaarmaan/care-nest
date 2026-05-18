import { collections, dbConnect } from "../../../lib/dbConnect";

export async function GET() {

    const query = {
        status: 'pending'
    }

    const result = await dbConnect(collections.applications).find(query).toArray()

    return Response.json(result)
}