import React, { useState } from 'react';
import { ServiceCategory, Professional, Address, Booking } from '../types';
import { AppIcon } from '../components/AppIcon';

interface BookingFlowScreenProps {
  category: ServiceCategory;
  serviceId?: string;
  professional?: Professional;
  availablePros: Professional[];
  addresses: Address[];
  onBack: () => void;
  onConfirmBooking: (newBooking: Partial<Booking>) => void;
  onAddNewAddress: () => void;
}

export const BookingFlowScreen: React.FC<BookingFlowScreenProps> = ({
  category,
  serviceId,
  professional: initialPro,
  availablePros,
  addresses,
  onBack,
  onConfirmBooking,
  onAddNewAddress,
}) => {
  // Step 1: Service Package
  // Step 2: Professional selection
  // Step 3: Date & Slot
  // Step 4: Address
  // Step 5: Summary & Payment Mode

  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    serviceId || category.services[0].id
  );
  const [selectedProId, setSelectedProId] = useState<string>(
    initialPro ? initialPro.id : availablePros[0]?.id || ''
  );
  const [selectedDate, setSelectedDate] = useState<string>('Tomorrow, Oct 9');
  const [selectedSlot, setSelectedSlot] = useState<string>('10:00 AM');
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    addresses[0]?.id || ''
  );
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cash'>('upi');
  const [step, setStep] = useState<number>(1);

  const selectedService =
    category.services.find((s) => s.id === selectedServiceId) || category.services[0];
  const selectedPro =
    availablePros.find((p) => p.id === selectedProId) || initialPro || availablePros[0];
  const selectedAddress =
    addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  const dateOptions = [
    { label: 'Today', sub: 'Oct 8', value: 'Today, Oct 8' },
    { label: 'Tomorrow', sub: 'Oct 9', value: 'Tomorrow, Oct 9' },
    { label: 'Saturday', sub: 'Oct 10', value: 'Saturday, Oct 10' },
    { label: 'Sunday', sub: 'Oct 11', value: 'Sunday, Oct 11' },
  ];

  const slotOptions = [
    '09:00 AM',
    '10:30 AM',
    '12:00 PM',
    '02:30 PM',
    '04:00 PM',
    '05:30 PM',
    '07:00 PM',
  ];

  const platformFee = 20;
  const totalPrice = selectedService.price + platformFee;

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Complete booking
      onConfirmBooking({
        catId: category.id,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        proId: selectedPro.id,
        proName: selectedPro.name,
        proRole: selectedPro.role,
        date: selectedDate,
        timeSlot: selectedSlot,
        address: selectedAddress,
        status: 'confirmed',
        price: selectedService.price,
        platformFee,
        paymentMethod,
        timelineStep: 1,
      });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-24 bg-[#FAFAFA] relative">
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-[#EFEFEF] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (step > 1) setStep(step - 1);
              else onBack();
            }}
            className="flex items-center justify-center w-10 h-10 -ml-1 rounded-full text-[#111111] hover:bg-[#F5F5F5] active:scale-95 transition-all"
            aria-label="Back"
          >
            <AppIcon name="arrow-left" size={22} />
          </button>
          <div>
            <h1 className="text-[17px] font-bold text-[#111111]">
              {step === 1 && 'Choose Service Package'}
              {step === 2 && 'Select Expert & Schedule'}
              {step === 3 && 'Service Address'}
              {step === 4 && 'Review & Payment'}
            </h1>
            <p className="text-[12px] text-[#6B6B6B]">
              Step {step} of 4 · {category.name}
            </p>
          </div>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex px-4 pt-3 gap-1.5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full flex-1 transition-all ${
              i <= step ? 'bg-[#111111]' : 'bg-[#E5E5E5]'
            }`}
          />
        ))}
      </div>

      <div className="p-4 space-y-4">
        {/* STEP 1: Select Service Package */}
        {step === 1 && (
          <div className="space-y-3">
            <h3 className="text-[14.5px] font-bold text-[#111111]">Available Packages</h3>
            {category.services.map((svc) => (
              <div
                key={svc.id}
                onClick={() => setSelectedServiceId(svc.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedServiceId === svc.id
                    ? 'border-[#111111] bg-white ring-1 ring-[#111111] shadow-xs'
                    : 'border-[#E5E5E5] bg-white hover:border-[#CCCCCC]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="text-[15px] font-bold text-[#111111]">{svc.name}</h4>
                    <p className="text-[12px] text-[#6B6B6B] mt-1 leading-relaxed">
                      {svc.desc}
                    </p>
                    <span className="inline-block mt-2 text-[11.5px] text-[#888888]">
                      Duration: {svc.duration}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[16px] font-extrabold text-[#111111]">
                      ₹{svc.price}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-2 ml-auto ${
                        selectedServiceId === svc.id
                          ? 'border-[#111111] bg-[#111111] text-white'
                          : 'border-[#CCCCCC]'
                      }`}
                    >
                      {selectedServiceId === svc.id && <AppIcon name="check" size={12} />}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STEP 2: Professional & Schedule */}
        {step === 2 && (
          <div className="space-y-5">
            {/* Preferred Professional */}
            <div>
              <h3 className="text-[14.5px] font-bold text-[#111111] mb-2.5">
                Assign Professional
              </h3>
              <div className="space-y-2">
                {availablePros.map((pro) => (
                  <div
                    key={pro.id}
                    onClick={() => setSelectedProId(pro.id)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                      selectedProId === pro.id
                        ? 'border-[#111111] bg-white ring-1 ring-[#111111]'
                        : 'border-[#E5E5E5] bg-white hover:border-[#CCCCCC]'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-full bg-[#F5F5F5] border border-[#E5E5E5] text-[14px] font-bold text-[#111111] flex items-center justify-center shrink-0">
                      {pro.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <h4 className="text-[14px] font-bold text-[#111111] truncate">
                            {pro.name}
                          </h4>
                          {pro.isVerified && (
                            <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-[#E9F6EC] text-[#1E7A34]">
                              Verified
                            </span>
                          )}
                        </div>
                        <span className="text-[12px] font-bold text-[#111111] flex items-center gap-0.5 shrink-0">
                          <AppIcon name="star" size={12} className="fill-[#EAB308] text-[#EAB308]" />
                          {pro.rating.toFixed(1)}
                        </span>
                      </div>
                      <p className="text-[11.5px] text-[#6B6B6B] truncate">{pro.role}</p>
                      <p className="text-[11px] text-[#888888]">
                        {pro.completedJobs} jobs · {pro.distanceKm} km away
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <h3 className="text-[14.5px] font-bold text-[#111111] mb-2">Select Date</h3>
              <div className="grid grid-cols-4 gap-2">
                {dateOptions.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setSelectedDate(d.value)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      selectedDate === d.value
                        ? 'bg-[#111111] text-white border-[#111111]'
                        : 'bg-white border-[#E5E5E5] text-[#111111] hover:border-[#111111]'
                    }`}
                  >
                    <div className="text-[11.5px] font-semibold">{d.label}</div>
                    <div className="text-[11px] opacity-80 mt-0.5">{d.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slot Selection */}
            <div>
              <h3 className="text-[14.5px] font-bold text-[#111111] mb-2">
                Arrival Time Window
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {slotOptions.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 px-2 rounded-xl border text-[12.5px] font-bold transition-all ${
                      selectedSlot === slot
                        ? 'bg-[#111111] text-white border-[#111111]'
                        : 'bg-white border-[#E5E5E5] text-[#111111] hover:border-[#111111]'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Address Selection */}
        {step === 3 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[14.5px] font-bold text-[#111111]">Service Location</h3>
              <button
                onClick={onAddNewAddress}
                className="text-[12px] font-bold text-[#111111] flex items-center gap-1 hover:underline"
              >
                <AppIcon name="plus" size={14} /> Add New
              </button>
            </div>

            <div className="space-y-2.5">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddressId(addr.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedAddressId === addr.id
                      ? 'border-[#111111] bg-white ring-1 ring-[#111111]'
                      : 'border-[#E5E5E5] bg-white hover:border-[#CCCCCC]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#F5F5F5] text-[#111111] flex items-center justify-center shrink-0 mt-0.5">
                        <AppIcon name={addr.type === 'home' ? 'home' : 'work'} size={16} />
                      </div>
                      <div>
                        <h4 className="text-[14px] font-bold text-[#111111]">{addr.label}</h4>
                        <p className="text-[12px] text-[#6B6B6B] mt-0.5 leading-relaxed">
                          {addr.line1}, {addr.city} - {addr.pincode}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        selectedAddressId === addr.id
                          ? 'border-[#111111] bg-[#111111] text-white'
                          : 'border-[#CCCCCC]'
                      }`}
                    >
                      {selectedAddressId === addr.id && <AppIcon name="check" size={12} />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Review & Payment Selection */}
        {step === 4 && (
          <div className="space-y-4">
            {/* Booking Summary Card */}
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4 space-y-3">
              <h3 className="text-[14.5px] font-bold text-[#111111] pb-2 border-b border-[#F0F0F0]">
                Order Summary
              </h3>

              <div className="flex justify-between text-[13px]">
                <span className="text-[#6B6B6B]">Service</span>
                <span className="font-bold text-[#111111]">{selectedService.name}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[#6B6B6B]">Professional</span>
                <span className="font-bold text-[#111111]">{selectedPro.name}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[#6B6B6B]">Schedule</span>
                <span className="font-bold text-[#111111]">
                  {selectedDate} at {selectedSlot}
                </span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[#6B6B6B]">Address</span>
                <span className="font-bold text-[#111111] text-right max-w-[200px] truncate">
                  {selectedAddress.line1}
                </span>
              </div>
            </div>

            {/* Bill Details */}
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4 space-y-2.5">
              <h3 className="text-[14.5px] font-bold text-[#111111] pb-2 border-b border-[#F0F0F0]">
                Payment Details
              </h3>

              <div className="flex justify-between text-[13px] text-[#6B6B6B]">
                <span>Base Service Fee</span>
                <span>₹{selectedService.price}</span>
              </div>
              <div className="flex justify-between text-[13px] text-[#6B6B6B]">
                <span>Platform & Insurance Fee</span>
                <span>₹{platformFee}</span>
              </div>
              <div className="pt-2 border-t border-[#F0F0F0] flex justify-between text-[15px] font-extrabold text-[#111111]">
                <span>Total Payable</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <h3 className="text-[14.5px] font-bold text-[#111111] mb-2.5">
                Choose Payment Method
              </h3>
              <div className="space-y-2">
                {[
                  { id: 'upi', label: 'UPI / Google Pay / PhonePe', icon: 'upi', sub: 'Instant & zero surcharge' },
                  { id: 'card', label: 'Credit or Debit Card', icon: 'card', sub: 'Visa, Mastercard, RuPay' },
                  { id: 'cash', label: 'Pay After Service (Cash/UPI)', icon: 'cash', sub: 'Pay technician once satisfied' },
                ].map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      paymentMethod === m.id
                        ? 'border-[#111111] bg-white ring-1 ring-[#111111]'
                        : 'border-[#E5E5E5] bg-white hover:border-[#CCCCCC]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#F5F5F5] text-[#111111] flex items-center justify-center shrink-0">
                        <AppIcon name={m.icon} size={16} />
                      </div>
                      <div>
                        <h4 className="text-[13.5px] font-bold text-[#111111]">{m.label}</h4>
                        <p className="text-[11.5px] text-[#888888]">{m.sub}</p>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        paymentMethod === m.id
                          ? 'border-[#111111] bg-[#111111] text-white'
                          : 'border-[#CCCCCC]'
                      }`}
                    >
                      {paymentMethod === m.id && <AppIcon name="check" size={12} />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Next/Confirm Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 max-w-md mx-auto p-4 bg-white/95 backdrop-blur-md border-t border-[#E5E5E5] flex items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider block">
            Total Amount
          </span>
          <span className="text-[18px] font-black text-[#111111]">₹{totalPrice}</span>
        </div>

        <button
          onClick={handleNext}
          className="flex-1 max-w-[220px] h-12 rounded-xl bg-[#111111] text-white text-[14px] font-bold hover:bg-black active:scale-98 transition-all flex items-center justify-center gap-1.5 shadow-sm"
        >
          {step === 4 ? (paymentMethod === 'cash' ? 'Confirm Booking' : 'Pay & Confirm') : 'Continue'}
          <AppIcon name="chevron-right" size={16} />
        </button>
      </div>
    </div>
  );
};
