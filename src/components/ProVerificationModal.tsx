import React, { useState } from 'react';
import { UserSession } from '../types';
import { AppIcon } from '../components/AppIcon';

interface ProVerificationModalProps {
  userSession?: UserSession;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  onToast: (msg: string) => void;
}

export const ProVerificationModal: React.FC<ProVerificationModalProps> = ({
  userSession,
  isOpen,
  onClose,
  onComplete,
  onToast,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Per-step completion state tracking
  const [stepStatus, setStepStatus] = useState<Record<number, 'pending' | 'completed' | 'skipped'>>({
    1: 'pending',
    2: 'pending',
    3: 'pending',
    4: 'pending',
  });

  // Form State
  const [aadhaarNumber, setAadhaarNumber] = useState('8492 1048 2914');
  const [panNumber, setPanNumber] = useState('ABCDE1234F');
  const [bankAccount, setBankAccount] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [experienceYears, setExperienceYears] = useState('6');
  const [toolsChecked, setToolsChecked] = useState(true);
  const [aadhaarUploaded, setAadhaarUploaded] = useState(true);
  const [selfieUploaded, setSelfieUploaded] = useState(true);

  if (!isOpen) return null;

  const handleNext = () => {
    // Mark current step as completed
    setStepStatus((prev) => ({ ...prev, [step]: 'completed' }));

    if (step < 4) {
      setStep((prev) => (prev + 1) as any);
      onToast(`Step ${step} saved!`);
    } else {
      onComplete();
      onToast('Profile submitted! Verified status activated.');
      onClose();
    }
  };

  const handleSkipCurrentStep = () => {
    // Mark current step as skipped
    setStepStatus((prev) => ({ ...prev, [step]: 'skipped' }));
    const stepNames: Record<number, string> = {
      1: 'Identity Verification',
      2: 'Toolkit Checklist',
      3: 'Payment & Bank Details',
      4: 'Code of Conduct',
    };

    onToast(`Skipped ${stepNames[step]}. You can add this later.`);

    if (step < 4) {
      setStep((prev) => (prev + 1) as any);
    } else {
      onComplete();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-250">
        {/* Header */}
        <div className="p-5 pb-3 border-b border-[#F0F0F0] flex items-center justify-between bg-white shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#EAB308]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#CA8A04]">
                STEP {step} OF 4
              </span>
              {stepStatus[step] === 'skipped' && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#F5F5F5] text-[#888888] border border-[#E5E5E5]">
                  Currently Skipped
                </span>
              )}
            </div>
            <h2 className="text-[17px] font-bold text-[#111111] mt-0.5">
              {step === 1 && 'Government Identity Verification'}
              {step === 2 && 'Skill Certificate & Tools Checklist'}
              {step === 3 && 'Payment & Direct Bank Account'}
              {step === 4 && 'Partner Safety & Code of Conduct'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#F5F5F5] text-[#888888] transition-colors"
            aria-label="Close"
          >
            <AppIcon name="close" size={18} />
          </button>
        </div>

        {/* Step Navigation Pill Chips */}
        <div className="px-5 pt-3 pb-1 shrink-0 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { num: 1, label: 'Identity' },
            { num: 2, label: 'Tools' },
            { num: 3, label: 'Bank Payouts' },
            { num: 4, label: 'Pledges' },
          ].map((item) => {
            const isCurrent = step === item.num;
            const status = stepStatus[item.num];
            return (
              <button
                key={item.num}
                onClick={() => setStep(item.num as any)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all shrink-0 ${
                  isCurrent
                    ? 'bg-[#111111] text-white'
                    : status === 'completed'
                    ? 'bg-[#E9F6EC] text-[#1E7A34] border border-[#1E7A34]/25'
                    : status === 'skipped'
                    ? 'bg-[#FEF9C3] text-[#CA8A04] border border-[#EAB308]/30'
                    : 'bg-[#F5F5F5] text-[#6B6B6B]'
                }`}
              >
                {status === 'completed' ? (
                  <AppIcon name="check" size={11} />
                ) : (
                  <span>{item.num}.</span>
                )}
                <span>{item.label}</span>
                {status === 'skipped' && <span className="opacity-70">(Skip)</span>}
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto no-scrollbar space-y-4">
          {/* STEP 1: GOVT ID & POLICE RECORD */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-[#E9F6EC] border border-[#1E7A34]/20 flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#1E7A34] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <AppIcon name="shield" size={14} />
                </div>
                <div className="text-[12px] text-[#1E7A34] leading-relaxed">
                  <span className="font-bold block">Why is this required?</span>
                  Verified professionals receive <span className="font-bold">4x more bookings</span> and customer trust priority matching.
                </div>
              </div>

              <div>
                <label className="text-[12px] font-bold text-[#6B6B6B] uppercase tracking-wider block mb-1">
                  Aadhaar Card Number (12 Digits)
                </label>
                <input
                  type="text"
                  value={aadhaarNumber}
                  onChange={(e) => setAadhaarNumber(e.target.value)}
                  placeholder="xxxx xxxx xxxx"
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E5E5E5] text-[14px] font-bold text-[#111111] focus:border-[#111111] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[12px] font-bold text-[#6B6B6B] uppercase tracking-wider block mb-1">
                  PAN Card Number (Optional)
                </label>
                <input
                  type="text"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  placeholder="ABCDE1234F"
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E5E5E5] text-[14px] font-bold text-[#111111] uppercase focus:border-[#111111] focus:outline-hidden"
                />
              </div>

              {/* Upload Boxes */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div
                  onClick={() => {
                    setAadhaarUploaded(!aadhaarUploaded);
                    onToast('Aadhaar photo updated');
                  }}
                  className={`p-3 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                    aadhaarUploaded ? 'border-[#1E7A34] bg-[#E9F6EC]/30' : 'border-[#CCCCCC] bg-[#F9F9F9]'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 ${
                    aadhaarUploaded ? 'bg-[#1E7A34] text-white' : 'bg-[#EAEAEA] text-[#6B6B6B]'
                  }`}>
                    <AppIcon name={aadhaarUploaded ? 'check' : 'upload'} size={15} />
                  </div>
                  <span className="text-[12px] font-bold text-[#111111]">Aadhaar Front & Back</span>
                  <span className="text-[10px] text-[#1E7A34] font-semibold mt-0.5">
                    {aadhaarUploaded ? 'File Attached' : 'Tap to Upload'}
                  </span>
                </div>

                <div
                  onClick={() => {
                    setSelfieUploaded(!selfieUploaded);
                    onToast('Live selfie captured');
                  }}
                  className={`p-3 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                    selfieUploaded ? 'border-[#1E7A34] bg-[#E9F6EC]/30' : 'border-[#CCCCCC] bg-[#F9F9F9]'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 ${
                    selfieUploaded ? 'bg-[#1E7A34] text-white' : 'bg-[#EAEAEA] text-[#6B6B6B]'
                  }`}>
                    <AppIcon name={selfieUploaded ? 'check' : 'camera'} size={15} />
                  </div>
                  <span className="text-[12px] font-bold text-[#111111]">Live Worker Selfie</span>
                  <span className="text-[10px] text-[#1E7A34] font-semibold mt-0.5">
                    {selfieUploaded ? 'Face Verified' : 'Take Photo'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: TRADE EXPERIENCE & TOOLBOX CHECK */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-[12px] font-bold text-[#6B6B6B] uppercase tracking-wider block mb-1">
                  Years of Practical Experience
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    className="w-24 h-11 px-3.5 rounded-xl border border-[#E5E5E5] text-[14px] font-bold text-[#111111]"
                  />
                  <span className="text-[13px] text-[#6B6B6B] font-medium">years in {userSession?.serviceCategory || 'Home Services'}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-[#E5E5E5] space-y-2.5">
                <h4 className="text-[13.5px] font-bold text-[#111111]">Mandatory Toolkit Checklist</h4>
                {[
                  'Professional standard toolkit (cordless drills, manifold gauge, or roller sets)',
                  'Safety gloves, protective goggles, and shoe covers for customer homes',
                  'Floor drop cloths and masking tape for zero-mess cleanup',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-[12px] text-[#444444]">
                    <div className="w-4 h-4 rounded-full bg-[#E9F6EC] text-[#1E7A34] flex items-center justify-center shrink-0 mt-0.5">
                      <AppIcon name="check" size={10} />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div
                onClick={() => setToolsChecked(!toolsChecked)}
                className="flex items-center gap-3 p-3 rounded-2xl bg-[#F9F9F9] border border-[#E5E5E5] cursor-pointer"
              >
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                  toolsChecked ? 'bg-[#111111] border-[#111111] text-white' : 'border-[#CCCCCC] bg-white'
                }`}>
                  {toolsChecked && <AppIcon name="check" size={12} />}
                </div>
                <span className="text-[12.5px] font-bold text-[#111111]">
                  I confirm I own all necessary professional equipment
                </span>
              </div>
            </div>
          )}

          {/* STEP 3: BANK ACCOUNT FOR INSTANT PAYOUTS (WITH DEDICATED SKIP CALLOUT) */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-[#FEF9C3] border border-[#EAB308]/30 flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#CA8A04] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <AppIcon name="star" size={13} className="fill-white" />
                </div>
                <div className="text-[12px] text-[#854D0E] leading-relaxed">
                  <span className="font-bold block">Optional for now</span>
                  You can skip entering payment details right now and provide your bank account or UPI ID later when withdrawing your earnings.
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[12px] font-bold text-[#6B6B6B] uppercase tracking-wider">
                    Bank Account Number
                  </label>
                  <button
                    type="button"
                    onClick={handleSkipCurrentStep}
                    className="text-[11.5px] font-bold text-[#111111] underline hover:text-black"
                  >
                    Skip Payment Details →
                  </button>
                </div>
                <input
                  type="text"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  placeholder="Enter 12-16 digit account number (Optional)"
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E5E5E5] text-[14px] font-bold text-[#111111] focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="text-[12px] font-bold text-[#6B6B6B] uppercase tracking-wider block mb-1">
                  Bank IFSC Code
                </label>
                <input
                  type="text"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                  placeholder="e.g. HDFC0001234 (Optional)"
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E5E5E5] text-[14px] font-bold text-[#111111] uppercase focus:border-[#111111]"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#F9F9F9] border border-[#EFEFEF] text-[12px] text-[#6B6B6B]">
                💰 Customer payments will be held safely in your OnnCall platform wallet until your bank account is connected.
              </div>
            </div>
          )}

          {/* STEP 4: SERVICE CODE OF CONDUCT */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#F9F9F9] border border-[#E5E5E5] space-y-2.5">
                <h4 className="text-[14px] font-bold text-[#111111]">OnnCall Partner Pledges</h4>
                <div className="space-y-2 text-[12px] text-[#555555]">
                  <p>✓ <span className="font-semibold text-[#111111]">Punctuality:</span> Arrive at the customer address within the scheduled arrival slot.</p>
                  <p>✓ <span className="font-semibold text-[#111111]">Standard Rate Integrity:</span> Never charge more than the upfront package bill without customer authorization.</p>
                  <p>✓ <span className="font-semibold text-[#111111]">Cleanliness Guarantee:</span> Always clean up dust, scrap tape, and spills before concluding the job.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#E9F6EC] border border-[#1E7A34]/25 text-center">
                <span className="text-[12.5px] font-bold text-[#1E7A34] block">
                  🎉 Ready to activate Partner privileges!
                </span>
                <span className="text-[11.5px] text-[#1E7A34]/80 mt-0.5 block">
                  You can accept nearby customer job requests immediately.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions with Granular Per-Step Skip */}
        <div className="p-4 border-t border-[#F0F0F0] bg-white flex items-center justify-between gap-2.5 shrink-0">
          {/* Step-specific skip button */}
          <button
            type="button"
            onClick={handleSkipCurrentStep}
            className="px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] bg-[#F9F9F9] text-[12.5px] font-bold text-[#6B6B6B] hover:text-[#111111] hover:bg-[#EFEFEF] transition-colors whitespace-nowrap"
          >
            Skip this step
          </button>

          {/* Primary Submit / Next button */}
          <button
            type="button"
            onClick={handleNext}
            className="flex-1 h-11 rounded-xl bg-[#111111] text-white text-[13.5px] font-bold hover:bg-black active:scale-98 transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            {step === 4 ? 'Save & Finish' : 'Save & Continue'}
            <AppIcon name="chevron-right" size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
