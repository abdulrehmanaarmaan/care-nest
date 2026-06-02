'use client'
import { useQuery } from '@tanstack/react-query';
import React from 'react';

const useWithdrawals = (id = null) => {

    const { data: withdrawals = [] } = useQuery({
        queryKey: ['withdrawals', id],

        queryFn: async () => {

            const url = id ? `/api/withdrawals?caregiver_id=${id}` : '/api/withdrawals'

            const result = await fetch(url)
            return result.json()
        },

        enabled: id ? !!id : true
    })

    return { withdrawals };
};

export default useWithdrawals;