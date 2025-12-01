import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ItemType, CATEGORIES } from '../types';
import { createItem } from '../services/mockData';
import { Button } from '../components/Button';
import { ChevronLeft, Camera, MapPin, Search, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Report: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: ItemType.LOST,
    category: CATEGORIES[0],
    location: '',
    date: new Date().toISOString().split('T')[0],
    contactName: '',
    image: null as File | null
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const mockImageUrl = imagePreview || `https://picsum.photos/400/300?random=${Math.random()}`;

    await createItem({
      title: formData.title,
      description: formData.description,
      type: formData.type,
      location: formData.location,
      date: formData.date,
      category: formData.category,
      contactName: formData.contactName,
      imageUrl: mockImageUrl,
      reporterId: user ? user.id : 'unknown'
    });

    setLoading(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-32 transition-colors duration-300">
        {/* Header */}
      <div className="sticky top-0 bg-gray-50/80 dark:bg-gray-950/80 backdrop-blur-md z-30 px-6 py-6 flex items-center justify-between transition-colors">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-800 rounded-full shadow-sm hover:shadow-md transition-all text-gray-700 dark:text-gray-200">
          <ChevronLeft size={20} />
        </button>
        <div className="flex flex-col items-center">
             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">New Report</span>
        </div>
        <div className="w-10"></div>
      </div>

      <div className="max-w-xl mx-auto px-6">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">What happened?</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Type Selection - Visual Cards */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: ItemType.LOST }))}
              className={`relative p-6 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center gap-3 group ${
                formData.type === ItemType.LOST 
                  ? 'bg-brand-red text-white border-brand-red shadow-lg shadow-brand-red/30 scale-105 z-10' 
                  : 'bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <div className={`p-3 rounded-full ${formData.type === ItemType.LOST ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-white dark:group-hover:bg-gray-600'}`}>
                <Search size={32} />
              </div>
              <span className="font-bold text-lg">I Lost It</span>
              {formData.type === ItemType.LOST && <div className="absolute top-3 right-3"><CheckCircle2 size={20} /></div>}
            </button>
            
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: ItemType.FOUND }))}
              className={`relative p-6 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center gap-3 group ${
                formData.type === ItemType.FOUND 
                  ? 'bg-brand-green text-white border-brand-green shadow-lg shadow-brand-green/30 scale-105 z-10' 
                  : 'bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <div className={`p-3 rounded-full ${formData.type === ItemType.FOUND ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-white dark:group-hover:bg-gray-600'}`}>
                <MapPin size={32} />
              </div>
              <span className="font-bold text-lg">I Found It</span>
              {formData.type === ItemType.FOUND && <div className="absolute top-3 right-3"><CheckCircle2 size={20} /></div>}
            </button>
          </div>

          {/* Form Fields Card */}
          <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-6 shadow-sm space-y-5 transition-colors">
              
              {/* Image Upload */}
              <div className="w-full">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Photo Evidence</label>
                <div className={`relative h-48 rounded-2xl border-2 border-dashed transition-all overflow-hidden group ${imagePreview ? 'border-brand-blue' : 'border-gray-200 dark:border-gray-700 hover:border-brand-blue/50'}`}>
                    {imagePreview ? (
                        <div className="relative w-full h-full">
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium">Change Photo</div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-2">
                                <Camera size={24} />
                            </div>
                            <span className="text-sm">Tap to upload</span>
                        </div>
                    )}
                    <input 
                        type="file" 
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleImageChange}
                    />
                </div>
              </div>

             <div className="space-y-4">
                <div className="group">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 group-focus-within:text-brand-blue transition-colors">Item Name</label>
                    <input
                        required
                        type="text"
                        value={formData.title}
                        onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g. Blue Hydroflask"
                        className="w-full p-4 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-brand-blue/20 focus:bg-white dark:focus:bg-gray-800 transition-all font-semibold text-gray-800 dark:text-white placeholder:text-gray-300"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                     <div className="group">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 group-focus-within:text-brand-blue transition-colors">Category</label>
                        <select
                            value={formData.category}
                            onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full p-4 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-brand-blue/20 focus:bg-white dark:focus:bg-gray-800 transition-all font-semibold text-gray-800 dark:text-white appearance-none"
                        >
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                     </div>
                     <div className="group">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 group-focus-within:text-brand-blue transition-colors">Date</label>
                        <input
                            required
                            type="date"
                            value={formData.date}
                            onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                            className="w-full p-4 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-brand-blue/20 focus:bg-white dark:focus:bg-gray-800 transition-all font-semibold text-gray-800 dark:text-white"
                        />
                     </div>
                </div>

                <div className="group">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 group-focus-within:text-brand-blue transition-colors">Location</label>
                    <input
                        required
                        type="text"
                        value={formData.location}
                        onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="e.g. Science Complex"
                        className="w-full p-4 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-brand-blue/20 focus:bg-white dark:focus:bg-gray-800 transition-all font-semibold text-gray-800 dark:text-white placeholder:text-gray-300"
                    />
                </div>

                <div className="group">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 group-focus-within:text-brand-blue transition-colors">Contact Name</label>
                    <input
                        required
                        type="text"
                        value={formData.contactName}
                        onChange={e => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                        placeholder="Who should we look for?"
                        className="w-full p-4 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-brand-blue/20 focus:bg-white dark:focus:bg-gray-800 transition-all font-semibold text-gray-800 dark:text-white placeholder:text-gray-300"
                    />
                </div>

                <div className="group">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 group-focus-within:text-brand-blue transition-colors">Description</label>
                    <textarea
                        required
                        rows={3}
                        value={formData.description}
                        onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Add details..."
                        className="w-full p-4 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-brand-blue/20 focus:bg-white dark:focus:bg-gray-800 transition-all font-semibold text-gray-800 dark:text-white placeholder:text-gray-300 resize-none"
                    />
                </div>
             </div>
          </div>

          <div className="pt-2">
            <Button 
                type="submit" 
                fullWidth 
                size="lg"
                isLoading={loading} 
                variant={formData.type === ItemType.LOST ? 'danger' : 'primary'}
                className="shadow-xl"
            >
              Submit Report
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};