'use client'

import { useQuery } from '@tanstack/react-query';
import React from 'react';

const useLocationDetails = () => {

    const { data: warehouses = [], isLoading } = useQuery({
        queryKey: ['warehouses'],
        queryFn: async () => {
            const result = await fetch('/api/warehouses')
            return result.json()
        }
    })

    const regions = new Set(warehouses.map(warehouse => warehouse?.region))
    const uniqueRegions = [...regions]

    return { warehouses, isLoading, uniqueRegions };
};

export default useLocationDetails;