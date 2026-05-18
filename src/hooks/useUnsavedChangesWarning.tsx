'use client'
import React, { useEffect } from 'react';

const useUnsavedChangesHandler = ({ hasUnsavedChanges, pathname }) => {
    useEffect(() => {
        if (!hasUnsavedChanges) return;
        const handleClick = (e) => {
            if (!(e.target instanceof Element)) return;
            const link = e.target.closest('a');
            if (!link) return;
            const href = link.getAttribute('href');
            // ignore empty or external
            if (!href || href.startsWith('http')) return;
            // ignore same route
            if (href === pathname) return;
            const ok = window.confirm(
                'You have unsaved changes. Leave this page?'
            );
            if (!ok) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
        };
        // IMPORTANT: capture phase
        document.addEventListener('click', handleClick, true);
        return () => {
            document.removeEventListener('click', handleClick, true);
        };
    }, [hasUnsavedChanges, pathname]);
    useEffect(() => {
        if (!hasUnsavedChanges) return;
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = "";
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [hasUnsavedChanges]);
    useEffect(() => {
        if (!hasUnsavedChanges) return;
        // window.history.pushState(null, '', window.location.href);
        const handlePopState = () => {
            const ok = window.confirm(
                'You have unsaved changes. Leave this page?'
            );
            if (!ok) {
                window.history.pushState(null, '', window.location.href);
            }
        };
        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [hasUnsavedChanges]);
};

export default useUnsavedChangesHandler;