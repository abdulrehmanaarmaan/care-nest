'use client'
import { useQuery } from '@tanstack/react-query';
import React from 'react';

const useUserData = () => {

    const { data: user, refetch } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const res = await fetch('/api/me')
            return res.json()
        }
    })

    return { ...user, refetch };
};

export default useUserData;