import React, { useState } from 'react';
import { Booking } from '../types';
import { AppIcon } from '../components/AppIcon';
import { BookingCard } from '../components/BookingCard';

interface BookingsTabProps {
  bookings: Booking[];
  onSelectBooking: (booking: Booking) => void;
  onExploreServices: () => void;
  onCallPro?: (proName: string) => void;
}

export const BookingsTab: React.FC<BookingsTabProps> = ({
  bookings,
  onSelectBooking,
  onExploreServices,
  onCallPro,
}) => {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'upcoming') {
      return b.status === 'confirmed' || b.status === 'in_progress';
    }
    if (filter === 'completed') {
      return b.status === 'completed';
    }
    if (filter === 'cancelled') {
      return b.status === 'cancelled';
    }
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-6 bg-[#FAFAFA]">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-[#EFEFEF] px-4 pt-4 pb-3 space-y-3">
        <div>
          <h1 className="text-[18px] font-bold text-[#111111] tracking-tight">My Bookings</h1>
          <p className="text-[12px] text-[#6B6B6B]">Track ongoing visits and previous services</p>
        </div>

        {/* Status Filter Tabs */}
        <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-[#F5F5F5] border border-[#E5E5E5]">
          {[
            { id: 'all', label: 'All' },
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'completed', label: 'Past' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`py-1.5 rounded-lg text-[12px] font-bold transition-all ${
                filter === tab.id
                  ? 'bg-white text-[#111111] shadow-xs'
                  : 'text-[#6B6B6B] hover:text-[#111111]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onClick={onSelectBooking}
              onCallPro={onCallPro}
            />
          ))
        ) : (
          <div className="text-center py-16 px-4 bg-white rounded-2xl border border-[#E5E5E5]">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#F5F5F5] text-[#888888] mx-auto mb-3">
              <AppIcon name="calendar" size={26} />
            </div>
            <h3 className="text-[16px] font-bold text-[#111111]">No bookings found</h3>
            <p className="text-[13px] text-[#6B6B6B] max-w-xs mx-auto mt-1 leading-relaxed">
              {filter === 'upcoming'
                ? 'You do not have any upcoming appointments scheduled right now.'
                : 'No bookings match this category.'}
            </p>
            <button
              onClick={onExploreServices}
              className="mt-4 px-5 py-2.5 rounded-xl bg-[#111111] text-white text-[13px] font-bold hover:bg-black active:scale-95 transition-all"
            >
              Book a Service
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
