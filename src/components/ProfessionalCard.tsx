import React from 'react';
import { Professional } from '../types';
import { AppIcon } from './AppIcon';

interface ProfessionalCardProps {
  pro: Professional;
  onSelect: (pro: Professional) => void;
  onBookNow: (pro: Professional) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (proId: string) => void;
}

export const ProfessionalCard: React.FC<ProfessionalCardProps> = ({
  pro,
  onSelect,
  onBookNow,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2);
  };

  return (
    <div
      onClick={() => onSelect(pro)}
      className="group relative bg-white border border-[#E5E5E5] rounded-2xl p-4 transition-all duration-150 hover:border-[#111111]/30 hover:shadow-sm cursor-pointer"
    >
      <div className="flex items-start gap-3.5">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#F5F5F5] border border-[#E5E5E5] text-[16px] font-bold text-[#111111]">
            {getInitials(pro.name)}
          </div>
          {pro.isVerified && (
            <div
              title="Verified Professional"
              className="absolute -bottom-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-[#1E7A34] text-white ring-2 ring-white shadow-xs"
            >
              <AppIcon name="check" size={12} />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <h4 className="text-[15px] font-bold text-[#111111] truncate">{pro.name}</h4>
              {pro.isVerified && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-[#E9F6EC] text-[#1E7A34] border border-[#1E7A34]/20 shrink-0">
                  Verified
                </span>
              )}
            </div>
            {onToggleFavorite && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(pro.id);
                }}
                className="flex items-center justify-center w-8 h-8 -mr-1.5 -mt-1 text-[#888888] hover:text-[#C23B3B] transition-colors"
                aria-label="Save to favorites"
              >
                <AppIcon
                  name="heart"
                  size={18}
                  className={isFavorite ? 'fill-[#C23B3B] text-[#C23B3B]' : ''}
                />
              </button>
            )}
          </div>

          <p className="text-[12.5px] font-medium text-[#6B6B6B] truncate -mt-0.5">{pro.role}</p>

          {/* Metadata */}
          <div className="flex items-center gap-2 mt-1.5 text-[12px] text-[#6B6B6B]">
            <span className="inline-flex items-center gap-1 font-bold text-[#111111]">
              <AppIcon name="star" size={13} className="fill-[#EAB308] text-[#EAB308]" />
              {pro.rating.toFixed(1)}
            </span>
            <span className="text-[#999999]">·</span>
            <span>{pro.completedJobs} jobs</span>
            <span className="text-[#999999]">·</span>
            <span>{pro.distanceKm} km</span>
          </div>

          {/* Availability & Starting Price */}
          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[#F5F5F5]">
            <div className="flex items-center gap-1.5">
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  pro.isAvailableToday ? 'bg-[#1E7A34]' : 'bg-[#999999]'
                }`}
              />
              <span
                className={`text-[11.5px] font-medium ${
                  pro.isAvailableToday ? 'text-[#1E7A34]' : 'text-[#888888]'
                }`}
              >
                {pro.isAvailableToday ? 'Available today' : 'Next day'}
              </span>
            </div>

            <div className="text-[13px] font-bold text-[#111111]">
              From ₹{pro.hourlyRate}
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#F5F5F5]">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(pro);
          }}
          className="flex items-center justify-center h-9 px-3 rounded-xl border border-[#E5E5E5] bg-white text-[12.5px] font-semibold text-[#111111] hover:bg-[#F5F5F5] active:scale-98 transition-all"
        >
          View Profile
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onBookNow(pro);
          }}
          className="flex items-center justify-center h-9 px-3 rounded-xl bg-[#111111] text-[12.5px] font-semibold text-white hover:bg-black active:scale-98 transition-all"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};
