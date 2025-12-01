import React, { useEffect, useState } from 'react';
import { Home, Plus, User, Bell, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getNotifications } from '../services/mockData';
import { UserRole } from '../types';

export const TopBar: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
        getNotifications(user.id).then(notes => {
            setUnreadCount(notes.filter(n => !n.isRead).length);
        });
    }
  }, [user]);

  return (
    <div className="sticky top-0 z-40 bg-gray-50/80 dark:bg-gray-950/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between transition-colors duration-300">
      <div className="flex items-center gap-2.5" onClick={() => navigate('/')}>
         <div className="relative w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer transition-colors">
            <div className="w-full h-full bg-brand-blue opacity-100"></div>
            <div className="absolute inset-0 bg-white dark:bg-gray-900 m-[2px] rounded-[10px] flex items-center justify-center transition-colors">
                 <div className="w-2 h-2 rounded-full bg-brand-blue"></div>
            </div>
         </div>
         <h1 className="font-sans font-bold text-xl tracking-tight text-gray-800 dark:text-gray-100 cursor-pointer transition-colors">
            Findr
         </h1>
      </div>
      
      <div className="flex gap-2">
         <button 
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all text-gray-600 dark:text-gray-300"
         >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
         </button>

        {user?.role === UserRole.STAFF && (
             <button onClick={() => navigate('/staff')} className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-dark dark:bg-gray-700 text-white shadow-md hover:scale-105 transition-transform">
                <LayoutDashboard size={18} />
             </button>
        )}
        <button 
            onClick={() => navigate('/notifications')}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all relative group"
        >
            <Bell size={18} className="text-gray-600 dark:text-gray-300 group-hover:text-brand-blue transition-colors" />
            {unreadCount > 0 && (
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-brand-red rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></span>
            )}
        </button>
      </div>
    </div>
  );
};

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <>
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-auto">
      <div className="flex items-center gap-6 bg-gray-900/95 dark:bg-gray-800/95 backdrop-blur-xl text-white px-6 py-3 rounded-full shadow-2xl shadow-gray-900/20 border border-white/10 scale-100 transition-colors">
        
        <Link 
            to="/" 
            className={`relative p-2 rounded-full transition-all duration-300 ${isActive('/') ? 'text-white' : 'text-gray-400 hover:text-white'}`}
        >
            <Home size={24} strokeWidth={isActive('/') ? 2.5 : 2} />
            {isActive('/') && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-blue rounded-full"></span>}
        </Link>

        <Link 
            to="/report" 
            className="p-3 bg-brand-blue text-white rounded-full shadow-lg shadow-brand-blue/30 transform transition-transform hover:scale-110 active:scale-95 border-2 border-gray-800 dark:border-gray-900"
        >
            <Plus size={28} strokeWidth={3} />
        </Link>

        <Link 
            to="/profile" 
            className={`relative p-2 rounded-full transition-all duration-300 ${isActive('/profile') ? 'text-white' : 'text-gray-400 hover:text-white'}`}
        >
            <User size={24} strokeWidth={isActive('/profile') ? 2.5 : 2} />
             {isActive('/profile') && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-blue rounded-full"></span>}
        </Link>

      </div>
    </div>
    {/* Spacer for bottom area is handled by Layout footer padding usually, but extra safety here for overlapping content */}
    </>
  );
};