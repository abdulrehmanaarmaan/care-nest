'use client'
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React from 'react';

const useMyJobs = (jobStatus = 'all') => {

    const { data } = useSession()
    const { id } = data?.user || {}

    const { data: jobs = [], isLoading, refetch } = useQuery({

        queryKey: ['jobs', id, jobStatus],

        queryFn: async () => {

            const url = (id && jobStatus) ? `/api/jobs?caregiver_id=${id}&status=${jobStatus}` : `/api/jobs?caregiver_id=${id}`

            const res = await fetch(url)
            return res.json()
        },

        enabled: (id && jobStatus) ? (!!id && !!jobStatus) : !!id
    })

    return { jobs, isLoading, refetch };
};

export default useMyJobs;