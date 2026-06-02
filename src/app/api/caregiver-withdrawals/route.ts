import { collections, dbConnect } from "../../../lib/dbConnect"

export async function POST(req) {

    const payload = await req.json()

    const withdrawal = { ...payload, requested_at: new Date().toISOString() }

    const result = await dbConnect(collections.withdrawals).insertOne(withdrawal)

    return Response.json({ success: result?.insertedId })
}

export async function GET(req) {
    const { searchParams } = new URL(req.url)

    const caregiver_id = searchParams.get("caregiver_id")
    const status = searchParams.get("status")

    let result

    if (caregiver_id && status) {

        const withdrawals = await dbConnect(collections.withdrawals).find({ caregiver_id, status }).sort({ paid_at: -1 }).limit(1).toArray()

        result = withdrawals[0] || null
    }

    else if (caregiver_id) {
        result = await dbConnect(collections.withdrawals).find({ caregiver_id }).toArray()
    }

    return Response.json(result)
}