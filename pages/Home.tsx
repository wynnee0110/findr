import React, { useState, useEffect } from 'react';
import { ItemCard } from '../components/ItemCard';
import { Item, ItemType, CATEGORIES } from '../types';
import { getItems } from '../services/mockData';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '../components/Button';

export const Home: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Advanced Filters State
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [activeType, setActiveType] = useState<ItemType | 'ALL'>('ALL');

  const fetchItems = async () => {
    setLoading(true);
    const data = await getItems({
      query: searchQuery,
      category: selectedCategory || undefined,
      startDate: dateRange.start || undefined,
      endDate: dateRange.end || undefined,
      isVerified: true // Only show verified items on home
    });
    
    // Filter by type client-side for smoother tab switching
    const filtered = activeType === 'ALL' ? data : data.filter(i => i.type === activeType);
    setItems(filtered);
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchItems();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, dateRange, activeType]);

  const clearFilters = () => {
    setSelectedCategory('');
    setDateRange({ start: '', end: '' });
    setSearchQuery('');
    setActiveType('ALL');
  };

  return (
    <div className="pb-28 pt-2 px-6 max-w-5xl mx-auto min-h-screen">
      
      {/* Creative Header */}
      <div className="mb-6 mt-4 relative">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
          Find what's <br/>
          <span className="text-brand-blue">Missing</span>.
        </h2>
      </div>

      {/* Search Bar */}
      <div className="sticky top-20 z-30 mb-6">
        <div className="relative group shadow-soft rounded-[2rem]">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search size={22} className="text-gray-400 group-focus-within:text-brand-blue transition-colors" />
            </div>
            <input
            type="text"
            placeholder="Search..."
            className="w-full pl-14 pr-14 py-4 bg-white dark:bg-gray-900 border-none rounded-[2rem] focus:ring-2 focus:ring-brand-blue/20 transition-all text-gray-700 dark:text-gray-200 font-medium text-lg placeholder:text-gray-400 dark:placeholder:text-gray-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 right-2 flex items-center">
                <button 
                    onClick={() => setShowFilters(true)}
                    className={`p-2.5 rounded-full transition-all duration-300 ${
                        selectedCategory || dateRange.start ? 'bg-brand-blue text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                >
                    <SlidersHorizontal size={20} />
                </button>
            </div>
        </div>
      </div>

      {/* Type Tabs */}
      <div className="flex p-1 bg-gray-100 dark:bg-gray-900 rounded-2xl mb-6 relative transition-colors">
          {([ 'ALL', ItemType.LOST, ItemType.FOUND ] as const).map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 z-10 ${
                    activeType === type ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                  {type === 'ALL' ? 'All Items' : type === ItemType.LOST ? 'Lost' : 'Found'}
              </button>
          ))}
      </div>

      {/* Advanced Filter Sheet (Mobile Modal) */}
      {showFilters && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center pointer-events-none">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" onClick={() => setShowFilters(false)}></div>
              <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 pointer-events-auto animate-slide-up shadow-2xl relative max-h-[85vh] overflow-y-auto">
                  
                  <div className="flex justify-between items-center mb-8">
                      <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">Filters</h3>
                      <button onClick={() => setShowFilters(false)} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                          <X size={24} className="text-gray-500 dark:text-gray-400" />
                      </button>
                  </div>

                  <div className="space-y-8">
                      {/* Categories */}
                      <div>
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 block">Category</label>
                          <div className="flex flex-wrap gap-3">
                              {CATEGORIES.map(cat => (
                                  <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat === selectedCategory ? '' : cat)}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                                        selectedCategory === cat 
                                        ? 'border-brand-blue bg-brand-blue/10 text-brand-blue' 
                                        : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:border-gray-200 dark:hover:border-gray-700'
                                    }`}
                                  >
                                      {cat}
                                  </button>
                              ))}
                          </div>
                      </div>

                      {/* Date Range */}
                      <div>
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 block">Date Range</label>
                          <div className="flex gap-4">
                              <div className="flex-1">
                                  <span className="text-xs text-gray-400 mb-1 block">From</span>
                                  <div className="relative">
                                    <input 
                                        type="date" 
                                        className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl py-3 pl-3 pr-3 text-sm font-bold text-gray-700 dark:text-gray-200"
                                        value={dateRange.start}
                                        onChange={(e) => setDateRange(prev => ({...prev, start: e.target.value}))}
                                    />
                                  </div>
                              </div>
                              <div className="flex-1">
                                  <span className="text-xs text-gray-400 mb-1 block">To</span>
                                  <div className="relative">
                                    <input 
                                        type="date" 
                                        className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl py-3 pl-3 pr-3 text-sm font-bold text-gray-700 dark:text-gray-200"
                                        value={dateRange.end}
                                        onChange={(e) => setDateRange(prev => ({...prev, end: e.target.value}))}
                                    />
                                  </div>
                              </div>
                          </div>
                      </div>

                      <Button fullWidth onClick={() => setShowFilters(false)}>
                          Show Results
                      </Button>
                  </div>
              </div>
          </div>
      )}

      {/* Results Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
           <div className="w-12 h-12 border-4 border-gray-100 dark:border-gray-800 border-t-brand-blue rounded-full animate-spin mb-4"></div>
           <p className="text-gray-400 font-medium text-sm">Searching database...</p>
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-6">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Filter size={32} className="text-gray-300 dark:text-gray-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">No matches found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Try adjusting your filters or search terms.</p>
          <button onClick={clearFilters} className="text-brand-blue font-bold hover:underline">Clear all filters</button>
        </div>
      )}
    </div>
  );
};