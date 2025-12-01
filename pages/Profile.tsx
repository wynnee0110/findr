import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserItems, getUserClaims } from '../services/mockData';
import { Item, Claim } from '../types';
import { User as UserIcon, LogOut, ChevronRight, Package, Archive } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';

export const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [myItems, setMyItems] = useState<Item[]>([]);
  const [myClaims, setMyClaims] = useState<{claim: Claim, item: Item}[]>([]);

  useEffect(() => {
    if (user) {
      getUserItems(user.id).then(setMyItems);
      getUserClaims(user.id).then(setMyClaims);
    }
  }, [user]);

  if (!user) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-gray-50 dark:bg-gray-950 transition-colors">
              <div className="w-20 h-20 bg-brand-blue rounded-3xl flex items-center justify-center mb-8 shadow-xl">
                  <UserIcon className="text-white" size={40} />
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Not Logged In</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">Access your history and manage reports.</p>
              <Button onClick={() => navigate('/login')} fullWidth>Sign In</Button>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-32 transition-colors duration-300">
       {/* Stylish Header */}
       <div className="bg-gray-900 dark:bg-black pt-16 pb-32 px-6 rounded-b-[3rem] relative overflow-hidden">
           <div className="absolute top-0 right-0 w-80 h-80 bg-brand-blue/20 rounded-full -mr-20 -mt-20 blur-3xl animate-pulse"></div>
           <div className="absolute bottom-0 left-0 w-60 h-60 bg-brand-red/20 rounded-full -ml-10 -mb-10 blur-3xl"></div>
           
           <div className="flex items-center justify-between relative z-10 mb-6">
                <h1 className="text-3xl font-extrabold text-white">Profile</h1>
                <button 
                    onClick={logout}
                    className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
                >
                    <LogOut size={20} />
                </button>
           </div>
       </div>

       <div className="px-6 -mt-24 relative z-20 space-y-8">
           
           {/* Profile Card */}
           <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 shadow-xl flex flex-col items-center text-center transition-colors">
               <div className="w-24 h-24 rounded-full bg-brand-blue p-1 mb-4 shadow-lg relative">
                    <img src={user.avatarUrl} alt="Avatar" className="w-full h-full rounded-full border-4 border-white dark:border-gray-800 object-cover" />
               </div>
               <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
               <p className="text-gray-400 font-medium mb-6">{user.email}</p>
               
               <div className="grid grid-cols-2 gap-8 w-full border-t border-gray-100 dark:border-gray-800 pt-6">
                   <div>
                       <span className="block text-2xl font-extrabold text-gray-900 dark:text-white">{myItems.length}</span>
                       <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Reports</span>
                   </div>
                   <div>
                       <span className="block text-2xl font-extrabold text-brand-green">{myClaims.length}</span>
                       <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Claims</span>
                   </div>
               </div>
           </div>

           {/* History Section */}
           <div>
               <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 px-2">Recent Activity</h3>
               <div className="space-y-4">
                   {myItems.length === 0 && myClaims.length === 0 && (
                       <div className="p-8 text-center text-gray-400 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                           No activity yet.
                       </div>
                   )}
                   
                   {myItems.slice(0, 3).map(item => (
                       <div key={item.id} className="bg-white dark:bg-gray-900 p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-transparent dark:border-gray-800 transition-colors">
                           <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.type === 'LOST' ? 'bg-red-50 dark:bg-red-900/20 text-brand-red' : 'bg-green-50 dark:bg-green-900/20 text-brand-green'}`}>
                               <Package size={20} />
                           </div>
                           <div className="flex-1">
                               <p className="font-bold text-gray-800 dark:text-gray-100">{item.title}</p>
                               <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{item.status} • {new Date(item.date).toLocaleDateString()}</p>
                           </div>
                           <ChevronRight size={16} className="text-gray-300 dark:text-gray-600" />
                       </div>
                   ))}

                    {myClaims.slice(0, 3).map(({item, claim}) => (
                       <div key={claim.id} className="bg-white dark:bg-gray-900 p-4 rounded-2xl flex items-center gap-4 shadow-sm opacity-80 border border-transparent dark:border-gray-800 transition-colors">
                           <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-yellow-50 dark:bg-yellow-900/20 text-brand-yellow">
                               <Archive size={20} />
                           </div>
                           <div className="flex-1">
                               <p className="font-bold text-gray-800 dark:text-gray-100">Claim: {item.title}</p>
                               <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{claim.status} • {new Date(claim.date).toLocaleDateString()}</p>
                           </div>
                       </div>
                   ))}
               </div>
           </div>
       </div>
    </div>
  );
};