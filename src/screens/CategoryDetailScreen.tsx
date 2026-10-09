import React from 'react';
import { ServiceCategory, Professional } from '../types';
import { AppIcon } from '../components/AppIcon';
import { ProfessionalCard } from '../components/ProfessionalCard';

interface CategoryDetailScreenProps {
  category: ServiceCategory;
  professionals: Professional[];
  savedProIds: string[];
  onBack: () => void;
  onBookService: (category: ServiceCategory, serviceId: string) => void;
  onSelectPro: (pro: Professional) => void;
  onBookPro: (pro: Professional) => void;
  onToggleFavorite: (proId: string) => void;
}

export const CategoryDetailScreen: React.FC<CategoryDetailScreenProps> = ({
  category,
  professionals,
  savedProIds,
  onBack,
  onBookService,
  onSelectPro,
  onBookPro,
  onToggleFavorite,
}) => {
  const categoryPros = professionals.filter((p) => p.catId === category.id);

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-6 bg-[#FAFAFA]">
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-[#EFEFEF] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 -ml-1 rounded-full text-[#111111] hover:bg-[#F5F5F5] active:scale-95 transition-all"
            aria-label="Back"
          >
            <AppIcon name="arrow-left" size={22} />
          </button>
          <div>
            <h1 className="text-[17px] font-bold text-[#111111] leading-tight">
              {category.name} Services
            </h1>
            <p className="text-[12px] text-[#6B6B6B] leading-tight">
              From ₹{category.startingPrice} onwards
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-[#F5F5F5] text-[#111111]">
          <AppIcon name={category.icon} size={22} />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Banner */}
        <div className="p-4 rounded-2xl bg-white border border-[#E5E5E5] space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E7A34] bg-[#E9F6EC] px-2 py-0.5 rounded-full inline-block">
            STANDARD SERVICE RATES
          </span>
          <h2 className="text-[16px] font-bold text-[#111111]">{category.tagline}</h2>
          <p className="text-[12.5px] text-[#6B6B6B] leading-relaxed">
            All services include verified tools, safety gear, cleanup after work, and a 30-day rework guarantee.
          </p>
        </div>

        {/* Services List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-bold text-[#111111]">Select a Service Package</h3>
            <span className="text-[12px] text-[#888888]">{category.services.length} options</span>
          </div>

          <div className="space-y-2.5">
            {category.services.map((svc) => (
              <div
                key={svc.id}
                className="bg-white border border-[#E5E5E5] rounded-2xl p-4 flex flex-col justify-between hover:border-[#111111]/30 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[14.5px] font-bold text-[#111111]">{svc.name}</h4>
                    <p className="text-[12px] text-[#6B6B6B] mt-0.5 leading-relaxed">
                      {svc.desc}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2 text-[11.5px] font-medium text-[#888888]">
                      <AppIcon name="clock" size={13} />
                      <span>Avg duration: {svc.duration}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[15px] font-extrabold text-[#111111]">
                      ₹{svc.price}
                    </div>
                    <span className="text-[10.5px] text-[#888888]">Base rate</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-[#F5F5F5] flex justify-end">
                  <button
                    onClick={() => onBookService(category, svc.id)}
                    className="h-9 px-4 rounded-xl bg-[#111111] text-white text-[12.5px] font-bold hover:bg-black active:scale-95 transition-all"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned Professionals */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-bold text-[#111111]">Available {category.name}s</h3>
            <span className="text-[12px] text-[#888888]">{categoryPros.length} nearby</span>
          </div>

          <div className="space-y-3">
            {categoryPros.map((pro) => (
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
        </div>
      </div>
    </div>
  );
};
