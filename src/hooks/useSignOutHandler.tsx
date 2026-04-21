import { signOut } from 'next-auth/react';
import React from 'react';

const useSignOutHandler = () => {

    const handleSignOut = () => {
        signOut({ callbackUrl: '/' })
            .then(() => {
                localStorage.removeItem('userData')
                localStorage.removeItem('formData')
            })
    }

    return handleSignOut;
};

export default useSignOutHandler;