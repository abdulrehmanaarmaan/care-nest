import { collections, dbConnect } from "../../../lib/dbConnect"

const { jobs } = collections!

export async function POST(req: Request) {

    const job = await req.json()

    const result = await dbConnect(jobs).insertOne(job)

    return Response.json({ success: result?.insertedId })
}

export async function GET(req: Request) {

    const { searchParams } = new URL(req.url)

    const caregiver_id = searchParams.get("caregiver_id")
    const status = searchParams.get('status')

    let result;

    if (!status || status === 'all') {
        result = await dbConnect(jobs).find({ caregiver_id }).toArray()
    }

    else if (caregiver_id) {
        result = await dbConnect(jobs).find({ caregiver_id, status }).toArray()
    }

    else {

        const now = new Date();

        const firstDayOfMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );


        result = await dbConnect(jobs).find().toArray()
    }

    return Response.json(result)
}

export async function PATCH(req) {

    const payload = await req.json()

    const { booking_ids, payout_status } = payload

    const update = {
        $set: { payout_status }
    }

    const result = await dbConnect(jobs).updateMany({ booking_id: { $in: booking_ids } }, update)

    console.log(result)
    console.log(booking_ids)

    return Response.json({ success: result?.modifiedCount })
}