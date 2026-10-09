import React, { useState } from 'react';
import { ServiceCategory, Professional, Booking, TabType, UserSession } from '../types';
import { AppIcon } from '../components/AppIcon';
import { ProfessionalCard } from '../components/ProfessionalCard';
import { BookingCard } from '../components/BookingCard';

interface HomeTabProps {
  categories: ServiceCategory[];
  professionals: Professional[];
  bookings: Booking[];
  savedProIds: string[];
  currentLocationName: string;
  userSession?: UserSession | null;
  onSelectCategory: (cat: ServiceCategory) => void;
  onSelectPro: (pro: Professional) => void;
  onBookPro: (pro: Professional) => void;
  onSelectBooking: (booking: Booking) => void;
  onBookPackage: (category: ServiceCategory, serviceId: string) => void;
  onToggleFavorite: (proId: string) => void;
  onOpenNotifications: () => void;
  onOpenLocationPicker: () => void;
  onNavigateTab: (tab: TabType) => void;
  onQuickEmergency: () => void;
  onSearchClick: () => void;
  onOpenAuth?: () => void;
  onSwitchToProvider?: () => void;
  unreadNotifsCount: number;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  categories,
  professionals,
  bookings,
  savedProIds,
  currentLocationName,
  userSession,
  onSelectCategory,
  onSelectPro,
  onBookPro,
  onSelectBooking,
  onBookPackage,
  onToggleFavorite,
  onOpenNotifications,
  onOpenLocationPicker,
  onNavigateTab,
  onQuickEmergency,
  onSearchClick,
  onOpenAuth,
  onSwitchToProvider,
  unreadNotifsCount,
}) => {
  const activeBooking = bookings.find(
    (b) => b.status === 'confirmed' || b.status === 'in_progress'
  );
  const [selectedQuickFilter, setSelectedQuickFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Filter professionals with active category & quick filters
  const filteredPros = professionals.filter((p) => {
    if (categoryFilter !== 'all' && p.catId !== categoryFilter) return false;
    if (selectedQuickFilter === 'available') return p.isAvailableToday;
    if (selectedQuickFilter === 'top_rated') return p.rating >= 4.8;
    if (selectedQuickFilter === 'nearby') return p.distanceKm <= 1.5;
    return true;
  });

  // Helper to find category by id
  const getCategory = (id: string) => categories.find((c) => c.id === id) || categories[0];

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-10 bg-[#FAFAFA]">
      {/* 1. TOP HEADER & BRAND BAR */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#EFEFEF] px-4 pt-3 pb-3">
        <div className="flex items-center justify-between gap-2">
          {/* Brand Identity & Location */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#111111] text-white flex items-center justify-center font-black text-[15px] shrink-0 shadow-xs">
              O
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[15px] font-black tracking-tight text-[#111111]">
                  OnnCall
                </span>
                <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded-sm bg-[#E9F6EC] text-[#1E7A34] border border-[#1E7A34]/20">
                  Verified
                </span>
              </div>
              <button
                onClick={onOpenLocationPicker}
                className="flex items-center gap-1 text-left group mt-0.5"
              >
                <div className="text-[#1E7A34] shrink-0">
                  <AppIcon name="pin" size={11} />
                </div>
                <span className="text-[12px] font-semibold text-[#555555] group-hover:text-[#111111] truncate max-w-[150px]">
                  {currentLocationName}
                </span>
                <AppIcon
                  name="chevron-down"
                  size={12}
                  className="text-[#888888] group-hover:text-[#111111] transition-transform shrink-0"
                />
              </button>
            </div>
          </div>

          {/* Quick Actions: Notifications & Account Login */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={onOpenNotifications}
              className="relative flex items-center justify-center w-9 h-9 rounded-full bg-[#F5F5F5] hover:bg-[#EBEBEB] active:scale-95 text-[#111111] transition-all"
              aria-label="Notifications"
            >
              <AppIcon name="bell" size={17} />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C23B3B] ring-2 ring-white" />
              )}
            </button>

            {userSession ? (
              <button
                onClick={() => onNavigateTab('profile')}
                className="relative flex items-center justify-center w-9 h-9 rounded-full bg-[#111111] text-white text-[12.5px] font-extrabold active:scale-95 transition-all shadow-xs"
                aria-label="User Account"
                title={`${userSession.fullName} (${userSession.role})`}
              >
                {userSession.avatarInitials}
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#1E7A34] ring-2 ring-white" />
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#111111] text-white text-[12px] font-bold hover:bg-black active:scale-95 transition-all shadow-xs"
              >
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="mt-3">
          <button
            onClick={onSearchClick}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#F5F5F5] border border-[#E5E5E5] text-[#777777] text-[13.5px] font-medium hover:bg-[#EDEDED] transition-colors text-left group"
          >
            <div className="flex items-center gap-2.5 truncate">
              <AppIcon name="search" size={17} className="text-[#555555] shrink-0" />
              <span className="truncate">Search painter, plumber, carpenter, AC...</span>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white border border-[#E0E0E0] text-[#111111] shadow-2xs shrink-0">
              Find Pro
            </span>
          </button>
        </div>

        {/* Quick Search Trade Tags */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pt-2 pb-0.5">
          {[
            { label: '🎨 Painter', catId: 'painter' },
            { label: '💧 Plumber', catId: 'plumber' },
            { label: '🔨 Carpenter', catId: 'carpenter' },
            { label: '⚡ Electrician', catId: 'electrician' },
            { label: '❄️ AC Repair', catId: 'ac' },
          ].map((tag) => (
            <button
              key={tag.catId}
              onClick={() => {
                const cat = categories.find((c) => c.id === tag.catId);
                if (cat) onSelectCategory(cat);
              }}
              className="px-2.5 py-1 rounded-lg bg-white border border-[#E5E5E5] text-[11.5px] font-bold text-[#333333] hover:border-[#111111] hover:text-[#111111] whitespace-nowrap active:scale-95 transition-all"
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* 2. PROMINENT ACTIVE ORDER STATUS (IF ACTIVE) */}
        {activeBooking && (
          <div className="bg-white border-2 border-[#1E7A34]/30 rounded-2xl p-3.5 shadow-sm animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1E7A34] animate-pulse" />
                <span className="text-[13px] font-extrabold text-[#111111]">
                  Active Order in Progress
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E9F6EC] text-[#1E7A34] border border-[#1E7A34]/25">
                  Confirmed
                </span>
              </div>
              <button
                onClick={() => onSelectBooking(activeBooking)}
                className="text-[12px] font-extrabold text-[#1E7A34] hover:underline flex items-center gap-0.5"
              >
                Track Live →
              </button>
            </div>
            <BookingCard booking={activeBooking} onClick={onSelectBooking} />
          </div>
        )}

        {/* 3. HERO SHOWCASE: DIRECT ON-DEMAND BOOKING */}
        <div className="relative overflow-hidden rounded-2xl bg-[#111111] text-white p-5 shadow-md">
          {/* Subtle gold accent pill */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FEF9C3]/20 border border-[#FEF9C3]/40 mb-2.5">
            <AppIcon name="star" size={11} className="fill-[#EAB308] text-[#EAB308]" />
            <span className="text-[11px] font-bold text-[#FEF08A] tracking-tight">
              4.9/5 Rating · 25,000+ Verified Homes
            </span>
          </div>

          <h1 className="text-[19px] font-black tracking-tight leading-snug">
            Trusted Painters, Plumbers & Carpenters at your doorstep
          </h1>
          <p className="text-[12.5px] text-[#D4D4D4] mt-1.5 leading-relaxed max-w-[90%]">
            Upfront standard rate cards, punctual arrival & background-verified local experts.
          </p>

          {/* Quick Category Jump Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              onClick={() => {
                const c = getCategory('painter');
                onSelectCategory(c);
              }}
              className="flex items-center justify-between px-3 py-2 rounded-xl bg-white text-[#111111] text-[12px] font-bold hover:bg-[#F5F5F5] active:scale-95 transition-all shadow-xs"
            >
              <span>🎨 Book Painter</span>
              <AppIcon name="chevron-right" size={13} className="text-[#888888]" />
            </button>
            <button
              onClick={() => {
                const c = getCategory('plumber');
                onSelectCategory(c);
              }}
              className="flex items-center justify-between px-3 py-2 rounded-xl bg-white text-[#111111] text-[12px] font-bold hover:bg-[#F5F5F5] active:scale-95 transition-all shadow-xs"
            >
              <span>💧 Book Plumber</span>
              <AppIcon name="chevron-right" size={13} className="text-[#888888]" />
            </button>
            <button
              onClick={() => {
                const c = getCategory('carpenter');
                onSelectCategory(c);
              }}
              className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/10 text-white border border-white/15 text-[12px] font-bold hover:bg-white/20 active:scale-95 transition-all"
            >
              <span>🔨 Book Carpenter</span>
              <AppIcon name="chevron-right" size={13} className="text-white/70" />
            </button>
            <button
              onClick={onQuickEmergency}
              className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#C23B3B]/20 text-[#FFA4A4] border border-[#C23B3B]/40 text-[12px] font-bold hover:bg-[#C23B3B]/30 active:scale-95 transition-all"
            >
              <span className="flex items-center gap-1">
                <AppIcon name="phone" size={12} className="text-[#FF6B6B]" />
                Emergency SOS
              </span>
              <AppIcon name="chevron-right" size={13} />
            </button>
          </div>

          <div className="absolute -right-4 -bottom-4 opacity-10 text-white pointer-events-none">
            <AppIcon name="wrench" size={130} />
          </div>
        </div>

        {/* 4. PRIMARY SERVICE CATEGORIES GRID */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-[16px] font-bold text-[#111111]">Service Categories</h2>
              <p className="text-[12px] text-[#6B6B6B]">Select a category to view instant fixed packages</p>
            </div>
            <button
              onClick={() => onNavigateTab('marketplace')}
              className="text-[12.5px] font-semibold text-[#111111] hover:underline"
            >
              See All →
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat)}
                className="group flex flex-col items-center p-2.5 rounded-2xl bg-white border border-[#E5E5E5] hover:border-[#111111] active:scale-95 transition-all text-center shadow-2xs"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#F5F5F5] border border-[#EFEFEF] text-[#111111] group-hover:bg-[#111111] group-hover:text-white transition-colors mb-1.5">
                  <AppIcon name={cat.icon} size={22} />
                </div>
                <span className="text-[12px] font-bold text-[#111111] leading-tight line-clamp-1">
                  {cat.name}
                </span>
                <span className="text-[10px] text-[#888888] font-semibold mt-0.5">
                  ₹{cat.startingPrice}+
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 5. POPULAR PACKAGES (END-TO-END ONE-TAP INSTANT BOOKING) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-[16px] font-bold text-[#111111]">Featured Packages</h2>
              <p className="text-[12px] text-[#6B6B6B]">Standard prices with verified materials & warranty</p>
            </div>
            <span className="text-[11.5px] font-bold text-[#1E7A34] bg-[#E9F6EC] border border-[#1E7A34]/20 px-2 py-0.5 rounded-md">
              Fixed Rates
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
            {/* Package 1: Full Room Painting */}
            <div
              onClick={() => onBookPackage(getCategory('painter'), 'p-room')}
              className="shrink-0 w-64 bg-white border border-[#E5E5E5] rounded-2xl p-4 hover:border-[#111111] transition-all cursor-pointer shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#F5F5F5] text-[#111111] uppercase tracking-wider">
                    PAINTER
                  </span>
                  <span className="text-[15px] font-black text-[#111111]">₹1,499</span>
                </div>
                <h3 className="text-[14.5px] font-bold text-[#111111] mt-2">
                  Full Room Royal Painting
                </h3>
                <p className="text-[12px] text-[#6B6B6B] mt-1 line-clamp-2 leading-relaxed">
                  Primer + 2 coats royal emulsion with wall scraping, crack filling & drop sheets.
                </p>
                <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-[#888888]">
                  <AppIcon name="clock" size={12} />
                  <span>Avg duration: 1 day</span>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onBookPackage(getCategory('painter'), 'p-room');
                }}
                className="w-full mt-3 h-9 rounded-xl bg-[#111111] text-white text-[12px] font-bold flex items-center justify-center hover:bg-black active:scale-95 transition-all shadow-xs"
              >
                Book Package Now
              </button>
            </div>

            {/* Package 2: Bed Frame & Furniture Repair */}
            <div
              onClick={() => onBookPackage(getCategory('carpenter'), 'c-repair')}
              className="shrink-0 w-64 bg-white border border-[#E5E5E5] rounded-2xl p-4 hover:border-[#111111] transition-all cursor-pointer shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#F5F5F5] text-[#111111] uppercase tracking-wider">
                    CARPENTER
                  </span>
                  <span className="text-[15px] font-black text-[#111111]">₹349</span>
                </div>
                <h3 className="text-[14.5px] font-bold text-[#111111] mt-2">
                  Furniture & Bed Repair
                </h3>
                <p className="text-[12px] text-[#6B6B6B] mt-1 line-clamp-2 leading-relaxed">
                  Fix squeaks, wobbly legs, hydraulic bed lift repair and drawer alignments.
                </p>
                <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-[#888888]">
                  <AppIcon name="clock" size={12} />
                  <span>Avg duration: 1 hr</span>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onBookPackage(getCategory('carpenter'), 'c-repair');
                }}
                className="w-full mt-3 h-9 rounded-xl bg-[#111111] text-white text-[12px] font-bold flex items-center justify-center hover:bg-black active:scale-95 transition-all shadow-xs"
              >
                Book Package Now
              </button>
            </div>

            {/* Package 3: Water Leakage Repair */}
            <div
              onClick={() => onBookPackage(getCategory('plumber'), 'pl-leak')}
              className="shrink-0 w-64 bg-white border border-[#E5E5E5] rounded-2xl p-4 hover:border-[#111111] transition-all cursor-pointer shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#F5F5F5] text-[#111111] uppercase tracking-wider">
                    PLUMBER
                  </span>
                  <span className="text-[15px] font-black text-[#111111]">₹399</span>
                </div>
                <h3 className="text-[14.5px] font-bold text-[#111111] mt-2">
                  Water Leakage & Pipe Fix
                </h3>
                <p className="text-[12px] text-[#6B6B6B] mt-1 line-clamp-2 leading-relaxed">
                  Locate concealed valve leaks, replace washers & seal CPVC pipe joints.
                </p>
                <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-[#888888]">
                  <AppIcon name="clock" size={12} />
                  <span>Avg duration: 1 hr</span>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onBookPackage(getCategory('plumber'), 'pl-leak');
                }}
                className="w-full mt-3 h-9 rounded-xl bg-[#111111] text-white text-[12px] font-bold flex items-center justify-center hover:bg-black active:scale-95 transition-all shadow-xs"
              >
                Book Package Now
              </button>
            </div>

            {/* Package 4: AC Jet Servicing */}
            <div
              onClick={() => onBookPackage(getCategory('ac'), 'ac-foam')}
              className="shrink-0 w-64 bg-white border border-[#E5E5E5] rounded-2xl p-4 hover:border-[#111111] transition-all cursor-pointer shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#F5F5F5] text-[#111111] uppercase tracking-wider">
                    AC REPAIR
                  </span>
                  <span className="text-[15px] font-black text-[#111111]">₹499</span>
                </div>
                <h3 className="text-[14.5px] font-bold text-[#111111] mt-2">
                  Power Jet Foam Servicing
                </h3>
                <p className="text-[12px] text-[#6B6B6B] mt-1 line-clamp-2 leading-relaxed">
                  Deep high-pressure coil wash, dust cleanup & cooling assurance test.
                </p>
                <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-[#888888]">
                  <AppIcon name="clock" size={12} />
                  <span>Avg duration: 1 hr</span>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onBookPackage(getCategory('ac'), 'ac-foam');
                }}
                className="w-full mt-3 h-9 rounded-xl bg-[#111111] text-white text-[12px] font-bold flex items-center justify-center hover:bg-black active:scale-95 transition-all shadow-xs"
              >
                Book Package Now
              </button>
            </div>

            {/* Package 5: Switchboard & Wiring Fix */}
            <div
              onClick={() => onBookPackage(getCategory('electrician'), 'e-switch')}
              className="shrink-0 w-64 bg-white border border-[#E5E5E5] rounded-2xl p-4 hover:border-[#111111] transition-all cursor-pointer shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#F5F5F5] text-[#111111] uppercase tracking-wider">
                    ELECTRICIAN
                  </span>
                  <span className="text-[15px] font-black text-[#111111]">₹199</span>
                </div>
                <h3 className="text-[14.5px] font-bold text-[#111111] mt-2">
                  Switchboard & Socket Fix
                </h3>
                <p className="text-[12px] text-[#6B6B6B] mt-1 line-clamp-2 leading-relaxed">
                  Replace burnt switch plates, modular sockets, dimmers & earthing testing.
                </p>
                <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-[#888888]">
                  <AppIcon name="clock" size={12} />
                  <span>Avg duration: 30 mins</span>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onBookPackage(getCategory('electrician'), 'e-switch');
                }}
                className="w-full mt-3 h-9 rounded-xl bg-[#111111] text-white text-[12px] font-bold flex items-center justify-center hover:bg-black active:scale-95 transition-all shadow-xs"
              >
                Book Package Now
              </button>
            </div>
          </div>
        </div>

        {/* 6. VERIFIED PROFESSIONALS NEARBY (DIRECT PROFILE & BOOKING) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-[16px] font-bold text-[#111111]">Nearby Verified Experts</h2>
              <p className="text-[12px] text-[#6B6B6B]">Background-checked pros ready to dispatch</p>
            </div>
            <button
              onClick={() => onNavigateTab('marketplace')}
              className="text-[12.5px] font-semibold text-[#111111] hover:underline"
            >
              See all ({professionals.length})
            </button>
          </div>

          {/* Category Filter Chips */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1 mb-2">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1 rounded-xl text-[12px] font-bold whitespace-nowrap transition-all ${
                categoryFilter === 'all'
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'bg-white border border-[#E5E5E5] text-[#6B6B6B] hover:text-[#111111]'
              }`}
            >
              All Trades
            </button>
            {categories.slice(0, 4).map((c) => (
              <button
                key={c.id}
                onClick={() => setCategoryFilter(c.id)}
                className={`flex items-center gap-1 px-3 py-1 rounded-xl text-[12px] font-bold whitespace-nowrap transition-all ${
                  categoryFilter === c.id
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'bg-white border border-[#E5E5E5] text-[#6B6B6B] hover:text-[#111111]'
                }`}
              >
                <AppIcon name={c.icon} size={13} />
                <span>{c.name}s</span>
              </button>
            ))}
          </div>

          {/* Quick Filter Attributes */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1 mb-3">
            {[
              { id: 'all', label: 'All Pros' },
              { id: 'available', label: 'Available Today' },
              { id: 'top_rated', label: 'Rating 4.8+' },
              { id: 'nearby', label: 'Within 1.5 km' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedQuickFilter(f.id)}
                className={`px-2.5 py-1 rounded-lg text-[11.5px] font-semibold whitespace-nowrap transition-all ${
                  selectedQuickFilter === f.id
                    ? 'bg-[#111111] text-white'
                    : 'bg-[#F5F5F5] text-[#6B6B6B] hover:text-[#111111]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Professionals List */}
          <div className="space-y-3">
            {filteredPros.slice(0, 4).map((pro) => (
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

        {/* 7. JOIN AS SERVICE PROVIDER / PARTNER BANNER */}
        {onSwitchToProvider && (
          <div className="rounded-2xl bg-gradient-to-r from-[#1A1A1A] to-[#2A2A2A] text-white p-4.5 border border-[#333333] shadow-xs">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="inline-block text-[10.5px] font-bold px-2 py-0.5 rounded-md bg-[#FEF9C3]/20 text-[#FEF08A] border border-[#FEF9C3]/30 uppercase tracking-wider mb-2">
                  Partner With OnnCall
                </span>
                <h3 className="text-[15px] font-black text-white leading-snug">
                  Are you a skilled Painter, Plumber or Carpenter?
                </h3>
                <p className="text-[12px] text-[#CCCCCC] mt-1 leading-relaxed">
                  Join OnnCall as a verified service partner. Earn steady daily jobs with weekly payouts.
                </p>
              </div>
            </div>

            <button
              onClick={onSwitchToProvider}
              className="mt-3.5 w-full h-10 rounded-xl bg-white text-[#111111] text-[12.5px] font-extrabold flex items-center justify-center gap-1.5 hover:bg-[#F5F5F5] active:scale-95 transition-all shadow-xs"
            >
              <span>Switch to Service Provider Portal</span>
              <AppIcon name="chevron-right" size={14} />
            </button>
          </div>
        )}

        {/* 8. REFINED QUALITY COMMITMENTS (WITHOUT PROMISE SLOGANS) */}
        <div className="p-4 rounded-2xl bg-white border border-[#E5E5E5] space-y-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#E9F6EC] text-[#1E7A34] shrink-0 border border-[#1E7A34]/20">
              <AppIcon name="check" size={16} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-[13px] font-bold text-[#111111]">100% Background Verified</h4>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-[#E9F6EC] text-[#1E7A34]">
                  Verified
                </span>
              </div>
              <p className="text-[11.5px] text-[#6B6B6B]">Aadhaar and police verified technicians.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FEF9C3] text-[#CA8A04] shrink-0 border border-[#EAB308]/30">
              <AppIcon name="shield" size={16} />
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-[#111111]">30-Day Service Warranty</h4>
              <p className="text-[11.5px] text-[#6B6B6B]">Dedicated rework support if you need touch-ups.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#E9F6EC] text-[#1E7A34] shrink-0 border border-[#1E7A34]/20">
              <AppIcon name="clock" size={16} />
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-[#111111]">Transparent Pricing</h4>
              <p className="text-[11.5px] text-[#6B6B6B]">Standard rate cards. Pay after service completion.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
