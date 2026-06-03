'use client'
import { useQuery } from '@tanstack/react-query';
import React from 'react';

const useWithdrawals = (id = null) => {

    const { data: withdrawals = [], refetch } = useQuery({
        queryKey: ['withdrawals', id],

        queryFn: async () => {

            const url = id ? `/api/caregiver-withdrawals?caregiver_id=${id}` : '/api/caregiver-withdrawals'

            const result = await fetch(url)
            return result.json()
        },

        enabled: id ? !!id : true
    })

    return { withdrawals, refetch };
};

export default useWithdrawals;