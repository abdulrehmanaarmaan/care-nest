import React from 'react';
import NextAuthProvider from '../providers/NextAuthProvider';
import './globals.css'
import QueryProvider from '../providers/QueryProvider';

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
                        {children}
                    </NextAuthProvider>
                </QueryProvider>
            </body>
        </html >
    );
};

// export default layout;
