'use client'
import { utils, writeFile } from 'xlsx';

export const exportAnalyticsReport = ({
    range,
    totalRevenue,
    totalBookings,
    totalUsers,
    totalCaregivers,
    applicationsCount,
    servicesCount,
    reviewsCount,
    averageRating,
    bookingStatusData,
    activeSchedules,
    inactiveSchedules,
    completedBookings,
    services,
}: any) => {

    const workbook = utils.book_new();

    // ==========================
    // SUMMARY SHEET
    // ==========================

    const summarySheet = utils.json_to_sheet([
        {
            Range: range,
            Revenue: totalRevenue,
            Bookings: totalBookings,
            Users: totalUsers,
            Caregivers: totalCaregivers,
            Applications: applicationsCount,
            Services: servicesCount,
            Reviews: reviewsCount,
            AverageRating: averageRating
        }
    ]);

    utils.book_append_sheet(
        workbook,
        summarySheet,
        'Summary'
    );

    // ==========================
    // BOOKING STATUS
    // ==========================

    const bookingSheet =
        utils.json_to_sheet(
            bookingStatusData.map(
                (status: any) => ({
                    Status: status.name,
                    Count: status.value
                })
            )
        );

    utils.book_append_sheet(
        workbook,
        bookingSheet,
        'Booking Status'
    );

    // ==========================
    // CAREGIVER AVAILABILITY
    // ==========================

    const caregiverSheet =
        utils.json_to_sheet([
            {
                Active: activeSchedules.length,
                Inactive: inactiveSchedules.length
            }
        ]);

    utils.book_append_sheet(
        workbook,
        caregiverSheet,
        'Availability'
    );

    // ==========================
    // SERVICES
    // ==========================

    const servicesSheet =
        utils.json_to_sheet(
            services.map((service: any) => {

                const serviceBookings =
                    completedBookings.filter(
                        (booking: any) =>
                            booking.service_name ===
                            service.service_name
                    );

                return {
                    Service: service.service_name,
                    Bookings:
                        serviceBookings.length,
                    Revenue:
                        serviceBookings.reduce(
                            (sum: number, booking: any) =>
                                sum +
                                (
                                    booking?.pricing
                                        ?.total_amount || 0
                                ),
                            0
                        )
                };
            })
        );

    utils.book_append_sheet(
        workbook,
        servicesSheet,
        'Services'
    );

    writeFile(
        workbook,
        `CareNest-Analytics-${Date.now()}.xlsx`
    );
};