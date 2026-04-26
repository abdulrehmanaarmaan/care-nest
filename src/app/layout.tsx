import React from 'react';
import NextAuthProvider from '../providers/NextAuthProvider';
import './globals.css'

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
                <NextAuthProvider>
                    {children}
                </NextAuthProvider>
            </body>
        </html>
    );
};

// export default layout;
