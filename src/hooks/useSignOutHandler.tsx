'use client'
import { signOut, useSession } from 'next-auth/react';
import React from 'react';

const useSignOutHandler = () => {

    const { data } = useSession()
    const { id } = data?.user || {}

    const handleSignOut = () => {
        signOut({ callbackUrl: '/' })
            .then(() => {
                localStorage.removeItem('userData')
                localStorage.removeItem('formData')

                localStorage.removeItem('applicationData')
                localStorage.removeItem('uploadedDocument')
                localStorage.removeItem('uploadedDocumentType')
                localStorage.removeItem('uploadedDocumentName')
                localStorage.removeItem(`caregiver-availability-draft-${id}`)
                localStorage.removeItem(`bank-account-${id}`)
            })
    }

    return handleSignOut;
};

export default useSignOutHandler;