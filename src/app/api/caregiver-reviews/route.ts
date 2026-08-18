import { collections, dbConnect } from "../../../lib/dbConnect"

interface Query {
    booking_id?: string,
    caregiver_id?: string,
    $or?: [
        {
            customer_name: {
                $regex: string,
                $options: 'i'
            }
        },
        {
            review_text: {
                $regex: string,
                $options: 'i'
            }
        }
    ]
    rating?: number
}

export async function GET(req) {

    const { searchParams } = new URL(req.url)

    const booking_id = searchParams.get('booking_id')
    const caregiver_id = searchParams.get('caregiver_id')

    const search_term = searchParams.get('search_term')
    const selected_rating = searchParams.get('selected_rating')

    let result;

    let query: Query = {};

    if (booking_id) {

        query.booking_id = booking_id

        result = await dbConnect(collections.caregiver_reviews).findOne(query)
    }

    if (caregiver_id) {

        query.caregiver_id = caregiver_id

        result = await dbConnect(collections.caregiver_reviews).find(query).toArray()
    }

    if (search_term && search_term.trim()) {
        query.$or = [
            {
                customer_name: {
                    $regex: search_term,
                    $options: 'i'
                }
            },
            {
                review_text: {
                    $regex: search_term,
                    $options: 'i'
                }
            }
        ]

        result = await dbConnect(collections.caregiver_reviews).find(query).toArray()
    }

    if (selected_rating && selected_rating !== 'all') {

        query.rating = Number(selected_rating)

        result = await dbConnect(collections.caregiver_reviews).find(query).toArray()
    }

    return Response.json(result)
}

export async function POST(req) {

    const payload = await req.json()

    const review = { ...payload, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }

    const result = await dbConnect(collections.caregiver_reviews).insertOne(review)

    return Response.json({ success: result?.insertedId })
}