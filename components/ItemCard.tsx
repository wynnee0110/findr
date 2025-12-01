import React from 'react';
import { Item, ItemType, ItemStatus } from '../types';
import { MapPin, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ItemCardProps {
  item: Item;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const navigate = useNavigate();

  const isLost = item.type === ItemType.LOST;
  const isResolved = item.status === ItemStatus.RESOLVED;

  return (
    <div 
      onClick={() => navigate(`/item/${item.id}`)}
      className="group bg-white dark:bg-gray-900 rounded-3xl p-3 shadow-sm hover:shadow-soft border border-white dark:border-gray-800 transition-all duration-300 relative cursor-pointer hover:-translate-y-1"
    >
      <div className="relative h-56 w-full overflow-hidden rounded-[1.2rem] bg-gray-100 dark:bg-gray-800 mb-3">
        <img 
          src={item.imageUrl} 
          alt={item.title} 
          className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 ${isResolved ? 'grayscale opacity-80' : ''}`}
        />
        
        {/* Floating Status Badge */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
           <div className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm border border-white/20 ${
            isLost 
              ? 'bg-brand-red/90 text-white' 
              : 'bg-brand-green/90 text-white'
          }`}>
            {item.type}
          </div>
          
          {isResolved && (
            <div className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-900/90 text-white backdrop-blur-md border border-white/20">
              Resolved
            </div>
          )}
        </div>
        
        {/* Action hint overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white border border-white/30 transform scale-75 group-hover:scale-100 transition-transform">
                <ArrowUpRight size={24} />
             </div>
        </div>
      </div>

      <div className="px-2 pb-2">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 line-clamp-1 group-hover:text-brand-blue transition-colors">
            {item.title}
          </h3>
        </div>

        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-3 leading-relaxed">
          {item.description}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-gray-800">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-lg">
                <MapPin size={12} className="text-brand-blue" />
                <span className="line-clamp-1 max-w-[80px]">{item.location}</span>
            </div>
            <span className="text-xs font-medium text-gray-400 dark:text-gray-500">{item.date}</span>
        </div>
      </div>
    </div>
  );
};