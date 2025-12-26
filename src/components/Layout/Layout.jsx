import Sidebar from './Sidebar';
import NavBar from '../NavBar/NavBar';
import { useState } from 'react';
import clsx from 'clsx';

const Layout = ({ children }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
            <div
                className={clsx(
                    "flex-1 flex flex-col min-h-screen transition-all duration-300",
                    isSidebarCollapsed ? "ml-20" : "ml-64"
                )}
            >
                <NavBar />
                <main className="flex-1 p-8 overflow-y-auto w-full max-w-7xl mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;