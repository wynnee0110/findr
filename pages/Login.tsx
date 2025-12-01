import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Shield, User, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (role: UserRole) => {
    await login(role);
    navigate(role === UserRole.STAFF ? '/staff' : '/');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 dark:bg-brand-blue/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-red/10 dark:bg-brand-red/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-12">
           <div className="w-16 h-16 bg-brand-blue rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-brand-blue/20">
              <div className="w-8 h-8 bg-white dark:bg-gray-900 rounded-full transition-colors"></div>
           </div>
           <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight">Findr</h1>
           <p className="text-gray-500 dark:text-gray-400 font-medium">Connect. Report. Recover.</p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => handleLogin(UserRole.STUDENT)}
            disabled={isLoading}
            className="w-full group relative overflow-hidden p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl shadow-soft dark:shadow-none hover:shadow-xl dark:hover:bg-gray-750 transition-all duration-300 text-left"
          >
             <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-brand-blue flex items-center justify-center group-hover:scale-110 transition-transform">
                        <User size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">Student Login</h3>
                        <p className="text-gray-400 dark:text-gray-500 text-sm">Access via institutional email</p>
                    </div>
                </div>
                <ArrowRight size={20} className="text-gray-300 dark:text-gray-600 group-hover:text-brand-blue transform group-hover:translate-x-1 transition-all" />
             </div>
          </button>

          <button 
            onClick={() => handleLogin(UserRole.STAFF)}
            disabled={isLoading}
            className="w-full group relative overflow-hidden p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl shadow-soft dark:shadow-none hover:shadow-xl dark:hover:bg-gray-750 transition-all duration-300 text-left"
          >
             <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-transparent dark:from-red-900/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-900/20 text-brand-red flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Shield size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">Staff Portal</h3>
                        <p className="text-gray-400 dark:text-gray-500 text-sm">Manage items and claims</p>
                    </div>
                </div>
                <ArrowRight size={20} className="text-gray-300 dark:text-gray-600 group-hover:text-brand-red transform group-hover:translate-x-1 transition-all" />
             </div>
          </button>
        </div>

        <p className="mt-12 text-center text-[10px] font-bold text-gray-300 dark:text-gray-600 uppercase tracking-widest">
            Google Developer Groups on Campus - USTP
        </p>
      </div>
    </div>
  );
};