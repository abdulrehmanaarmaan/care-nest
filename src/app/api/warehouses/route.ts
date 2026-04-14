import { collections, dbConnect } from "../../../lib/dbConnect";

export async function GET() {

    const result = await dbConnect(collections?.warehouses).find().toArray()

    return Response.json(result)
}