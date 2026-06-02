import { ObjectId } from "mongodb"
import { collections, dbConnect } from "../../../../lib/dbConnect"

interface UpdatedJob {
    $set?: any
}

export async function PATCH(req: Request, { params }) {
    const { id } = await params

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    let updatedJob: UpdatedJob = {}

    let result;

    if (status === 'accepted') {
        updatedJob.$set = {
            status,
            caregiver_response: status,
            accepted_at: new Date(),
            updated_at: new Date()
        }
    }

    if (status === 'declined') {
        updatedJob.$set = {
            status,
            caregiver_response: status,
            declined_at: new Date(),
            is_active: false,
            updated_at: new Date()
        }
    }

    if (status === 'completed') {
        updatedJob.$set = {
            status,
            caregiver_response: status,
            completed_at: new Date(),
            is_active: false,
            is_archived: true,
            updated_at: new Date()
        }
    }

    result = await dbConnect(collections.jobs).updateOne({ _id: new ObjectId(id) }, updatedJob)

    return Response.json({ success: result?.modifiedCount })

}