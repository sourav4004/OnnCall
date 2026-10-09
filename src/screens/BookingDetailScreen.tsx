import React, { useState } from 'react';
import { Booking } from '../types';
import { AppIcon } from '../components/AppIcon';

interface BookingDetailScreenProps {
  booking: Booking;
  onBack: () => void;
  onMessagePro: (proId: string, proName: string, proRole: string) => void;
  onCallPro: (name: string) => void;
  onCancelBooking: (bookingId: string) => void;
  onRescheduleBooking: (bookingId: string) => void;
  onSubmitReview: (bookingId: string, rating: number, note: string) => void;
  onToast: (msg: string) => void;
}

export const BookingDetailScreen: React.FC<BookingDetailScreenProps> = ({
  booking,
  onBack,
  onMessagePro,
  onCallPro,
  onCancelBooking,
  onRescheduleBooking,
  onSubmitReview,
  onToast,
}) => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [starRating, setStarRating] = useState(booking.ratingGiven || 5);
  const [reviewNote, setReviewNote] = useState(booking.reviewNote || '');

  const timelineSteps = [
    { title: 'Booking Confirmed', desc: 'Service request registered & verified' },
    { title: 'Professional Assigned', desc: `${booking.proName} assigned for service` },
    { title: 'Technician on the Way', desc: 'Heading towards your location' },
    { title: 'Arrived at Location', desc: 'Safety check & toolbox prep' },
    { title: 'Service in Progress', desc: 'Work underway with quality checklist' },
    { title: 'Service Completed', desc: 'Work finished & verified by customer' },
  ];

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-10 bg-[#FAFAFA]">
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-[#EFEFEF] px-4 py-3 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 -ml-1 rounded-full text-[#111111] hover:bg-[#F5F5F5] active:scale-95 transition-all"
          aria-label="Back"
        >
          <AppIcon name="arrow-left" size={22} />
        </button>
        <span className="text-[15px] font-bold text-[#111111]">Booking Details</span>
        <span className="text-[12px] font-bold text-[#888888] uppercase tracking-wider">
          {booking.id}
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Status Card */}
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4.5">
          <div className="flex items-center justify-between">
            <span
              className={`text-[11.5px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${
                booking.status === 'in_progress'
                  ? 'bg-[#E9F6EC] text-[#1E7A34] border-[#1E7A34]/25'
                  : booking.status === 'confirmed'
                  ? 'bg-[#E9F6EC] text-[#1E7A34] border-[#1E7A34]/25'
                  : booking.status === 'completed'
                  ? 'bg-[#EFEFEF] text-[#555555] border-[#E0E0E0]'
                  : 'bg-[#FBEAEA] text-[#C23B3B] border-[#C23B3B]/25'
              }`}
            >
              {booking.status.replace('_', ' ')}
            </span>
            <span className="text-[12px] text-[#888888] font-medium">
              Booked on {booking.createdAt}
            </span>
          </div>

          <h2 className="text-[18px] font-bold text-[#111111] mt-2.5">
            {booking.serviceName}
          </h2>
          <p className="text-[12.5px] text-[#6B6B6B] mt-0.5">
            Scheduled for {booking.date} · {booking.timeSlot}
          </p>
        </div>

        {/* Assigned Professional */}
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4">
          <h3 className="text-[12px] font-bold text-[#888888] uppercase tracking-wider mb-2.5">
            Assigned Expert
          </h3>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#F5F5F5] border border-[#E5E5E5] text-[16px] font-bold text-[#111111] flex items-center justify-center shrink-0">
              {booking.proName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[15px] font-bold text-[#111111] truncate">{booking.proName}</h4>
              <p className="text-[12.5px] text-[#6B6B6B] truncate">{booking.proRole}</p>
            </div>
            {booking.status !== 'cancelled' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onCallPro(booking.proName)}
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-[#E5E5E5] hover:bg-[#F5F5F5] text-[#111111] transition-all"
                  aria-label="Call"
                >
                  <AppIcon name="phone" size={17} />
                </button>
                <button
                  onClick={() =>
                    onMessagePro(booking.proId, booking.proName, booking.proRole)
                  }
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-[#111111] text-white hover:bg-black transition-all"
                  aria-label="Message"
                >
                  <AppIcon name="chat" size={17} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Live Service Timeline Tracking */}
        {booking.status !== 'cancelled' && (
          <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4">
            <h3 className="text-[13px] font-bold text-[#111111] mb-3">
              Live Service Tracking
            </h3>

            <div className="space-y-4 pl-1">
              {timelineSteps.map((step, idx) => {
                const isCompleted = idx <= booking.timelineStep;
                const isCurrent = idx === booking.timelineStep;
                return (
                  <div key={idx} className="flex gap-3 relative">
                    {/* Line connector */}
                    {idx < timelineSteps.length - 1 && (
                      <div
                        className={`absolute left-[11px] top-5 w-0.5 h-10 ${
                          idx < booking.timelineStep ? 'bg-[#111111]' : 'bg-[#E5E5E5]'
                        }`}
                      />
                    )}

                    {/* Dot */}
                    <div
                      className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                        isCompleted
                          ? 'bg-[#111111] text-white'
                          : 'bg-[#F0F0F0] text-[#888888] border border-[#E0E0E0]'
                      }`}
                    >
                      {isCompleted ? <AppIcon name="check" size={12} /> : idx + 1}
                    </div>

                    {/* Text */}
                    <div className="flex-1 pb-1">
                      <div
                        className={`text-[13.5px] font-bold ${
                          isCurrent
                            ? 'text-[#111111]'
                            : isCompleted
                            ? 'text-[#444444]'
                            : 'text-[#888888]'
                        }`}
                      >
                        {step.title}
                      </div>
                      <div className="text-[11.5px] text-[#888888]">{step.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Address and Bill Details */}
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4 space-y-3">
          <h3 className="text-[13px] font-bold text-[#111111] pb-2 border-b border-[#F0F0F0]">
            Address & Payment
          </h3>

          <div className="flex items-start gap-2.5">
            <AppIcon name="pin" size={16} className="text-[#888888] shrink-0 mt-0.5" />
            <div className="text-[12.5px] text-[#444444]">
              <span className="font-bold text-[#111111] block">{booking.address.label}</span>
              {booking.address.line1}, {booking.address.city} - {booking.address.pincode}
            </div>
          </div>

          <div className="pt-2 border-t border-[#F0F0F0] flex justify-between items-center text-[13px]">
            <span className="text-[#6B6B6B]">Payment Method</span>
            <span className="font-bold uppercase text-[#111111]">
              {booking.paymentMethod}
            </span>
          </div>

          <div className="flex justify-between items-center text-[15px] font-extrabold text-[#111111]">
            <span>Total Paid</span>
            <span>₹{booking.price + booking.platformFee}</span>
          </div>
        </div>

        {/* Action Buttons based on status */}
        <div className="space-y-2 pt-2">
          {booking.status === 'confirmed' && (
            <>
              <button
                onClick={() => onRescheduleBooking(booking.id)}
                className="w-full h-11 rounded-xl border border-[#E5E5E5] bg-white text-[#111111] text-[13.5px] font-bold hover:bg-[#F5F5F5] active:scale-98 transition-all"
              >
                Reschedule Date & Time
              </button>
              <button
                onClick={() => onCancelBooking(booking.id)}
                className="w-full h-11 rounded-xl bg-[#FBEAEA] text-[#C23B3B] text-[13.5px] font-bold hover:bg-[#F7DADA] active:scale-98 transition-all"
              >
                Cancel Booking
              </button>
            </>
          )}

          {booking.status === 'completed' && (
            <>
              <button
                onClick={() => setShowReviewModal(true)}
                className="w-full h-11 rounded-xl bg-[#111111] text-white text-[13.5px] font-bold hover:bg-black active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <AppIcon name="star" size={16} />
                {booking.ratingGiven ? 'Edit Review & Rating' : 'Rate & Review Service'}
              </button>
              <button
                onClick={() => onToast('Invoice downloaded (PDF)')}
                className="w-full h-11 rounded-xl border border-[#E5E5E5] bg-white text-[#111111] text-[13.5px] font-bold hover:bg-[#F5F5F5] transition-all"
              >
                Download Receipt / Bill
              </button>
            </>
          )}

          <button
            onClick={() => onToast('Help desk connected')}
            className="w-full py-2 text-center text-[12.5px] font-semibold text-[#6B6B6B] hover:text-[#111111]"
          >
            Need help with this order?
          </button>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm space-y-4 animate-in zoom-in-95">
            <h3 className="text-[17px] font-bold text-[#111111] text-center">
              Rate Your Experience
            </h3>
            <p className="text-[12.5px] text-[#6B6B6B] text-center -mt-2">
              How was your service with {booking.proName}?
            </p>

            {/* Stars */}
            <div className="flex justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setStarRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <AppIcon
                    name="star"
                    size={32}
                    className={
                      star <= starRating
                        ? 'fill-[#EAB308] text-[#EAB308]'
                        : 'text-[#D4D4D4]'
                    }
                  />
                </button>
              ))}
            </div>

            <textarea
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              placeholder="Tell others what you liked (punctuality, clean work, etc.)"
              rows={3}
              className="w-full p-3 rounded-xl border border-[#E5E5E5] text-[13px] text-[#111111] focus:outline-hidden focus:border-[#111111]"
            />

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setShowReviewModal(false)}
                className="h-11 rounded-xl border border-[#E5E5E5] text-[13px] font-bold text-[#6B6B6B] hover:bg-[#F5F5F5]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onSubmitReview(booking.id, starRating, reviewNote);
                  setShowReviewModal(false);
                }}
                className="h-11 rounded-xl bg-[#111111] text-white text-[13px] font-bold hover:bg-black"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
