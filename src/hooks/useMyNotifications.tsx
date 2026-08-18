'use client'
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React from 'react';

const useMyNotifications = (caregiverId = null) => {

    const { data } = useSession()
    const { id } = data?.user || {}

    const { data: notifications = [] } = useQuery({
        queryKey: ['caregiver-notifications', caregiverId, id],

        queryFn: async () => {
            const res = await fetch(`/api/caregiver-notifications?caregiver_id=${caregiverId || id}`)
            return res.json()
        },

        enabled: caregiverId ? !!caregiverId : !!id
    })

    return { notifications };
};

export default useMyNotifications;