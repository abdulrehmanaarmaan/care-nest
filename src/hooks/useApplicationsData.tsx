'use client'
import { useQuery } from '@tanstack/react-query';
import React from 'react';

const useApplicationsData = (status = null) => {

    const { data: applications = [], refetch } = useQuery({
        queryKey: ['caregivers', status],
        queryFn: async () => {
            const url = status ? `/api/caregiver-applications?status=${status}` : '/api/caregiver-applications'
            const result = await fetch(url)
            return result.json()
        },
        enabled: status ? !!status : true

    })

    return { applications, refetch };
};

export default useApplicationsData;