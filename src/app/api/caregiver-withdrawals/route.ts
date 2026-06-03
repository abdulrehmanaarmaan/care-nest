import { collections, dbConnect } from "../../../lib/dbConnect"
import Withdrawals from "../../dashboard/admin/withdrawals/page"

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

    let result = []

    if (caregiver_id && status) {
        const withdrawals = await dbConnect(collections.withdrawals)
            .find({ caregiver_id, status })
            .sort({ paid_at: -1 })
            .limit(1)
            .toArray()

        const withdrawal = withdrawals[0] || null

        if (!withdrawal) {
            return Response.json(null)
        }

        return Response.json({
            ...withdrawal,
            _id: withdrawal?._id.toString()
        })
    }

    if (caregiver_id) {
        result = await dbConnect(collections.withdrawals)
            .find({ caregiver_id })
            .toArray()
    }

    else {
        result = await dbConnect(collections.withdrawals).find().toArray()
    }

    const serialized = result.map(withdrawal => ({
        ...withdrawal,
        _id: withdrawal?._id.toString()
    }))

    return Response.json(serialized)
}