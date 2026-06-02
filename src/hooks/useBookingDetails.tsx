'use client'
import { useQuery } from '@tanstack/react-query';
import { ParamValue } from 'next/dist/server/request/params';
import React from 'react';

const useBookingDetails = (id: ParamValue, serviceId: ParamValue = null) => {

    const { data: booking, refetch, isLoading } = useQuery({
        queryKey: ['booking', id, serviceId],
        queryFn: async () => {
            if (!id) return null

            const url = serviceId
                ? `/api/bookings/${id}?service_id=${serviceId}`
                : `/api/bookings/${id}`

            const res = await fetch(url)
            return res.json()
        },
        enabled: serviceId ? (!!id && !!serviceId) : !!id
    })

    return { booking, refetch, isLoading };
};

export default useBookingDetails;