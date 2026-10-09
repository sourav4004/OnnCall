import React from 'react';
import { Booking } from '../types';
import { AppIcon } from './AppIcon';

interface BookingCardProps {
  booking: Booking;
  onClick: (booking: Booking) => void;
  onCallPro?: (proName: string) => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onClick,
  onCallPro,
}) => {
  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'in_progress':
        return {
          label: 'In Progress',
          color: 'text-[#1E7A34] bg-[#E9F6EC] border border-[#1E7A34]/25',
        };
      case 'confirmed':
        return {
          label: 'Confirmed',
          color: 'text-[#1E7A34] bg-[#E9F6EC] border border-[#1E7A34]/25',
        };
      case 'completed':
        return {
          label: 'Completed',
          color: 'text-[#555555] bg-[#EFEFEF] border border-[#E0E0E0]',
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          color: 'text-[#C23B3B] bg-[#FBEAEA] border border-[#C23B3B]/25',
        };
    }
  };

  const badge = getStatusBadge(booking.status);

  return (
    <div
      onClick={() => onClick(booking)}
      className="bg-white border border-[#E5E5E5] rounded-2xl p-4 transition-all hover:border-[#111111]/30 hover:shadow-sm cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#888888] tracking-wider uppercase">
              {booking.id}
            </span>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${badge.color}`}
            >
              {badge.label}
            </span>
          </div>
          <h4 className="text-[15px] font-bold text-[#111111] mt-0.5 truncate">
            {booking.serviceName}
          </h4>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[14px] font-extrabold text-[#111111]">
            ₹{booking.price + booking.platformFee}
          </div>
          <span className="text-[11px] text-[#888888] font-medium">All incl.</span>
        </div>
      </div>

      {/* Pro Details */}
      <div className="flex items-center gap-2.5 py-2 px-3 my-2 rounded-xl bg-[#F9F9F9] border border-[#F0F0F0]">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-[#E5E5E5] text-[12px] font-bold text-[#111111]">
          {booking.proName[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-bold text-[#111111] truncate">
            {booking.proName}
          </div>
          <div className="text-[11.5px] text-[#6B6B6B] truncate">
            {booking.proRole}
          </div>
        </div>
        {onCallPro && booking.status !== 'cancelled' && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCallPro(booking.proName);
            }}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-[#E5E5E5] text-[#111111] hover:bg-[#F5F5F5] active:scale-95 transition-all"
            aria-label="Call Professional"
          >
            <AppIcon name="phone" size={14} />
          </button>
        )}
      </div>

      {/* Schedule & Address */}
      <div className="flex flex-col gap-1 text-[12px] text-[#6B6B6B] mt-2">
        <div className="flex items-center gap-1.5">
          <AppIcon name="clock" size={13} className="text-[#888888]" />
          <span className="font-semibold text-[#111111]">{booking.date}</span>
          <span className="text-[#999999]">·</span>
          <span>{booking.timeSlot}</span>
        </div>
        <div className="flex items-center gap-1.5 truncate">
          <AppIcon name="pin" size={13} className="text-[#888888] shrink-0" />
          <span className="truncate">{booking.address.line1}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#F5F5F5]">
        <span className="text-[12px] font-medium text-[#888888]">
          {booking.timelineStep === 5
            ? 'Service completed'
            : booking.timelineStep === 3
            ? 'Professional arrived'
            : booking.timelineStep === 2
            ? 'Professional on the way'
            : 'Scheduled'}
        </span>
        <span className="text-[12.5px] font-semibold text-[#111111] flex items-center gap-1">
          View Details
          <AppIcon name="chevron-right" size={14} />
        </span>
      </div>
    </div>
  );
};
