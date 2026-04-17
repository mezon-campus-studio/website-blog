import React from 'react';

interface Props {
    children: React.ReactNode;
}

export const MainLayout = ({ children }: Props) => {
    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-blue-600 p-4 text-white shadow-lg">
                <div className="container mx-auto font-bold">MY APP SYSTEM</div>
            </nav>
            <main className="container mx-auto py-8">
                {children}
            </main>
        </div>
    );
};