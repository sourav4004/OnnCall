import React, { useState } from 'react';
import { ServiceCategory, Professional } from '../types';
import { AppIcon } from '../components/AppIcon';
import { ProfessionalCard } from '../components/ProfessionalCard';

interface MarketplaceTabProps {
  categories: ServiceCategory[];
  professionals: Professional[];
  savedProIds: string[];
  initialCategory?: string;
  onSelectCategory: (cat: ServiceCategory) => void;
  onSelectPro: (pro: Professional) => void;
  onBookPro: (pro: Professional) => void;
  onToggleFavorite: (proId: string) => void;
}

export const MarketplaceTab: React.FC<MarketplaceTabProps> = ({
  categories,
  professionals,
  savedProIds,
  initialCategory = 'all',
  onSelectCategory,
  onSelectPro,
  onBookPro,
  onToggleFavorite,
}) => {
  const [selectedCatId, setSelectedCatId] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'jobs' | 'price'>('recommended');
  const [onlyAvailableToday, setOnlyAvailableToday] = useState<boolean>(false);

  // Filter professionals
  const filteredPros = professionals
    .filter((pro) => {
      // Category filter
      if (selectedCatId !== 'all' && pro.catId !== selectedCatId) {
        return false;
      }
      // Available today
      if (onlyAvailableToday && !pro.isAvailableToday) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = pro.name.toLowerCase().includes(q);
        const matchesRole = pro.role.toLowerCase().includes(q);
        const matchesSkills = pro.skills.some((s) => s.toLowerCase().includes(q));
        const matchesLocality = pro.locality.toLowerCase().includes(q);
        const matchesCategory = categories
          .find((c) => c.id === pro.catId)
          ?.name.toLowerCase()
          .includes(q);
        return matchesName || matchesRole || matchesSkills || matchesLocality || matchesCategory;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'jobs') return b.completedJobs - a.completedJobs;
      if (sortBy === 'price') return a.hourlyRate - b.hourlyRate;
      return a.distanceKm - b.distanceKm; // recommended
    });

  const activeCategoryObj = categories.find((c) => c.id === selectedCatId);

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-6 bg-[#FAFAFA]">
      {/* Sticky Header with Search */}
      <div className="sticky top-0 z-20 bg-white border-b border-[#EFEFEF] px-4 pt-3 pb-3 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[18px] font-bold text-[#111111] tracking-tight">Marketplace</h1>
            <p className="text-[12px] text-[#6B6B6B]">Find & hire verified service providers</p>
          </div>
          <button
            onClick={() => setOnlyAvailableToday(!onlyAvailableToday)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11.5px] font-semibold border transition-all ${
              onlyAvailableToday
                ? 'bg-[#E9F6EC] text-[#1E7A34] border-[#1E7A34]'
                : 'bg-white text-[#6B6B6B] border-[#E5E5E5]'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                onlyAvailableToday ? 'bg-[#1E7A34]' : 'bg-[#999999]'
              }`}
            />
            Available Today
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <AppIcon
            name="search"
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888888]"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search painter, plumber, woodwork, AC..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#F5F5F5] border border-[#E5E5E5] text-[14px] text-[#111111] placeholder:text-[#888888] focus:outline-hidden focus:border-[#111111] focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#111111]"
            >
              <AppIcon name="close" size={16} />
            </button>
          )}
        </div>

        {/* Category Horizontal Filter Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pt-0.5">
          <button
            onClick={() => setSelectedCatId('all')}
            className={`shrink-0 px-3.5 py-1.5 rounded-xl text-[12px] font-bold transition-all ${
              selectedCatId === 'all'
                ? 'bg-[#111111] text-white shadow-xs'
                : 'bg-[#F5F5F5] text-[#6B6B6B] border border-[#E5E5E5] hover:text-[#111111]'
            }`}
          >
            All Services
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCatId(c.id)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all ${
                selectedCatId === c.id
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'bg-white text-[#6B6B6B] border border-[#E5E5E5] hover:text-[#111111]'
              }`}
            >
              <AppIcon name={c.icon} size={14} />
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Active Category Header Banner */}
        {activeCategoryObj && (
          <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#F5F5F5] border border-[#EFEFEF] text-[#111111]">
                <AppIcon name={activeCategoryObj.icon} size={24} />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-[#111111]">{activeCategoryObj.name}</h3>
                <p className="text-[12px] text-[#6B6B6B]">{activeCategoryObj.tagline}</p>
              </div>
            </div>
            <button
              onClick={() => onSelectCategory(activeCategoryObj)}
              className="text-[12px] font-bold text-[#111111] px-3 py-1.5 rounded-xl border border-[#E5E5E5] hover:bg-[#F5F5F5] transition-colors shrink-0"
            >
              View Packages
            </button>
          </div>
        )}

        {/* Sort Controls & Count */}
        <div className="flex items-center justify-between">
          <span className="text-[12.5px] font-semibold text-[#888888]">
            {filteredPros.length} professionals found
          </span>

          <div className="flex items-center gap-1 text-[12px] text-[#6B6B6B]">
            <span className="font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-bold text-[#111111] focus:outline-hidden cursor-pointer"
            >
              <option value="recommended">Distance (Nearest)</option>
              <option value="rating">Top Rated (4.8+)</option>
              <option value="jobs">Most Experienced</option>
              <option value="price">Starting Price (Low to High)</option>
            </select>
          </div>
        </div>

        {/* Professionals List */}
        {filteredPros.length > 0 ? (
          <div className="space-y-3">
            {filteredPros.map((pro) => (
              <ProfessionalCard
                key={pro.id}
                pro={pro}
                onSelect={onSelectPro}
                onBookNow={onBookPro}
                isFavorite={savedProIds.includes(pro.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4 bg-white rounded-2xl border border-[#E5E5E5]">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#F5F5F5] text-[#888888] mx-auto mb-3">
              <AppIcon name="search" size={24} />
            </div>
            <h4 className="text-[15px] font-bold text-[#111111]">No professionals matched</h4>
            <p className="text-[12.5px] text-[#6B6B6B] max-w-xs mx-auto mt-1">
              Try adjusting your search keywords, clear category filter, or turn off "Available Today".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCatId('all');
                setOnlyAvailableToday(false);
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-[#111111] text-white text-[12.5px] font-bold hover:bg-black transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
