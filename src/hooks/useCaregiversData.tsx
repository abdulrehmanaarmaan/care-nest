'use client'
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';

const useCaregiversData = () => {

    const [search, setSearch] = useState('')

    const [specialization, setSpecialization] = useState('')

    const { data: caregivers = [] } = useQuery({
        queryKey: ['caregivers', search, specialization],
        queryFn: async () => {
            const result = await fetch(`/api/caregivers?status=approved&search=${search}&specialization=${specialization}`)
            return result.json()
        }
    })

    return { caregivers, search, setSearch, specialization, setSpecialization };
};

export default useCaregiversData;