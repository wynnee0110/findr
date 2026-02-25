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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      
      <div className="max-w-6xl mx-auto">
        
        {/* Top Navigation Bar */}
        <div className="flex justify-between items-center mb-6">
            <button 
                onClick={() => navigate(-1)} 
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm"
            >
                <ChevronLeft size={20} />
                <span className="font-semibold text-sm">Back</span>
            </button>
            <button className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm">
                <Share2 size={20} />
            </button>
        </div>

        {/* Main Content Card: Stacked on mobile, side-by-side on desktop */}
        <div className="bg-white dark:bg-gray-950 rounded-[2rem] shadow-xl overflow-hidden flex flex-col lg:flex-row border border-gray-100 dark:border-gray-800">
            
            {/* Left Column: Image Area */}
            <div className="w-full lg:w-1/2 p-4 lg:p-6 bg-gray-50/50 dark:bg-gray-900/50 flex flex-col border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-gray-800">
                <div className="relative w-full aspect-square lg:h-full lg:min-h-[500px] bg-gray-200 dark:bg-gray-800 rounded-[1.5rem] overflow-hidden flex items-center justify-center">
                    <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        /* object-contain ensures the whole item is visible regardless of aspect ratio */
                        className={`w-full h-full object-contain p-2 transition-all duration-700 ${item.status === ItemStatus.RESOLVED ? 'grayscale opacity-60' : ''}`} 
                    />
                    
                    {/* Resolved Overlay */}
                    {item.status === ItemStatus.RESOLVED && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                            <div className="bg-white/90 dark:bg-gray-900/90 px-6 py-3 rounded-full flex items-center gap-2 text-brand-green shadow-lg font-bold">
                                <ShieldCheck size={24} />
                                <span>Item Resolved</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column: Details Area */}
            <div className="w-full lg:w-1/2 p-6 lg:p-10 flex flex-col justify-between">
                
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            isLost ? 'bg-red-50 dark:bg-red-900/30 text-brand-red' : 'bg-green-50 dark:bg-green-900/30 text-brand-green'
                        }`}>
                            {item.type}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                            {item.category}
                        </span>
                    </div>
                    
                    <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
                        {item.title}
                    </h1>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="p-4 rounded-[1.25rem] bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex items-start gap-3">
                            <MapPin size={20} className="text-brand-blue mt-0.5" />
                            <div>
                                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase font-bold mb-1">Location</p>
                                <p className="font-bold text-sm text-gray-800 dark:text-gray-200 leading-tight">{item.location}</p>
                            </div>
                        </div>
                        <div className="p-4 rounded-[1.25rem] bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex items-start gap-3">
                            <Calendar size={20} className="text-brand-yellow mt-0.5" />
                            <div>
                                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase font-bold mb-1">Date</p>
                                <p className="font-bold text-sm text-gray-800 dark:text-gray-200 leading-tight">{item.date}</p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-2">Description</h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm lg:text-base">
                            {item.description}
                        </p>
                    </div>

                    {/* Reporter Info */}
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 mb-8 border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-brand-blue shadow-sm font-bold border border-gray-100 dark:border-gray-700">
                                {item.contactName.charAt(0)}
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Reported by</p>
                                <p className="font-bold text-gray-800 dark:text-gray-200">{item.contactName}</p>
                            </div>
                        </div>
                        {item.status !== ItemStatus.RESOLVED && (
                            <Button variant="secondary" size="sm">
                                <MessageCircle size={16} className="mr-2" />
                                Chat
                            </Button>
                        )}
                    </div>
                </div>

                {/* Bottom Action Area */}
                {item.status !== ItemStatus.RESOLVED && (
                    <div className="pt-6 mt-auto border-t border-gray-100 dark:border-gray-800">
                        <Button 
                            fullWidth 
                            size="lg"
                            variant={isLost ? 'primary' : 'primary'}
                            onClick={handleClaim}
                            isLoading={claiming}
                            className="py-4 text-lg"
                        >
                            {isLost ? 'I Found It' : 'Claim Item'}
                        </Button>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};