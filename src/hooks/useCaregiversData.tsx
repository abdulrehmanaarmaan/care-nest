'use client'
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';

const useCaregiversData = () => {

    const [search, setSearch] = useState('')

    const [specialization, setSpecialization] = useState('')

    const { data: caregivers = [] } = useQuery({

        queryKey: ['caregivers', search, specialization],

        queryFn: async () => {

            const params = new URLSearchParams({
                status: 'approved'
            })

            if (search) params.append('search', search)
            if (specialization) params.append('specialization', specialization)

            const url = `/api/caregiver-applications?${params.toString()}`

            const result = await fetch(url)
            return result.json()
        },

        enabled: search ? !!search : specialization ? !!specialization : (search && specialization) ? (!!search && !!specialization) : true
    })

    return { caregivers, search, setSearch, specialization, setSpecialization };
};

export default useCaregiversData;