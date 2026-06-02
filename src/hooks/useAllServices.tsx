'use client'
import { useQuery } from '@tanstack/react-query';
import React from 'react';

const useAllServices = () => {

    const { data: services = [], isLoading } = useQuery({
        queryKey: ['services'],
        queryFn: async () => {
            const result = await fetch('/api/services')
            return result.json()
        }
    })

    return { services, isLoading };
}

export default useAllServices;