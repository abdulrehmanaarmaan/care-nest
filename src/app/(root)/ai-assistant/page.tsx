'use client'
import { Bot, SendHorizontal, Sparkles, User } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import useScrollHandler from '../../../hooks/useScrollHandler';
import { useRouter } from 'next/navigation';

const AiAssistant = () => {

    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Hi 👋 I’m your Care Nest assistant. How can I help you today?',
            actions: []
        }
    ])

    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)

    const sendMessage = async () => {
        if (!input.trim()) return
        const newMessages = [...messages, { role: 'user', content: input, actions: [] }]
        setMessages(newMessages)
        setInput('')
        setLoading(true)
        try {
            const res = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages })
            })

            if (!res.ok) {
                throw new Error("API failed");
            }

            const data = await res.json()
            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    content: data.reply,
                    actions: data.actions || []
                }
            ])
        } catch (error) {
            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    content: 'Something went wrong. Please try again.',
                    actions: []
                }
            ])
        } finally {
            setLoading(false)
        }
    }

    const bottomRef = useRef(null);
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const clearChat = () => {
        setMessages([
            {
                role: 'assistant',
                content: 'Hi 👋 I’m your Care Nest assistant. How can I help you today?',
                actions: []
            }
        ])
    }

    const router = useRouter()

    // const scrollToServices = useScrollHandler("services")

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-8 md:p-12">
            <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl shadow-teal-900/5 flex flex-col h-[85vh] border border-gray-100 overflow-hidden">
                {/* Header Section */}
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                            <span className="text-teal-600 text-xl">✨</span>
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-800 leading-tight">Care Nest AI</h2>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Online Assistant</p>
                            </div>
                        </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors" onClick={clearChat}>
                        <small className="font-semibold underline underline-offset-4 cursor-pointer">Clear Chat</small>
                    </button>
                </div>
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`group relative p-4 px-5 rounded-2xl text-sm leading-relaxed shadow-sm transition-all duration-200 ${msg.role === 'user'
                                    ? 'bg-teal-600 text-white rounded-tr-none ml-12 shadow-teal-200'
                                    : 'bg-slate-50 text-slate-700 border border-slate-100 rounded-tl-none mr-12'
                                    }`}
                            >
                                {msg.content}
                                {msg.actions?.length > 0 && (
                                    <div className="flex gap-2 mt-3 flex-wrap">
                                        {msg.actions.map((action, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    if (action.route === "/#services") {
                                                        router.push("/#services");
                                                    } else {
                                                        router.push(action.route);
                                                    }
                                                }}
                                                className="text-xs bg-teal-100 text-teal-700 px-3 py-1 rounded-full font-semibold hover:bg-teal-200 cursor-pointer"
                                            >
                                                {action.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                <span className={`absolute bottom-[-18px] text-[10px] font-medium text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity ${msg.role === 'user' ? 'right-0' : 'left-0'
                                    }`}>
                                    Delivered
                                </span>
                            </div>
                        </div>
                    ))}
                    <div ref={bottomRef} />
                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl rounded-tl-none">
                                <div className="flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {/* Input Section */}
                <div className="p-6 bg-white border-t border-gray-100">
                    <form
                        className="relative flex items-center gap-3"
                        onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                    >
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about services, pricing, booking..."
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all text-gray-700 placeholder:text-gray-400"
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="bg-teal-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-teal-700 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 transition-all shadow-lg shadow-teal-600/20 cursor-pointer"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                            ) : 'Send'}
                        </button>
                    </form>
                    <p className="text-center text-[10px] text-gray-400 mt-4 font-medium uppercase tracking-widest">
                        Powered by Care Nest Intelligence
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AiAssistant;