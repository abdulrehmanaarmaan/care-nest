import { collections, dbConnect } from "../../../lib/dbConnect";

export async function POST(req) {

    const application = await req.json()

    const result = await dbConnect(collections?.applications).insertOne(application)

    return Response.json({ success: result?.insertedId })
}

interface Query {
    userId?: string;
    status?: string;
    specialization?: string;
    $or?: {
        name?: {
            $regex: string;
            $options: string;
        };
        specialization?: {
            $regex: string;
            $options: string;
        };
    }[];
}

export async function GET(req) {

    const { searchParams } = await new URL(req.url)

    const userId = searchParams.get('userId')
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const specialization = searchParams.get("specialization")

    let query: Query = {};

    if (userId) {
        query.userId = userId

        const application = await dbConnect(collections.applications).findOne(query)

        return Response.json({
            exists: !!application,
            application_status: application?.status || null,
            application: application || null
        })
    }

    if (status) {
        query.status = status
    }

    if (search?.trim()) {
        query.$or = [
            {
                name: {
                    $regex: search,
                    $options: 'i'
                }
            },
            {
                specialization: {
                    $regex: search,
                    $options: 'i'
                }
            }
        ]
    }
    if (
        specialization &&
        specialization !== 'All Specializations'
    ) {
        query.specialization =
            specialization
    }

    const result = await dbConnect(collections.applications).find(query).toArray()

    return Response.json(result)
}