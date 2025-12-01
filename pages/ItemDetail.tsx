import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Item, ItemType, ItemStatus } from '../types';
import { getItemById, markAsResolved } from '../services/mockData';
import { Button } from '../components/Button';
import { ChevronLeft, MapPin, Calendar, ShieldCheck, Share2, MessageCircle } from 'lucide-react';

export const ItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    if (id) {
      getItemById(id).then(data => {
        setItem(data || null);
        setLoading(false);
      });
    }
  }, [id]);

  const handleClaim = async () => {
      setClaiming(true);
      if (id) await markAsResolved(id);
      if (item) setItem({...item, status: ItemStatus.RESOLVED});
      setClaiming(false);
  };

  if (loading) return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
          <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-800 border-t-brand-blue rounded-full animate-spin"></div>
      </div>
  );

  if (!item) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center dark:text-white">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Item not found</h2>
        <Button onClick={() => navigate('/')} variant="secondary">Go Home</Button>
    </div>
  );

  const isLost = item.type === ItemType.LOST;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pb-24 transition-colors duration-300">
      {/* Immersive Header Image */}
      <div className="fixed top-0 left-0 w-full h-[45vh] z-0">
        <img 
            src={item.imageUrl} 
            alt={item.title} 
            className={`w-full h-full object-cover transition-all duration-700 ${item.status === ItemStatus.RESOLVED ? 'grayscale brightness-50' : ''}`} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20"></div>
        
        {/* Nav */}
        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
            <button onClick={() => navigate(-1)} className="p-3 bg-white/20 backdrop-blur-xl border border-white/20 rounded-full text-white hover:bg-white/30 transition-colors">
                <ChevronLeft size={24} />
            </button>
            <div className="flex gap-3">
                <button className="p-3 bg-white/20 backdrop-blur-xl border border-white/20 rounded-full text-white hover:bg-white/30 transition-colors">
                    <Share2 size={20} />
                </button>
            </div>
        </div>
      </div>

      {/* Spacer to push content down */}
      <div className="h-[35vh]"></div>

      {/* Floating Content Sheet */}
      <div className="relative z-10 bg-white dark:bg-gray-950 rounded-t-[2.5rem] min-h-[65vh] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] px-8 py-10 animate-slide-up transition-colors duration-300">
        
        {/* Pull handle indicator */}
        <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-8"></div>

        <div className="flex justify-between items-start mb-6">
            <div className="flex-1 mr-4">
                 <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        isLost ? 'bg-red-50 dark:bg-red-900/30 text-brand-red' : 'bg-green-50 dark:bg-green-900/30 text-brand-green'
                    }`}>
                        {item.type}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                        {item.category}
                    </span>
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">{item.title}</h1>
            </div>
            {item.status === ItemStatus.RESOLVED && (
                <div className="flex flex-col items-center justify-center w-14 h-14 bg-green-50 dark:bg-green-900/20 rounded-2xl text-brand-green shadow-inner">
                    <ShieldCheck size={28} />
                </div>
            )}
        </div>

        {/* Reporter Info */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 mb-8 transition-colors">
            <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-brand-blue shadow-sm font-bold text-lg">
                {item.contactName.charAt(0)}
            </div>
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Reported by</p>
                <p className="font-bold text-gray-800 dark:text-gray-200">{item.contactName}</p>
            </div>
        </div>

        {/* Description */}
        <div className="mb-8">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-lg">Details</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base font-medium">
                {item.description}
            </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="p-5 rounded-[1.5rem] bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 flex flex-col gap-2">
                <MapPin size={24} className="text-brand-blue mb-1" />
                <span className="text-xs text-gray-400 dark:text-gray-500 uppercase font-bold">Location</span>
                <span className="font-bold text-gray-800 dark:text-gray-200">{item.location}</span>
            </div>
            <div className="p-5 rounded-[1.5rem] bg-yellow-50/50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 flex flex-col gap-2">
                <Calendar size={24} className="text-brand-yellow mb-1" />
                <span className="text-xs text-gray-400 dark:text-gray-500 uppercase font-bold">Date</span>
                <span className="font-bold text-gray-800 dark:text-gray-200">{item.date}</span>
            </div>
        </div>

        {/* Action Area */}
        {item.status !== ItemStatus.RESOLVED && (
            <div className="pb-8 flex flex-col gap-4">
                <div className="flex gap-4">
                    <Button variant="secondary" className="flex-1" size="lg">
                        <MessageCircle size={20} className="mr-2" />
                        Chat
                    </Button>
                    <Button 
                        fullWidth 
                        size="lg"
                        variant={isLost ? 'primary' : 'primary'}
                        onClick={handleClaim}
                        isLoading={claiming}
                        className="flex-[2]"
                    >
                        {isLost ? 'I Found It' : 'Claim Item'}
                    </Button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};