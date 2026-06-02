'use client'
import { useQuery } from '@tanstack/react-query';
import React from 'react';

const useCaregiverDetails = (id) => {

    const { data: application, isLoading, refetch } = useQuery({
        queryKey: ['application', id],
        queryFn: async () => {
            const result = await fetch(`/api/caregiver-applications/${id}`)
            return result.json()
        },
        enabled: !!id
    })

    return { application, isLoading, refetch };
};

export default useCaregiverDetails;