import React, { useState } from 'react';
import { UserSession } from '../types';
import { AppIcon } from '../components/AppIcon';
import { ProVerificationModal } from '../components/ProVerificationModal';

interface ProDashboardScreenProps {
  userSession?: UserSession;
  onExit: () => void;
  onToast: (msg: string) => void;
  onLogout: () => void;
}

export const ProDashboardScreen: React.FC<ProDashboardScreenProps> = ({
  userSession,
  onExit,
  onToast,
  onLogout,
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState<'leads' | 'earnings' | 'schedule' | 'reviews'>('leads');
  const [isVerifiedProfile, setIsVerifiedProfile] = useState(() => {
    try {
      return localStorage.getItem('oncall_pro_verified') === 'true';
    } catch {
      return false;
    }
  });

  // Prompt verification on initial visit if not completed
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(() => {
    try {
      const dismissed = localStorage.getItem('oncall_pro_verification_dismissed');
      const verified = localStorage.getItem('oncall_pro_verified') === 'true';
      return !verified && dismissed !== 'true';
    } catch {
      return true;
    }
  });

  const [leads, setLeads] = useState([
    {
      id: 'job-1',
      customer: 'Ananya Sharma',
      service: 'Full Room Painting (2 Coats Emulsion)',
      locality: 'Saket Block J, South Delhi',
      distance: '1.2 km',
      amount: '₹1,499',
      slot: 'Tomorrow, 10:00 AM',
      status: 'new',
      scope: 'Living Room walls + primer coat. Drop cloth protection needed.',
      paymentMode: 'Online Paid (UPI Escrow)',
    },
    {
      id: 'job-2',
      customer: 'Rohan Mehra',
      service: 'Concealed Water Leakage Diagnostic',
      locality: 'Hauz Khas Enclave Flat 4',
      distance: '2.5 km',
      amount: '₹399',
      slot: 'Today, 04:30 PM',
      status: 'accepted',
      scope: 'Bathroom tile joint dampness. Bring CPVC sealant & wrench set.',
      paymentMode: 'Cash on Completion',
    },
    {
      id: 'job-3',
      customer: 'Kavita Rao',
      service: 'Bed Frame Repair & Hydraulic Lift Assembly',
      locality: 'Green Park Main',
      distance: '3.1 km',
      amount: '₹549',
      slot: 'Friday, 11:00 AM',
      status: 'new',
      scope: 'IKEA Queen bed hydraulic alignment + squeak fix.',
      paymentMode: 'Online Paid (Card)',
    },
    {
      id: 'job-4',
      customer: 'Dr. Siddharth Verma',
      service: 'Accent Stencil Texture Wall Painting',
      locality: 'Greater Kailash Part 1',
      distance: '4.0 km',
      amount: '₹2,199',
      slot: 'Saturday, 09:30 AM',
      status: 'new',
      scope: 'Metallic gold geometric finish on master bedroom feature wall.',
      paymentMode: 'Online Paid (UPI Escrow)',
    },
  ]);

  const handleAccept = (jobId: string) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === jobId ? { ...l, status: 'accepted' } : l))
    );
    onToast('Service job accepted! Customer notified of your arrival window.');
  };

  const handleReject = (jobId: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== jobId));
    onToast('Job lead dismissed');
  };

  const handleCompleteVerification = () => {
    setIsVerifiedProfile(true);
    localStorage.setItem('oncall_pro_verified', 'true');
    onToast('Government ID & Toolkit verified! Green Verified badge unlocked.');
  };

  const handleDismissVerification = () => {
    setIsVerificationModalOpen(false);
    localStorage.setItem('oncall_pro_verification_dismissed', 'true');
    onToast('You can complete profile verification anytime from your dashboard banner.');
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-6 bg-[#FAFAFA]">
      {/* Partner Header */}
      <div className="sticky top-0 z-20 bg-[#111111] text-white px-4 pt-3 pb-4 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center font-bold text-white text-[15px]">
                {userSession?.avatarInitials || 'AV'}
              </div>
              {isVerifiedProfile && (
                <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-[#1E7A34] text-white flex items-center justify-center ring-2 ring-[#111111] shadow-xs">
                  <AppIcon name="check" size={10} />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-[16px] font-bold leading-tight">
                  {userSession?.fullName || 'Amit Verma'} (Partner)
                </h2>
                {isVerifiedProfile ? (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#E9F6EC] text-[#1E7A34]">
                    Verified
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#FEF9C3] text-[#CA8A04]">
                    Pending Verification
                  </span>
                )}
              </div>
              <p className="text-[11.5px] text-[#A3A3A3] leading-tight mt-0.5">
                {userSession?.serviceCategory || 'Master Painter & Wall Artist'} · {userSession?.city || 'Delhi'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onLogout}
              className="px-2.5 py-1.5 rounded-xl bg-white/15 hover:bg-[#C23B3B] text-white text-[11.5px] font-bold transition-colors flex items-center gap-1 shadow-xs"
              title="Log out from OnnCall"
            >
              <AppIcon name="logout" size={13} />
              <span>Logout</span>
            </button>
            <button
              onClick={onExit}
              className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11.5px] font-bold transition-colors"
            >
              Customer View
            </button>
          </div>
        </div>

        {/* Live Dispatch Toggle Bar */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-white/10 border border-white/15">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isOnline ? 'bg-[#4ADE80] animate-pulse' : 'bg-[#A3A3A3]'
              }`}
            />
            <span className="text-[13px] font-semibold text-white">
              {isOnline ? 'Active for Instant Bookings' : 'Offline / On a Break'}
            </span>
          </div>

          <button
            onClick={() => {
              setIsOnline(!isOnline);
              onToast(isOnline ? 'Switched to Offline' : 'You are now Online for customer dispatch!');
            }}
            className={`px-3 py-1 rounded-lg text-[12px] font-extrabold transition-all ${
              isOnline ? 'bg-[#4ADE80] text-[#111111]' : 'bg-white/20 text-white'
            }`}
          >
            {isOnline ? 'GO OFFLINE' : 'GO ONLINE'}
          </button>
        </div>

        {/* Partner Sub Tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-white/10 rounded-xl">
          {[
            { id: 'leads', label: 'Work Leads' },
            { id: 'earnings', label: 'Payouts' },
            { id: 'schedule', label: 'Availability' },
            { id: 'reviews', label: 'Reviews' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`py-1.5 rounded-lg text-[12px] font-bold transition-all text-center truncate ${
                activeTab === t.id
                  ? 'bg-white text-[#111111] shadow-xs'
                  : 'text-[#D4D4D4] hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* PROFILE COMPLETION CALLOUT (IF NOT VERIFIED) */}
        {!isVerifiedProfile && (
          <div className="p-4 rounded-2xl bg-[#FEF9C3] border border-[#EAB308]/40 shadow-xs space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#CA8A04] text-white flex items-center justify-center shrink-0">
                  <AppIcon name="shield" size={16} />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-[#854D0E]">
                    Complete Verification Profile
                  </h3>
                  <span className="text-[11.5px] text-[#A16207]">
                    Aadhaar ID, Toolkit Checklist & Bank Account
                  </span>
                </div>
              </div>

              <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-[#CA8A04] text-white shrink-0">
                Action Required
              </span>
            </div>

            <p className="text-[12px] text-[#713F12] leading-relaxed">
              Verify your documents now to unlock the official green <span className="font-bold">Verified</span> badge on customer searches and get direct priority orders.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setIsVerificationModalOpen(true)}
                className="flex-1 h-9 rounded-xl bg-[#111111] text-white text-[12px] font-bold hover:bg-black active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-xs"
              >
                <AppIcon name="check" size={14} />
                Complete Verification Now
              </button>
              <button
                onClick={handleDismissVerification}
                className="px-3 h-9 rounded-xl border border-[#CA8A04]/40 bg-white/60 text-[#854D0E] text-[12px] font-bold hover:bg-white"
              >
                Do Later
              </button>
            </div>
          </div>
        )}

        {/* VERIFIED STATUS BADGE (IF VERIFIED) */}
        {isVerifiedProfile && (
          <div className="p-3.5 rounded-2xl bg-[#E9F6EC] border border-[#1E7A34]/25 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#1E7A34] text-white flex items-center justify-center shrink-0">
                <AppIcon name="check" size={16} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-[13.5px] font-bold text-[#1E7A34]">
                    Verified Partner Credentials Active
                  </h4>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#1E7A34] text-white">
                    Verified
                  </span>
                </div>
                <p className="text-[11.5px] text-[#1E7A34]/80">
                  Aadhaar ID & Bank Account validated for instant 30-min payouts.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsVerificationModalOpen(true)}
              className="text-[11.5px] font-bold text-[#1E7A34] underline shrink-0"
            >
              View Docs
            </button>
          </div>
        )}

        {/* TAB 1: WORK LEADS */}
        {activeTab === 'leads' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[15px] font-bold text-[#111111]">Incoming Job Orders</h3>
                <p className="text-[11.5px] text-[#6B6B6B]">Auto-matched within your 5 km operating radius</p>
              </div>
              <span className="text-[12px] font-bold text-[#111111] bg-white px-2.5 py-1 rounded-lg border border-[#E5E5E5]">
                {leads.filter((l) => l.status === 'new').length} New Leads
              </span>
            </div>

            {leads.map((job) => (
              <div
                key={job.id}
                className="bg-white border border-[#E5E5E5] rounded-2xl p-4 space-y-3 shadow-xs hover:border-[#111111]/30 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${
                          job.status === 'accepted'
                            ? 'bg-[#E9F6EC] text-[#1E7A34] border-[#1E7A34]/25'
                            : 'bg-[#FEF9C3] text-[#CA8A04] border-[#EAB308]/30'
                        }`}
                      >
                        {job.status === 'accepted' ? 'CONFIRMED JOB' : 'NEW REQUEST'}
                      </span>
                      <span className="text-[11px] font-bold text-[#888888]">{job.paymentMode}</span>
                    </div>
                    <h4 className="text-[15px] font-bold text-[#111111] mt-1.5">{job.service}</h4>
                    <p className="text-[12.5px] text-[#6B6B6B] font-medium">{job.customer}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[17px] font-black text-[#111111]">{job.amount}</span>
                    <span className="text-[10.5px] text-[#1E7A34] font-bold block">Direct Payout</span>
                  </div>
                </div>

                {/* Job Scope & Requirements */}
                <div className="p-3 rounded-xl bg-[#F9F9F9] border border-[#F0F0F0] space-y-1.5 text-[12px]">
                  <p className="text-[#444444] font-medium">{job.scope}</p>
                  <div className="flex flex-col gap-1 pt-1 border-t border-[#EFEFEF] text-[#6B6B6B]">
                    <div className="flex items-center gap-1.5">
                      <AppIcon name="pin" size={13} className="text-[#888888]" />
                      <span>{job.locality} ({job.distance} away)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <AppIcon name="clock" size={13} className="text-[#888888]" />
                      <span className="font-semibold text-[#111111]">{job.slot}</span>
                    </div>
                  </div>
                </div>

                {job.status === 'new' ? (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleReject(job.id)}
                      className="h-10 rounded-xl border border-[#E5E5E5] text-[12.5px] font-bold text-[#6B6B6B] hover:bg-[#F5F5F5] active:scale-95 transition-all"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleAccept(job.id)}
                      className="h-10 rounded-xl bg-[#111111] text-white text-[12.5px] font-bold hover:bg-black active:scale-95 transition-all shadow-xs"
                    >
                      Accept Job
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => onToast(`Opening GPS navigation route to ${job.locality}...`)}
                      className="flex-1 h-10 rounded-xl border border-[#E5E5E5] text-[12.5px] font-bold text-[#111111] flex items-center justify-center gap-1.5 hover:bg-[#F5F5F5] active:scale-95 transition-all"
                    >
                      <AppIcon name="navigate" size={15} />
                      Navigate
                    </button>
                    <button
                      onClick={() => onToast(`Calling customer ${job.customer}...`)}
                      className="flex-1 h-10 rounded-xl bg-[#111111] text-white text-[12.5px] font-bold flex items-center justify-center gap-1.5 hover:bg-black active:scale-95 transition-all"
                    >
                      <AppIcon name="phone" size={15} />
                      Call Customer
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: PAYOUTS & EARNINGS */}
        {activeTab === 'earnings' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4">
                <span className="text-[11.5px] text-[#888888] font-bold block uppercase tracking-wider">
                  WEEKLY EARNINGS
                </span>
                <span className="text-[22px] font-black text-[#111111] mt-0.5 block">
                  ₹18,450
                </span>
                <span className="text-[11.5px] text-[#1E7A34] font-bold flex items-center gap-1 mt-0.5">
                  <AppIcon name="check" size={13} /> +14% vs previous week
                </span>
              </div>
              <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4">
                <span className="text-[11.5px] text-[#888888] font-bold block uppercase tracking-wider">
                  WITHDRAWABLE BALANCE
                </span>
                <span className="text-[22px] font-black text-[#111111] mt-0.5 block">
                  ₹4,200
                </span>
                <button
                  onClick={() => onToast('₹4,200 transferred to your verified bank account!')}
                  className="mt-1 text-[11.5px] font-bold text-[#111111] underline hover:text-black"
                >
                  Withdraw Now
                </button>
              </div>
            </div>

            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[#F0F0F0] pb-2">
                <h3 className="text-[14px] font-bold text-[#111111]">Completed Job Transactions</h3>
                <span className="text-[11.5px] text-[#888888]">Direct bank deposits</span>
              </div>
              <div className="divide-y divide-[#F0F0F0]">
                {[
                  { name: 'Full Room Painting - Ananya S.', date: 'Today, 2:30 PM', amt: '+₹1,499', status: 'Deposited' },
                  { name: 'Door & Wood Polish - Vikram R.', date: 'Yesterday', amt: '+₹699', status: 'Deposited' },
                  { name: 'Accent Wall Stencil - Kabir M.', date: '3 Oct 2026', amt: '+₹1,999', status: 'Deposited' },
                  { name: 'Wall Touch-Up & Damp Fix - Priya G.', date: '1 Oct 2026', amt: '+₹499', status: 'Deposited' },
                ].map((item, i) => (
                  <div key={i} className="py-2.5 flex justify-between items-center text-[13px]">
                    <div>
                      <div className="font-bold text-[#111111]">{item.name}</div>
                      <div className="text-[11px] text-[#888888]">{item.date} · {item.status}</div>
                    </div>
                    <span className="font-extrabold text-[#1E7A34]">{item.amt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AVAILABILITY SCHEDULE */}
        {activeTab === 'schedule' && (
          <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4 space-y-3">
            <h3 className="text-[14.5px] font-bold text-[#111111]">Operating Hours & Days Off</h3>
            <p className="text-[12.5px] text-[#6B6B6B]">
              Customers will only be allowed to book time slots that match your operating hours.
            </p>
            <div className="divide-y divide-[#F0F0F0] pt-1">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                <div key={day} className="flex justify-between items-center py-2.5 text-[13px]">
                  <span className="font-semibold text-[#111111]">{day}</span>
                  <span className="text-[12px] text-[#1E7A34] font-bold bg-[#E9F6EC] px-2 py-0.5 rounded-md">
                    09:00 AM - 07:00 PM
                  </span>
                </div>
              ))}
              <div className="flex justify-between items-center py-2.5 text-[13px]">
                <span className="font-semibold text-[#888888]">Sunday</span>
                <span className="text-[12px] text-[#6B6B6B] bg-[#F5F5F5] px-2 py-0.5 rounded-md">
                  Weekly Off
                </span>
              </div>
            </div>
            <button
              onClick={() => onToast('Schedule preferences updated')}
              className="w-full h-10 rounded-xl bg-[#111111] text-white text-[12.5px] font-bold hover:bg-black mt-2"
            >
              Update Availability
            </button>
          </div>
        )}

        {/* TAB 4: REVIEWS & REPUTATION */}
        {activeTab === 'reviews' && (
          <div className="space-y-3">
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4 text-center">
              <span className="text-[32px] font-black text-[#111111] leading-none block">4.9</span>
              <div className="flex justify-center gap-1 my-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <AppIcon key={s} name="star" size={16} className="fill-[#EAB308] text-[#EAB308]" />
                ))}
              </div>
              <span className="text-[12px] text-[#6B6B6B] font-medium">Based on 312 verified customer reviews</span>
            </div>

            <div className="bg-white border border-[#E5E5E5] rounded-2xl divide-y divide-[#F0F0F0] overflow-hidden">
              {[
                { customer: 'Ananya S.', date: 'Yesterday', rating: 5, comment: 'Very professional, arrived with full plastic drop sheets and finished room painting on time.' },
                { customer: 'Vikram R.', date: '3 Oct 2026', rating: 5, comment: 'High quality PU door polish. Kept all handles and floor clean.' },
                { customer: 'Rohit M.', date: '28 Sep 2026', rating: 4.8, comment: 'Prompt response and genuine advice on dampness waterproofing.' },
              ].map((rev, i) => (
                <div key={i} className="p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[13.5px] font-bold text-[#111111]">{rev.customer}</span>
                    <span className="text-[11.5px] text-[#888888]">{rev.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[12px] font-bold text-[#111111] flex items-center gap-0.5">
                      <AppIcon name="star" size={12} className="fill-[#EAB308] text-[#EAB308]" /> {rev.rating}
                    </span>
                  </div>
                  <p className="text-[12.5px] text-[#6B6B6B] leading-relaxed pt-0.5">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* VERIFICATION MODAL / DRAWER */}
      <ProVerificationModal
        userSession={userSession}
        isOpen={isVerificationModalOpen}
        onClose={handleDismissVerification}
        onComplete={handleCompleteVerification}
        onToast={onToast}
      />
    </div>
  );
};
