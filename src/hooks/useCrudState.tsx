'use client'
import React, { useState } from 'react';

const useCrudState = () => {

    const [isClicked, click] = useState(false)

    return { isClicked, click };
};

export default useCrudState;