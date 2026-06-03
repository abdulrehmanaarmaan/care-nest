import { collections, dbConnect } from "../../../lib/dbConnect"

export async function POST(req: Request) {
    const payload = await req.json()

    const availability = { ...payload, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), }

    const result = await dbConnect(collections.schedules).insertOne(availability)

    return Response.json({ success: result?.insertedId })
}

export async function GET(req: Request) {

    const { searchParams } = new URL(req.url)

    const caregiver_id = searchParams.get('caregiver_id')

    const status = searchParams.get('status')

    let result;

    if (caregiver_id) {
        result = await dbConnect(collections.schedules).find({ caregiver_id }).toArray()
    }

    else if (status) {

        const all = await dbConnect(collections.schedules).find({}).toArray()

        const now = new Date()

        const currentDay = now.toLocaleDateString('en-US', {
            weekday: 'long'
        })

        const currentTime = now.toTimeString().slice(0, 5)

        const activeSchedules = await all.filter(availability => availability?.enabled === true && availability?.status === status && availability?.days.includes(currentDay) && availability?.start_time <= currentTime && availability?.end_time > currentTime)

        result = [...activeSchedules]
    }

    else {
        result = await dbConnect(collections.schedules).find().toArray()
    }

    return Response.json(result)
}

export async function PATCH(req: Request) {
    const payload = await req.json()

    const { searchParams } = new URL(req.url)

    const caregiver_id = searchParams.get('caregiver_id')

    const savedSchedule = await dbConnect(collections.schedules).findOne({ caregiver_id })

    if (caregiver_id) {
        const updatedSchedule = {
            $set: { ...payload, created_at: savedSchedule && savedSchedule?.created_at }
        }

        const result = await dbConnect(collections.schedules).updateOne({ caregiver_id }, updatedSchedule)

        if (result?.modifiedCount) {

            await dbConnect(collections.schedules).updateOne({ caregiver_id }, { $set: { updated_at: new Date().toISOString() } })

            return Response.json({ success: result?.modifiedCount })
        }

        else {
            return Response.json({ success: false })
        }
    }

}