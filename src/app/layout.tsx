import React from 'react';
import NextAuthProvider from '../providers/NextAuthProvider';
import './globals.css'
import QueryProvider from '../providers/QueryProvider';
import { Toaster } from 'sonner';

export const metadata = {
    title: 'Care Nest',
    description: 'Care Nest App',
    metadataBase: new URL("http://localhost:3000")
}

export default function RootLayout({ children }) {
    console.log('ROOT LAYOUT RENDERED')
    return (
        <html lang="en">
            <body>
                <QueryProvider>
                    <NextAuthProvider>
                        <Toaster richColors position="top-right" />
                        {children}
                    </NextAuthProvider>
                </QueryProvider>
            </body>
        </html >
    );
};
