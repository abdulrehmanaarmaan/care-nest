import { collections, dbConnect } from "../../../lib/dbConnect"

export async function POST(req) {
    const payload = await req.json()

    const { account_number } = payload

    const account = { ...payload, account_number_last4: account_number.slice(-4), is_verified: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }

    const result = await dbConnect(collections.caregiver_bank_accounts).insertOne(account)

    return Response.json({ success: result?.insertedId })
}

export async function PATCH(req) {


    const { searchParams } = new URL(req.url)
    const caregiver_id = searchParams.get("caregiver_id")
    const payload = await req.json()


    if (caregiver_id) {
        const result = await dbConnect(collections.caregiver_bank_accounts).updateOne({ caregiver_id }, { $set: { ...payload, updated_at: new Date().toISOString() } })
        return Response.json({ success: result?.modifiedCount })
    }
}

export async function GET(req) {

    const { searchParams } = new URL(req.url)

    const caregiver_id = searchParams.get("caregiver_id")
    const result = await dbConnect(collections.caregiver_bank_accounts).findOne({ caregiver_id })

    return Response.json(result)
}