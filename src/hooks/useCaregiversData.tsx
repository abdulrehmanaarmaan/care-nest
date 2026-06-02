'use client'
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';

const useCaregiversData = () => {

    const [search, setSearch] = useState('')

    const [specialization, setSpecialization] = useState('')

    const { data: caregivers = [] } = useQuery({
        queryKey: ['caregivers', search, specialization],
        queryFn: async () => {
            const url = (search && specialization) ? `/api/caregiver-applications?status=approved&search=${search}&specialization=${specialization}` : '/api/caregiver-applications?status=approved'
            const result = await fetch(url)
            return result.json()
        },
        enabled: (search && search) ? (!!search && !!specialization) : true
    })

    return { caregivers, search, setSearch, specialization, setSpecialization };
};

export default useCaregiversData;