'use client';

import Link from 'next/link';
import { Bot } from 'lucide-react';

const AIAssistantButton = () => {
    return (
        <Link
            href="/dashboard/ai-assistant"
            className="fixed bottom-6 right-6 z-[99999] flex items-center gap-2 rounded-full bg-red-600 px-6 py-4 text-white shadow-2xl"
        >
            <Bot size={24} />
            <span>AI Assistant</span>
        </Link>
    );
};

export default AIAssistantButton;