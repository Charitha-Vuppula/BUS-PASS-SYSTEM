import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { 
  LayoutDashboard, 
  CreditCard, 
  FileCheck, 
  History, 
  Settings, 
  LogOut, 
  Moon, 
  Sun,
  ShieldCheck,
  Nfc,
  Bus,
  AlertTriangle
} from 'lucide-react';

const Sidebar = ({ isAdmin }) => {
  const { logout, user } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();

  const userLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Apply Pass', path: '/apply', icon: <FileCheck size={20} /> },
    { name: 'My Pass', path: '/pass', icon: <Nfc size={20} /> },
    { name: 'Renew Pass', path: '/renew', icon: <History size={20} /> },
    { name: 'Report Problem', path: '/report', icon: <AlertTriangle size={20} /> },
    { name: 'Settings', path: '/profile', icon: <Settings size={20} /> },
  ];

  const adminLinks = [
    { name: 'Analytics', path: '/admin/analytics', icon: <ShieldCheck size={20} /> },
    { name: 'Pass Requests', path: '/admin/requests', icon: <FileCheck size={20} /> },
    { name: 'Settings', path: '/profile', icon: <Settings size={20} /> },
  ];

  const links = isAdmin || user?.role === 'admin' ? adminLinks : userLinks;

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col justify-between transition-colors duration-300 shadow-sm z-10">
      <div>
        {/* Logo/Header */}
        <div className="h-20 flex items-center px-6 border-b border-border/50">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Bus size={18} />
            </div>
            <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
              BusPass
            </span>
          </Link>
        </div>

        {/* User Info mini */}
        <div className="px-6 py-6 flex items-center gap-3 border-b border-border/50 bg-muted/20">
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shadow-sm">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate">{user?.name || 'User'}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{user?.role || 'Passenger'}</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1">
          {links.map((link) => {
            const isActive = location.pathname === link.path || (link.path === '/admin' && location.pathname.startsWith('/admin'));
            
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 scale-[1.02]'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {link.icon}
                <span className="text-sm">{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Actions */}
      <div className="p-4 border-t border-border/50 space-y-2">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          <span className="text-sm">Theme</span>
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all duration-200 font-bold"
        >
          <LogOut size={20} />
          <span className="text-sm">Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
