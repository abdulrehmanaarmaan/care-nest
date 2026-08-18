'use client'
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React from 'react';

const useMySchedule = () => {

    const { data } = useSession()

    const { id } = data?.user || {}

    const { data: savedSchedule = {}, isLoading, refetch } = useQuery({

        queryKey: ['saved_schedule', id],

        queryFn: async () => {
            const res = await fetch(`/api/caregiver-schedules?caregiver_id=${id}`)
            return res.json()
        },

        enabled: !!id
    })

    return { savedSchedule, isLoading, refetch };
};

export default useMySchedule;