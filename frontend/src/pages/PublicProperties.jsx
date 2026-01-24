import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  Building2, 
  Search, 
  Filter, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  ArrowRight,
  Home,
  Tag,
  Share2,
  Heart
} from 'lucide-react';
import StatusBadge from '../components/shared/StatusBadge';
import { CardSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/shared/EmptyState';

const PublicProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/properties/listings');
      setProperties(response.data.data || []);
    } catch (err) {
      console.error("Failed to load public listings:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || p.type === filterType;
    return matchesSearch && matchesType;
  });

  const propertyTypes = [
    'ALL', 'APARTMENT', 'ONE_BEDROOM', 'TWO_BEDROOM', 'THREE_BEDROOM', 'MAISONETTE', 'VILLA'
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-100 pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-4">Discover Your Next Haven.</h1>
            <p className="text-gray-500 font-medium text-lg">Browse curated listings from top agencies across the network.</p>
          </div>

          <div className="bg-white rounded-[2.5rem] p-4 shadow-2xl border border-gray-100 max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search by neighborhood, city, or property name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-6 py-5 bg-gray-50 rounded-[1.5rem] text-sm border-none focus:ring-2 focus:ring-primary/20 font-bold"
              />
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="flex-1 md:w-48 px-6 py-5 bg-gray-50 rounded-[1.5rem] text-sm border-none focus:ring-2 focus:ring-primary/20 font-bold appearance-none text-gray-600"
              >
                {propertyTypes.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
              </select>
              <button className="bg-gray-900 text-white px-8 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="max-w-7xl mx-auto px-6 mt-16">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            {loading ? 'Searching...' : `${filteredProperties.length} Properties Found`}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest hidden md:block">Sort By:</span>
            <select className="bg-transparent border-none text-sm font-black text-gray-900 focus:ring-0 cursor-pointer">
              <option>Newest First</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : filteredProperties.length === 0 ? (
          <EmptyState 
            icon={Home}
            title="No Results Found"
            description="We couldn't find any properties matching your criteria. Try broadening your search or checking back later."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProperties.map((property) => (
              <div key={property.id} className="bg-white rounded-[3rem] overflow-hidden shadow-soft border border-gray-100 hover:shadow-2xl transition-all group flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={`https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=800`} 
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-6 left-6 flex flex-col gap-2">
                    <span className="px-4 py-2 bg-white/90 backdrop-blur text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                      {property.type?.replace('_', ' ')}
                    </span>
                    <StatusBadge status="AVAILABLE" className="shadow-lg" />
                  </div>
                  <button className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur rounded-2xl shadow-lg hover:bg-red-50 hover:text-red-500 transition-all">
                    <Heart size={18} />
                  </button>
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-black text-gray-900 tracking-tight line-clamp-1">{property.title}</h3>
                    <p className="text-2xl font-black text-primary tracking-tighter">
                      ${property.rentAmount?.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-400 mb-6">
                    <MapPin size={14} />
                    <span className="text-sm font-medium">{property.address}, {property.city}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 py-6 border-y border-gray-50 mb-6">
                    <div className="flex flex-col items-center gap-1">
                      <Bed size={16} className="text-gray-400" />
                      <span className="text-[10px] font-black uppercase text-gray-900">{property.bedrooms || 0} Beds</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 border-x border-gray-50">
                      <Bath size={16} className="text-gray-400" />
                      <span className="text-[10px] font-black uppercase text-gray-900">{property.bathrooms || 0} Baths</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Maximize2 size={16} className="text-gray-400" />
                      <span className="text-[10px] font-black uppercase text-gray-900">{property.sizeSqFt || 1200} sqft</span>
                    </div>
                  </div>

                  <div className="mt-auto flex gap-4">
                    <button className="flex-1 bg-gray-900 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2">
                      View Details
                      <ArrowRight size={14} strokeWidth={3} />
                    </button>
                    <button className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-primary transition-all">
                      <Share2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicProperties;
