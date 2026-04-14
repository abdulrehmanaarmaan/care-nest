'use server'
import { ObjectId } from "mongodb"
import { collections, dbConnect } from "../../../lib/dbConnect"

export const getBooking = async (id: string) => {

    if (!ObjectId.isValid(id)) return null

    const query = { _id: new ObjectId(id) }

    const result = await dbConnect(collections?.bookings).findOne(query)

    if (!result) return null

    return { ...result, _id: result?._id.toString() }
}