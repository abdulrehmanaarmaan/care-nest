'use client'
import { useQuery } from '@tanstack/react-query';
import React from 'react';

const useBookingsData = (status = null, caregiver_id = null) => {

    const { data: bookings = [], refetch } = useQuery({

        queryKey: ['bookings', status],

        queryFn: async () => {

            const url = status
                ? `/api/bookings?status=${status}`
                : (status && caregiver_id) ? `/api/bookings?status=${status}&caregiver_id=${caregiver_id}`
                    : '/api/bookings'

            const result = await fetch(url)
            return result.json()
        },
        enabled: status ? !!status : caregiver_id ? (!!status && !!caregiver_id) : true
    })

    return { bookings, refetch };
};

export default useBookingsData;