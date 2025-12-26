import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    FileText,
    Receipt,
    Menu,
    Settings,
    DollarSign
} from 'lucide-react';
import clsx from 'clsx';
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';

const Sidebar = ({ isCollapsed, onToggle }) => {
    const { user } = useContext(UserContext);

    const allNavItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['owner', 'accountant'] },
        { name: 'Clients', path: '/clients', icon: Users, roles: ['owner', 'accountant'] },
        { name: 'Quotes', path: '/quotes', icon: FileText, roles: ['owner', 'accountant'] },
        { name: 'Invoices', path: '/invoices', icon: Receipt, roles: ['owner', 'accountant'] },
        { name: 'Settings', path: '/settings', icon: Settings, roles: ['owner', 'accountant'] },
    ];

    const navItems = allNavItems.filter(item => item.roles.includes(user?.role || 'owner'));

    return (
        <aside
            className={clsx(
                "bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col h-screen fixed left-0 top-0 z-40 transition-all duration-300",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            <div className="p-4 border-b border-slate-800 bg-slate-900 sticky top-0 z-10 flex items-center gap-4">
                <button
                    onClick={onToggle}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>

                <div className={clsx("flex items-center gap-3 transition-opacity duration-300", isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100")}>
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shrink-0">
                        <DollarSign className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight whitespace-nowrap">InFlow</span>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative",
                                isActive
                                    ? "bg-primary text-white font-medium shadow-lg shadow-primary/20"
                                    : "hover:bg-slate-800 hover:text-white"
                            )
                        }
                        title={isCollapsed ? item.name : ''}
                    >
                        <item.icon className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform duration-200" />
                        {!isCollapsed && <span className="whitespace-nowrap overflow-hidden">{item.name}</span>}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800">
                {!isCollapsed && (
                    <p className="text-xs text-slate-500 text-center whitespace-nowrap overflow-hidden">
                        &copy; {new Date().getFullYear()} InFlow
                    </p>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;