import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getNotifications, markNotificationRead } from '../services/mockData';
import { Notification } from '../types';
import { Bell, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Notifications: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      getNotifications(user.id).then(setNotifications);
    }
  }, [user]);

  const handleClick = async (notification: Notification) => {
    if (!notification.isRead) {
        await markNotificationRead(notification.id);
        setNotifications(prev => prev.map(n => n.id === notification.id ? {...n, isRead: true} : n));
    }
    if (notification.relatedItemId) {
        navigate(`/item/${notification.relatedItemId}`);
    }
  };

  if (!user) return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Please login to view notifications.</div>;

  return (
    <div className="pb-24 pt-4 px-6 max-w-3xl mx-auto min-h-screen">
       <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">Notifications</h1>

       {notifications.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-20 opacity-50">
               <Bell size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
               <p className="font-medium text-gray-400 dark:text-gray-500">No new notifications</p>
           </div>
       ) : (
           <div className="space-y-4">
               {notifications.map(note => (
                   <div 
                        key={note.id} 
                        onClick={() => handleClick(note)}
                        className={`p-5 rounded-3xl transition-all cursor-pointer border ${
                            note.isRead 
                                ? 'bg-white dark:bg-gray-900 border-transparent dark:border-gray-800' 
                                : 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30 shadow-sm'
                        }`}
                   >
                       <div className="flex items-start gap-4">
                           <div className={`mt-1.5 w-3 h-3 rounded-full flex-shrink-0 ${note.isRead ? 'bg-gray-200 dark:bg-gray-700' : 'bg-brand-blue'}`}></div>
                           <div className="flex-1">
                               <h4 className={`text-lg mb-1 ${note.isRead ? 'font-bold text-gray-700 dark:text-gray-300' : 'font-extrabold text-gray-900 dark:text-white'}`}>
                                   {note.title}
                               </h4>
                               <p className={`text-sm leading-relaxed mb-3 ${note.isRead ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300 font-medium'}`}>
                                   {note.message}
                               </p>
                               <span className="text-xs font-bold text-gray-300 dark:text-gray-600 uppercase">
                                   {new Date(note.date).toLocaleDateString()}
                                </span>
                           </div>
                           <ChevronRight size={20} className="text-gray-300 dark:text-gray-600 mt-2" />
                       </div>
                   </div>
               ))}
           </div>
       )}
    </div>
  );
};