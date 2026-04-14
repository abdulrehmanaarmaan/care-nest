'use client'
import React, { useState } from 'react';

const usePasswordState = () => {

    const [showPassword, setShowPassword] = useState(false)

    return { showPassword, setShowPassword };
};

export default usePasswordState;