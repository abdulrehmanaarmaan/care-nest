import { collections, dbConnect } from "../../../lib/dbConnect"

export async function POST(req) {

    const payload = await req.json()

    const notification = { ...payload, created_at: new Date().toISOString(), read_at: null }

    const result = await dbConnect(collections.caregiver_notifications).insertOne(notification)

    return Response.json({ success: result?.insertedId })
}

export async function GET(req) {

    const { searchParams } = new URL(req.url)

    const caregiver_id = searchParams.get('caregiver_id')

    const result = await dbConnect(collections.caregiver_notifications).find({ recipient_id: caregiver_id }).toArray()

    return Response.json(result)
}