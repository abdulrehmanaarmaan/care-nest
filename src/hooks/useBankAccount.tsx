'use client'
import { useQuery } from '@tanstack/react-query';
import React from 'react';

const useBankAccount = (id) => {

    const { data: bankAccount, isLoading, refetch } = useQuery({

        queryKey: ['bank_account', id],

        queryFn: async () => {
            const res = await fetch(`/api/caregiver-bank-accounts?caregiver_id=${id}`)
            return res.json()
        },

        enabled: !!id
    })

    return { bankAccount, isLoading, refetch };
};

export default useBankAccount;