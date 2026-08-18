'use client'
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';

const useMyReviews = (caregiver_id = null) => {

    const { data } = useSession()
    const { id } = data?.user || {}

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRating, setSelectedRating] = useState('all');

    const { data: reviews = [], isLoading } = useQuery({

        queryKey: ['caregiver-reviews', caregiver_id, id, searchTerm, selectedRating],

        queryFn: async () => {

            const params = new URLSearchParams({
                caregiver_id: caregiver_id || id
            })

            if (searchTerm) params.append('search_term', searchTerm)

            if (selectedRating) params.append('selected_rating', selectedRating)

            const url = `/api/caregiver-reviews?${params.toString()}`

            const res = await fetch(url)
            return res.json()
        },

        enabled: caregiver_id ? !!caregiver_id : !!id,

        placeholderData: keepPreviousData

    })

    return { searchTerm, setSearchTerm, selectedRating, setSelectedRating, reviews, isLoading };
};

export default useMyReviews;