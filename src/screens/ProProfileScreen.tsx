import React from 'react';
import { Professional, ServiceCategory } from '../types';
import { AppIcon } from '../components/AppIcon';

interface ProProfileScreenProps {
  pro: Professional;
  category?: ServiceCategory;
  isFavorite: boolean;
  onBack: () => void;
  onBookNow: (pro: Professional) => void;
  onMessagePro: (pro: Professional) => void;
  onCallPro: (name: string) => void;
  onToggleFavorite: (proId: string) => void;
}

export const ProProfileScreen: React.FC<ProProfileScreenProps> = ({
  pro,
  category,
  isFavorite,
  onBack,
  onBookNow,
  onMessagePro,
  onCallPro,
  onToggleFavorite,
}) => {
  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-24 bg-[#FAFAFA] relative">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#EFEFEF] px-4 py-3 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 -ml-1 rounded-full text-[#111111] hover:bg-[#F5F5F5] active:scale-95 transition-all"
          aria-label="Back"
        >
          <AppIcon name="arrow-left" size={22} />
        </button>
        <span className="text-[15px] font-bold text-[#111111]">Expert Profile</span>
        <button
          onClick={() => onToggleFavorite(pro.id)}
          className="flex items-center justify-center w-10 h-10 -mr-1 rounded-full text-[#888888] hover:bg-[#F5F5F5] transition-colors"
          aria-label="Save to favorites"
        >
          <AppIcon
            name="heart"
            size={20}
            className={isFavorite ? 'fill-[#C23B3B] text-[#C23B3B]' : ''}
          />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Profile Card */}
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 text-center">
          <div className="relative inline-block mb-3">
            <div className="w-20 h-20 rounded-full bg-[#F5F5F5] border-2 border-[#111111] text-[24px] font-black text-[#111111] flex items-center justify-center mx-auto">
              {pro.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </div>
            {pro.isVerified && (
              <div
                title="Verified Professional"
                className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#1E7A34] text-white flex items-center justify-center ring-2 ring-white shadow-xs"
              >
                <AppIcon name="check" size={14} />
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-1.5">
            <h2 className="text-[19px] font-bold text-[#111111]">{pro.name}</h2>
            {pro.isVerified && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#E9F6EC] text-[#1E7A34] border border-[#1E7A34]/20">
                Verified
              </span>
            )}
          </div>
          <p className="text-[13px] font-medium text-[#6B6B6B] mt-0.5">{pro.role}</p>

          <div className="flex items-center justify-center gap-2 mt-2 text-[12.5px] text-[#6B6B6B]">
            <span className="inline-flex items-center gap-1 font-bold text-[#111111]">
              <AppIcon name="star" size={14} className="fill-[#EAB308] text-[#EAB308]" />
              {pro.rating.toFixed(1)}
            </span>
            <span>({pro.reviewsCount} reviews)</span>
            <span>·</span>
            <span>{pro.locality}</span>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[#F5F5F5]">
            <div className="p-2 rounded-xl bg-[#F9F9F9]">
              <div className="text-[15px] font-extrabold text-[#111111]">
                {pro.experienceYears}+ yrs
              </div>
              <div className="text-[11px] text-[#888888]">Experience</div>
            </div>
            <div className="p-2 rounded-xl bg-[#F9F9F9]">
              <div className="text-[15px] font-extrabold text-[#111111]">
                {pro.completedJobs}
              </div>
              <div className="text-[11px] text-[#888888]">Jobs Done</div>
            </div>
            <div className="p-2 rounded-xl bg-[#F9F9F9]">
              <div className="text-[15px] font-extrabold text-[#111111]">
                {pro.responseTime}
              </div>
              <div className="text-[11px] text-[#888888]">Response</div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4 space-y-2">
          <h3 className="text-[14px] font-bold text-[#111111]">About</h3>
          <p className="text-[13px] text-[#6B6B6B] leading-relaxed">{pro.bio}</p>
        </div>

        {/* Core Skills & Tools */}
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4 space-y-2">
          <h3 className="text-[14px] font-bold text-[#111111]">Specializations & Skills</h3>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {pro.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-[#F5F5F5] text-[#111111] text-[12px] font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Available Packages */}
        {category && (
          <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4 space-y-3">
            <h3 className="text-[14px] font-bold text-[#111111]">Services Provided</h3>
            <div className="divide-y divide-[#F0F0F0]">
              {category.services.map((svc) => (
                <div key={svc.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between">
                  <div>
                    <h4 className="text-[13.5px] font-bold text-[#111111]">{svc.name}</h4>
                    <p className="text-[11.5px] text-[#888888]">{svc.duration}</p>
                  </div>
                  <span className="text-[13.5px] font-bold text-[#111111]">₹{svc.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages & Verification */}
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-[#6B6B6B]">Languages</span>
            <span className="text-[13px] font-bold text-[#111111]">
              {pro.languages.join(', ')}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-[#6B6B6B]">Identity Status</span>
            <span className="text-[13px] font-bold text-[#1E7A34] flex items-center gap-1">
              <AppIcon name="check" size={14} /> Aadhaar & Police Verified
            </span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 z-30 max-w-md mx-auto p-4 bg-white/95 backdrop-blur-md border-t border-[#E5E5E5] flex items-center gap-2.5">
        <button
          onClick={() => onCallPro(pro.name)}
          className="flex items-center justify-center w-12 h-12 rounded-xl border border-[#E5E5E5] bg-white text-[#111111] hover:bg-[#F5F5F5] active:scale-95 transition-all"
          aria-label="Call"
        >
          <AppIcon name="phone" size={20} />
        </button>
        <button
          onClick={() => onMessagePro(pro)}
          className="flex items-center justify-center w-12 h-12 rounded-xl border border-[#E5E5E5] bg-white text-[#111111] hover:bg-[#F5F5F5] active:scale-95 transition-all"
          aria-label="Message"
        >
          <AppIcon name="chat" size={20} />
        </button>
        <button
          onClick={() => onBookNow(pro)}
          className="flex-1 h-12 rounded-xl bg-[#111111] text-white text-[14px] font-bold hover:bg-black active:scale-98 transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
};
