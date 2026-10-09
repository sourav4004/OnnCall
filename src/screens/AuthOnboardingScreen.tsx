import React, { useState, useEffect } from 'react';
import { UserRole, UserSession } from '../types';
import { AppIcon } from '../components/AppIcon';

interface AuthOnboardingScreenProps {
  onComplete: (session: UserSession) => void;
  onToast: (msg: string) => void;
}

type AuthStep = 'phone' | 'otp' | 'role_select' | 'profile_setup';

export const AuthOnboardingScreen: React.FC<AuthOnboardingScreenProps> = ({
  onComplete,
  onToast,
}) => {
  const [step, setStep] = useState<AuthStep>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Painter');
  const [city, setCity] = useState('New Delhi');

  // Timer countdown for OTP resend
  useEffect(() => {
    let interval: any;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Handle phone submission
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      onToast('Please enter a valid 10-digit mobile number');
      return;
    }
    setTimer(30);
    setStep('otp');
    onToast(`Verification code sent to +91 ${cleanPhone}`);
  };

  // Handle OTP inputs
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const fullOtp = otp.join('');
    if (fullOtp.length < 4) {
      onToast('Please enter the 4-digit code (use demo: 1234)');
      return;
    }
    onToast('Phone number verified successfully!');
    setStep('role_select');
  };

  // Handle Final Submission
  const handleFinishSignup = () => {
    if (!fullName.trim()) {
      onToast('Please provide your name');
      return;
    }

    const session: UserSession = {
      phoneNumber: `+91 ${phone}`,
      fullName: fullName.trim(),
      role: selectedRole,
      isVerified: true,
      city,
      avatarInitials: fullName
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'US',
      businessName: businessName.trim() || undefined,
      serviceCategory: selectedCategory,
    };

    onToast(`Welcome, ${fullName}! Launching your ${selectedRole} dashboard...`);
    onComplete(session);
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col justify-between p-6 bg-white text-[#111111]">
      {/* Top Header & Brand */}
      <div>
        <div className="flex items-center justify-between pt-2 pb-6">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#111111] text-white flex items-center justify-center font-extrabold text-[16px]">
              O
            </div>
            <div>
              <span className="text-[17px] font-black tracking-tight block leading-none">
                OnnCall
              </span>
              <span className="text-[10px] text-[#888888] font-bold uppercase tracking-wider">
                Services Marketplace
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E9F6EC] border border-[#1E7A34]/25">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1E7A34]" />
            <span className="text-[11px] font-bold text-[#1E7A34]">Verified Secure</span>
          </div>
        </div>

        {/* STEP 1: ENTER PHONE NUMBER */}
        {step === 'phone' && (
          <div className="space-y-6 pt-4 animate-in fade-in duration-200">
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FEF9C3] text-[#CA8A04] border border-[#EAB308]/30 text-[11px] font-bold mb-3">
                <AppIcon name="star" size={11} className="fill-[#EAB308]" />
                Premium On-Demand Network
              </div>
              <h1 className="text-[24px] font-black tracking-tight leading-tight">
                Enter your mobile number to get started
              </h1>
              <p className="text-[13.5px] text-[#6B6B6B] mt-1.5 leading-relaxed">
                We will send an SMS verification OTP to verify your account credentials safely.
              </p>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="text-[12px] font-bold text-[#6B6B6B] uppercase tracking-wider block mb-2">
                  Mobile Number
                </label>
                <div className="flex items-center gap-2">
                  <div className="h-12 px-3.5 rounded-xl border border-[#E5E5E5] bg-[#F9F9F9] flex items-center gap-1.5 text-[14px] font-bold text-[#111111] shrink-0">
                    <span>🇮🇳 +91</span>
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="98765 43210"
                    autoFocus
                    className="flex-1 h-12 px-4 rounded-xl border border-[#E5E5E5] text-[16px] font-bold text-[#111111] tracking-wide focus:outline-hidden focus:border-[#111111] focus:ring-1 focus:ring-[#111111] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={phone.length !== 10}
                className="w-full h-12 rounded-xl bg-[#111111] text-white text-[14px] font-bold hover:bg-black disabled:opacity-40 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                Continue with OTP
                <AppIcon name="chevron-right" size={16} />
              </button>
            </form>

            <div className="pt-4 border-t border-[#F0F0F0] text-center">
              <p className="text-[11.5px] text-[#888888] leading-relaxed">
                By signing in, you agree to OnnCall's{' '}
                <span className="text-[#111111] font-semibold underline">Terms of Service</span> and{' '}
                <span className="text-[#111111] font-semibold underline">Privacy Policy</span>.
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: VERIFY OTP */}
        {step === 'otp' && (
          <div className="space-y-6 pt-4 animate-in fade-in duration-200">
            <div>
              <button
                onClick={() => setStep('phone')}
                className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#6B6B6B] hover:text-[#111111] mb-3"
              >
                <AppIcon name="chevron-left" size={16} />
                Edit Phone Number
              </button>
              <h1 className="text-[24px] font-black tracking-tight leading-tight">
                Verify with One-Time Code
              </h1>
              <p className="text-[13.5px] text-[#6B6B6B] mt-1.5 leading-relaxed">
                Enter the 4-digit verification code sent to{' '}
                <span className="font-bold text-[#111111]">+91 {phone}</span>.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between gap-3 max-w-xs mx-auto">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !digit && i > 0) {
                        document.getElementById(`otp-${i - 1}`)?.focus();
                      }
                    }}
                    className="w-14 h-14 text-center rounded-2xl border-2 border-[#E5E5E5] text-[22px] font-black text-[#111111] focus:border-[#111111] focus:outline-hidden transition-all bg-[#F9F9F9] focus:bg-white"
                  />
                ))}
              </div>

              <div className="text-center">
                {timer > 0 ? (
                  <span className="text-[12px] text-[#888888] font-medium">
                    Resend code in <span className="font-bold text-[#111111]">{timer}s</span>
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      setTimer(30);
                      onToast('New code sent via SMS');
                    }}
                    className="text-[12.5px] font-bold text-[#111111] underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleVerifyOtp}
                className="w-full h-12 rounded-xl bg-[#111111] text-white text-[14px] font-bold hover:bg-black active:scale-98 transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                Verify & Continue
                <AppIcon name="check" size={16} />
              </button>

              <div className="p-3 rounded-xl bg-[#F5F5F5] text-center">
                <span className="text-[11.5px] text-[#6B6B6B]">
                  💡 Quick Demo Tip: Enter any 4 numbers (e.g. <span className="font-bold text-[#111111]">1 2 3 4</span>) to proceed.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: ROLE SELECTION (CUSTOMER VS PROVIDER VS DISTRIBUTOR) */}
        {step === 'role_select' && (
          <div className="space-y-4 pt-2 animate-in fade-in duration-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E9F6EC] border border-[#1E7A34]/25 text-[11px] font-bold text-[#1E7A34] mb-2">
                <AppIcon name="check" size={12} />
                Phone Verified
              </div>
              <h1 className="text-[23px] font-black tracking-tight leading-tight">
                How will you use OnnCall?
              </h1>
              <p className="text-[13px] text-[#6B6B6B] mt-1">
                Select your primary account type. We will customize your entire experience accordingly.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {/* Option 1: Customer */}
              <div
                onClick={() => setSelectedRole('customer')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                  selectedRole === 'customer'
                    ? 'border-[#111111] bg-white shadow-sm ring-1 ring-[#111111]'
                    : 'border-[#E5E5E5] bg-[#FDFDFD] hover:border-[#CCCCCC]'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                      selectedRole === 'customer'
                        ? 'bg-[#111111] text-white'
                        : 'bg-[#F0F0F0] text-[#111111]'
                    }`}
                  >
                    <AppIcon name="home" size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[16px] font-bold text-[#111111]">I am a Customer</h3>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedRole === 'customer'
                            ? 'border-[#111111] bg-[#111111] text-white'
                            : 'border-[#CCCCCC]'
                        }`}
                      >
                        {selectedRole === 'customer' && <AppIcon name="check" size={12} />}
                      </div>
                    </div>
                    <p className="text-[12.5px] text-[#6B6B6B] mt-1 leading-relaxed">
                      I want to book trusted painters, plumbers, carpenters, and electricians for my home or office.
                    </p>
                    <div className="flex items-center gap-2 mt-2.5">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#E9F6EC] text-[#1E7A34]">
                        Verified Pros
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#FEF9C3] text-[#CA8A04]">
                        Upfront Pricing
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Option 2: Service Provider / Technician */}
              <div
                onClick={() => setSelectedRole('provider')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                  selectedRole === 'provider'
                    ? 'border-[#111111] bg-white shadow-sm ring-1 ring-[#111111]'
                    : 'border-[#E5E5E5] bg-[#FDFDFD] hover:border-[#CCCCCC]'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                      selectedRole === 'provider'
                        ? 'bg-[#111111] text-white'
                        : 'bg-[#F0F0F0] text-[#111111]'
                    }`}
                  >
                    <AppIcon name="wrench" size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[16px] font-bold text-[#111111]">
                        I am a Service Provider
                      </h3>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedRole === 'provider'
                            ? 'border-[#111111] bg-[#111111] text-white'
                            : 'border-[#CCCCCC]'
                        }`}
                      >
                        {selectedRole === 'provider' && <AppIcon name="check" size={12} />}
                      </div>
                    </div>
                    <p className="text-[12.5px] text-[#6B6B6B] mt-1 leading-relaxed">
                      I am a professional painter, plumber, carpenter, or electrician looking for nearby high-paying job leads.
                    </p>
                    <div className="flex items-center gap-2 mt-2.5">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#E9F6EC] text-[#1E7A34]">
                        Instant Payouts
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#F5F5F5] text-[#111111]">
                        Nearby Leads
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Option 3: Material Distributor / Vendor */}
              <div
                onClick={() => setSelectedRole('distributor')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                  selectedRole === 'distributor'
                    ? 'border-[#111111] bg-white shadow-sm ring-1 ring-[#111111]'
                    : 'border-[#E5E5E5] bg-[#FDFDFD] hover:border-[#CCCCCC]'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                      selectedRole === 'distributor'
                        ? 'bg-[#111111] text-white'
                        : 'bg-[#F0F0F0] text-[#111111]'
                    }`}
                  >
                    <AppIcon name="truck" size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[16px] font-bold text-[#111111]">
                        I am a Distributor / Store
                      </h3>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedRole === 'distributor'
                            ? 'border-[#111111] bg-[#111111] text-white'
                            : 'border-[#CCCCCC]'
                        }`}
                      >
                        {selectedRole === 'distributor' && <AppIcon name="check" size={12} />}
                      </div>
                    </div>
                    <p className="text-[12.5px] text-[#6B6B6B] mt-1 leading-relaxed">
                      I supply raw paint, PVC pipes, sanitary fittings, timber, or electrical hardware to technicians and builders.
                    </p>
                    <div className="flex items-center gap-2 mt-2.5">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#FEF9C3] text-[#CA8A04]">
                        B2B Bulk Orders
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#E9F6EC] text-[#1E7A34]">
                        Verified Wholesale
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setStep('profile_setup')}
                className="w-full h-12 rounded-xl bg-[#111111] text-white text-[14px] font-bold hover:bg-black active:scale-98 transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                Continue as {selectedRole === 'customer' ? 'Customer' : selectedRole === 'provider' ? 'Service Provider' : 'Distributor'}
                <AppIcon name="chevron-right" size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: QUICK PROFILE SETUP */}
        {step === 'profile_setup' && (
          <div className="space-y-4 pt-2 animate-in fade-in duration-200">
            <div>
              <button
                onClick={() => setStep('role_select')}
                className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#6B6B6B] hover:text-[#111111] mb-2"
              >
                <AppIcon name="chevron-left" size={16} />
                Change Account Type
              </button>
              <h1 className="text-[23px] font-black tracking-tight leading-tight">
                Complete your details
              </h1>
              <p className="text-[13px] text-[#6B6B6B] mt-1">
                Setting up your customized {selectedRole} portal.
              </p>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="text-[12px] font-bold text-[#6B6B6B] uppercase tracking-wider block mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E5E5E5] text-[14px] font-semibold text-[#111111] focus:outline-hidden focus:border-[#111111]"
                />
              </div>

              {selectedRole !== 'customer' && (
                <div>
                  <label className="text-[12px] font-bold text-[#6B6B6B] uppercase tracking-wider block mb-1.5">
                    {selectedRole === 'provider' ? 'Trade / Skill Specialization' : 'Store or Business Name'}
                  </label>
                  {selectedRole === 'provider' ? (
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-[#E5E5E5] text-[14px] font-semibold text-[#111111] bg-white focus:outline-hidden focus:border-[#111111]"
                    >
                      <option value="Painter">Painter & Waterproofing</option>
                      <option value="Plumber">Plumber & Sanitary Specialist</option>
                      <option value="Carpenter">Carpenter & Wood Artisan</option>
                      <option value="Electrician">Licensed Electrician</option>
                      <option value="AC Repair">HVAC / AC Technician</option>
                      <option value="Cleaning">Deep Cleaning Expert</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Metro Hardware & Paints Supplies"
                      className="w-full h-11 px-3.5 rounded-xl border border-[#E5E5E5] text-[14px] font-semibold text-[#111111] focus:outline-hidden focus:border-[#111111]"
                    />
                  )}
                </div>
              )}

              <div>
                <label className="text-[12px] font-bold text-[#6B6B6B] uppercase tracking-wider block mb-1.5">
                  Operating City
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E5E5E5] text-[14px] font-semibold text-[#111111] bg-white focus:outline-hidden focus:border-[#111111]"
                >
                  <option value="New Delhi">New Delhi & NCR</option>
                  <option value="Mumbai">Mumbai & Navi Mumbai</option>
                  <option value="Bengaluru">Bengaluru Urban</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Pune">Pune</option>
                </select>
              </div>

              {/* Quality confirmation note */}
              <div className="p-3 rounded-2xl bg-[#F9F9F9] border border-[#EBEBEB] flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#E9F6EC] text-[#1E7A34] flex items-center justify-center shrink-0 mt-0.5">
                  <AppIcon name="check" size={13} />
                </div>
                <div className="text-[12px] text-[#6B6B6B] leading-relaxed">
                  Your phone is verified. You will enjoy priority matching and dedicated concierge support.
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleFinishSignup}
                disabled={!fullName.trim()}
                className="w-full h-12 rounded-xl bg-[#111111] text-white text-[14px] font-bold hover:bg-black disabled:opacity-40 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                Launch Dashboard
                <AppIcon name="check" size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer subtle trust marker */}
      <div className="pt-6 text-center">
        <span className="text-[11px] text-[#888888]">
          OnnCall Enterprise Infrastructure · 256-bit SSL Authenticated
        </span>
      </div>
    </div>
  );
};
