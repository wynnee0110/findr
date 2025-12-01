import React, { useEffect, useState } from 'react';
import { getItems, getPendingClaims, verifyItem, rejectItem, processClaim } from '../services/mockData';
import { Item, Claim } from '../types';
import { Button } from '../components/Button';
import { Check, X, ShieldAlert } from 'lucide-react';

export const StaffDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ITEMS' | 'CLAIMS'>('ITEMS');
  const [pendingItems, setPendingItems] = useState<Item[]>([]);
  const [pendingClaims, setPendingClaims] = useState<{claim: Claim, item: Item}[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const [items, claims] = await Promise.all([
        getItems({ isVerified: false }),
        getPendingClaims()
    ]);
    setPendingItems(items);
    setPendingClaims(claims);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerifyItem = async (id: string, approve: boolean) => {
      if (approve) await verifyItem(id);
      else await rejectItem(id);
      fetchData();
  };

  const handleProcessClaim = async (id: string, approve: boolean) => {
      await processClaim(id, approve);
      fetchData();
  };

  return (
    <div className="pb-24 pt-4 px-6 max-w-4xl mx-auto min-h-screen">
      <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Staff Dashboard</h1>
          <div className="px-3 py-1 bg-brand-red/10 text-brand-red text-xs font-bold rounded-full uppercase tracking-wider">
              Admin Access
          </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-gray-100 dark:bg-gray-900 rounded-2xl mb-8 transition-colors">
          <button 
            onClick={() => setActiveTab('ITEMS')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'ITEMS' ? 'bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}
          >
              Verify Items ({pendingItems.length})
          </button>
          <button 
            onClick={() => setActiveTab('CLAIMS')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'CLAIMS' ? 'bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}
          >
              Review Claims ({pendingClaims.length})
          </button>
      </div>

      {loading ? (
          <div className="text-center py-12 text-gray-400">Loading dashboard...</div>
      ) : activeTab === 'ITEMS' ? (
          <div className="space-y-4">
              {pendingItems.length === 0 && <p className="text-center py-12 text-gray-400">No pending items.</p>}
              {pendingItems.map(item => (
                  <div key={item.id} className="bg-white dark:bg-gray-900 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-5 transition-colors">
                      <img src={item.imageUrl} alt={item.title} className="w-24 h-24 rounded-2xl object-cover bg-gray-100 dark:bg-gray-800" />
                      <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                              <div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md mb-2 inline-block ${item.type === 'LOST' ? 'bg-red-50 dark:bg-red-900/20 text-brand-red' : 'bg-green-50 dark:bg-green-900/20 text-brand-green'}`}>{item.type}</span>
                                <h3 className="font-bold text-gray-900 dark:text-white text-lg">{item.title}</h3>
                              </div>
                              <span className="text-xs text-gray-400 font-bold">{item.date}</span>
                          </div>
                          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">{item.description}</p>
                          <div className="flex gap-3">
                              <button onClick={() => handleVerifyItem(item.id, true)} className="flex-1 bg-brand-green text-white py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90">
                                  <Check size={16} /> Approve
                              </button>
                              <button onClick={() => handleVerifyItem(item.id, false)} className="flex-1 bg-red-50 dark:bg-red-900/20 text-brand-red py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/30">
                                  <X size={16} /> Reject
                              </button>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      ) : (
          <div className="space-y-4">
              {pendingClaims.length === 0 && <p className="text-center py-12 text-gray-400">No pending claims.</p>}
              {pendingClaims.map(({claim, item}) => (
                   <div key={claim.id} className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
                       <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-50 dark:border-gray-800">
                           <ShieldAlert className="text-brand-yellow" size={20} />
                           <span className="font-bold text-gray-900 dark:text-white">Claim Request for: {item.title}</span>
                       </div>
                       
                       <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl mb-6">
                           <div className="mb-2">
                               <span className="text-xs font-bold text-gray-400 uppercase">Claimant</span>
                               <p className="font-bold text-gray-800 dark:text-gray-200">{claim.claimantName}</p>
                           </div>
                           <div>
                               <span className="text-xs font-bold text-gray-400 uppercase">Proof Provided</span>
                               <p className="font-medium text-gray-600 dark:text-gray-300 italic">"{claim.proofDescription}"</p>
                           </div>
                       </div>

                       <div className="flex gap-3">
                            <Button fullWidth onClick={() => handleProcessClaim(claim.id, true)}>Approve Claim</Button>
                            <Button fullWidth variant="secondary" onClick={() => handleProcessClaim(claim.id, false)}>Reject</Button>
                       </div>
                   </div>
              ))}
          </div>
      )}
    </div>
  );
};