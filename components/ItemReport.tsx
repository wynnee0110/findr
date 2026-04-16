import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Item, ItemType, ItemStatus } from '../types';
import { getItemById, markAsResolved } from '../services/mockData';
import { Button } from './Button';
import { ChevronLeft, MapPin, Calendar, ShieldCheck, Share2, MessageCircle, AlertCircle } from 'lucide-react';

function ItemReport() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch the item data when the component loads
  useEffect(() => {
    const fetchItemDetails = async () => {
      setLoading(true);
      try {
        // Assuming getItemById might be an async API call in the future
        const data = await Promise.resolve(getItemById(id || ''));
        setItem(data);
      } catch (error) {
        console.error("Failed to fetch item:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchItemDetails();
  }, [id]);

  const handleResolve = async () => {
    if (!id) return;
    try {
      await Promise.resolve(markAsResolved(id));
      // Optimistically update the local state
      setItem((prev) => prev ? { ...prev, status: ItemStatus.RESOLVED } : null);
    } catch (error) {
      console.error("Failed to resolve item:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-gray-500 animate-pulse">Loading report details...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-4">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-800">Report Not Found</h2>
        <p className="text-gray-500 mb-6">The item report you are looking for does not exist.</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto">

        {/* Header / Back Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 hover:text-gray-800 mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span>Back to Reports</span>
        </button>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Status Banner */}
          <div className={`px-6 py-3 border-b ${item.status === ItemStatus.RESOLVED ? 'bg-green-50 border-green-100' : 'bg-yellow-50 border-yellow-100'
            }`}>
            <div className="flex items-center">
              <ShieldCheck className={`w-5 h-5 mr-2 ${item.status === ItemStatus.RESOLVED ? 'text-green-600' : 'text-yellow-600'
                }`} />
              <span className={`font-semibold ${item.status === ItemStatus.RESOLVED ? 'text-green-800' : 'text-yellow-800'
                }`}>
                Status: {item.status.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="p-6">
            {/* Title & Core Info */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{item.title || 'Unnamed Item'}</h1>
              <p className="text-sm text-gray-500 font-mono">Report ID: #{id}</p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center text-gray-700">
                <Calendar className="w-5 h-5 mr-3 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Reported On</p>
                  <p className="font-medium">{item.date || 'Unknown Date'}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-700">
                <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Location</p>
                  <p className="font-medium">{item.location || 'Not Specified'}</p>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Full Description</h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 text-gray-700 leading-relaxed whitespace-pre-wrap">
                {item.description || 'No description provided by the reporter.'}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
              {item.status !== ItemStatus.RESOLVED && (
                <Button
                  onClick={handleResolve}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                >
                  Mark as Resolved
                </Button>
              )}
              <Button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 mr-2" />
                Add Comment
              </Button>
              <Button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export { ItemReport };