'use client'
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React from 'react';

const useMyApplication = () => {

    const { data } = useSession()

    const { id } = data?.user || {}

    const { data: savedApplication = {}, refetch } = useQuery({

        queryKey: ['my_application', id],

        queryFn: async () => {
            const res = await fetch(`/api/caregiver-applications?userId=${id}`)
            return res.json()
        },

        enabled: !!id
    })

    const { exists, application_status, application } = savedApplication

    return { exists, application_status, application, refetch };
};

export default useMyApplication;