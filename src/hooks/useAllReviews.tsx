'use client'
import { useQuery } from '@tanstack/react-query';
import React from 'react';

const useAllReviews = () => {

    const { data: reviews = [], isLoading } = useQuery({
        queryKey: ['reviews'],
        queryFn: async () => {
            const result = await fetch('/api/reviews')
            return result.json()
        }
    })

    return { reviews, isLoading };
};

export default useAllReviews;