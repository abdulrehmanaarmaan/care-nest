'use client'
import { useQuery } from '@tanstack/react-query';
import React from 'react';

const useUsersData = () => {

    const { data: users = [], refetch, isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await fetch('/api/users?status=')
            return res.json()
        }
    })

    return { users, refetch, isLoading };
};

export default useUsersData;