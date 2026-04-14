'use client'
import { useQuery } from '@tanstack/react-query';
import React from 'react';

const useServiceInfo = (id) => {

    const { data: service, isLoading } = useQuery({
        queryKey: ['service', id],
        queryFn: async () => {
            const result = await fetch(`/api/services/${id}`)
            return result.json()
        }
    })

    return { service, isLoading }
};

export default useServiceInfo;