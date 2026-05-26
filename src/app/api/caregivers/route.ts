import { collections, dbConnect } from "../../../lib/dbConnect";

interface Query {
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

    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const specialization = searchParams.get("specialization")

    let query: Query = {};

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