'use client'
import { useQuery } from '@tanstack/react-query';
import React from 'react';

const useAvailabilitySchedules = (status = null) => {

    const { data: schedules = [] } = useQuery({

        queryKey: ['schedules', status],

        queryFn: async () => {
            const url = status ? `/api/caregiver-schedules?status=${status}` : '/api/caregiver-schedules'

            const res = await fetch(url)
            return res.json()
        },
        enabled: status ? !!status : true
    })

    return { schedules };
};

export default useAvailabilitySchedules;