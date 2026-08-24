'use client';

import Link from 'next/link';
import { Bot } from 'lucide-react';
import { useSession } from 'next-auth/react';
import useUserData from '../../../hooks/useUserData';

const AIAssistantButton = () => {
    const { status } = useSession();
    const { user } = useUserData();

    if (status !== 'authenticated') {
        return null;
    }

    if (user?.role !== 'user' && user?.role !== 'caregiver') {
        return null;
    }

    return (
        <Link
            href="/dashboard/ai-assistant"
            aria-label="Open CareNest AI Assistant"
            className="fixed bottom-6 right-6 z-9999 flex items-center gap-2 rounded-full bg-teal-600 px-5 py-3 font-semibold text-white shadow-xl hover:bg-teal-700"
        >
            <Bot size={20} />
            <span>AI Assistant</span>
        </Link>
    );
};

export default AIAssistantButton;