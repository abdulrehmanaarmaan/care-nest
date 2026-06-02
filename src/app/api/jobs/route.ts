import { collections, dbConnect } from "../../../lib/dbConnect"

export async function POST(req: Request) {

    const job = await req.json()

    const result = await dbConnect(collections.jobs).insertOne(job)

    return Response.json({ success: result?.insertedId })
}

export async function GET(req: Request) {

    const { searchParams } = new URL(req.url)

    const caregiver_id = searchParams.get("caregiver_id")
    const status = searchParams.get('status')

    let result

    if (!status || status === 'all') {
        result = await dbConnect(collections.jobs).find({ caregiver_id }).toArray()
    }

    else {
        result = await dbConnect(collections.jobs).find({ caregiver_id, status }).toArray()
    }

    return Response.json(result)
}