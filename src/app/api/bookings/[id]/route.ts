import { ObjectId } from "mongodb"
import { collections, dbConnect } from "../../../../lib/dbConnect"
import { auth } from "../../../../lib/authOptions"
import { bookingApprovedEmail } from "../../../../lib/bookingApprovedEmail"
import { sendEmail } from "../../../../lib/sendEmail"
import { bookingRejectedEmail } from "../../../../lib/bookingRejectedEmail"

export async function GET(req, { params }) {

    const { id } = await params

    const { user } = await auth()

    const { searchParams } = await new URL(req.url)

    const service_id = searchParams.get("service_id")

    let query = {}

    if (service_id) {
        query = { _id: new ObjectId(id), "customer.id": user?.id, service_id }
    }

    else {
        query = { _id: new ObjectId(id) }
    }

    const result = await dbConnect(collections?.bookings).findOne(query)

    console.log(result)

    return Response.json(result)
}

interface UpdatedBooking {
    $set?: any
}

export async function PATCH(req, { params }) {

    let booking;

    try {
        booking = await req.json()
    } catch {
        booking = null
    }

    const { id } = await params

    if (!ObjectId.isValid(id)) {
        return Response.json({ error: "Invalid ID" }, { status: 400 })
    }

    const query = { _id: new ObjectId(id) }

    let updatedBooking: UpdatedBooking = {};

    const { user } = await auth()

    const { searchParams } = new URL(req.url)

    const status = searchParams.get("status")

    if (booking) {
        updatedBooking.$set = { ...booking, updated_at: new Date().toISOString() }
    }

    else if (status === 'Approved') {
        updatedBooking.$set = {
            status,
            approved_at: new Date().toISOString(),
            approved_by: user?.id,
            updated_at: new Date().toISOString()
        }
    }

    else if (status === 'Rejected') {
        updatedBooking.$set = {
            status,
            cancellation: {
                reason: 'Rejected by admin',
                cancelled_by: user?.id,
                cancelled_at: new Date().toISOString()
            },
            updated_at: new Date().toISOString()
        }
    }

    else if (status === 'Confirmed') {
        updatedBooking.$set = {
            status,
            payment: {
                confirmed_at: new Date().toISOString(),
                confirmed_by: user?.id,
                method: 'Manual'
            },
            updated_at: new Date()
        }
    }

    else if (status === 'In Progress' || status === 'Pending Reassignment') {
        updatedBooking.$set = {
            status,
            updated_at: new Date().toISOString()
        }
    }

    else if (status === 'Completed') {
        updatedBooking.$set = {
            status,
            updated_at: new Date().toISOString(),
            payout_status: 'Available'
        }
    }

    else {
        updatedBooking.$set = {
            status: 'Cancelled',
            payment_status: 'Failed',
            updated_at: new Date().toISOString()
        }
    }

    const result = await dbConnect(collections?.bookings).updateOne(query, updatedBooking)

    const existingBooking = await dbConnect(collections?.bookings).findOne(query)
    const { email } = existingBooking?.customer

    if (status === "Approved" && result?.modifiedCount) {
        const approvedHtml = bookingApprovedEmail(existingBooking);

        sendEmail({
            to: email,
            subject: `Booking Approved - ${id}`,
            html: approvedHtml,
            text: `Your booking ${id} has been approved. You can now track the booking from your dashboard.`,
        });
    }

    if (status === "Rejected" && result?.modifiedCount) {

        const rejectedHtml = bookingRejectedEmail(existingBooking);

        sendEmail({
            to: email,
            subject: `Booking Not Approved - ${id}`,
            html: rejectedHtml,
            text: `Your booking ${id} could not be approved after review. Please check your dashboard for updates.`,
        });
    }

    return Response.json({ success: result?.modifiedCount })
}

