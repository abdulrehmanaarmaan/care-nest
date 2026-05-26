'use client'
import { useQuery } from '@tanstack/react-query';
import React from 'react';

const useUsersData = () => {

    const { data: users = [], refetch } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await fetch('/api/users')
            return res.json()
        }
    })

    return { users, refetch };
};

export default useUsersData;