import { signOut } from 'next-auth/react';
import React from 'react';

const useSignOutHandler = () => {

    const handleSignOut = () => {
        signOut({ callbackUrl: '/' })
            .then(() => {
                localStorage.removeItem('userData')
                localStorage.removeItem('formData')

                localStorage.removeItem('applicationData')
                localStorage.removeItem('uploadedDocument')
                localStorage.removeItem('uploadedDocumentType')
                localStorage.removeItem('uploadedDocumentName')
            })
    }

    return handleSignOut;
};

export default useSignOutHandler;