import React from 'react';
import { Address } from '../types';
import { AppIcon } from '../components/AppIcon';

interface ProfileTabProps {
  userSession?: import('../types').UserSession;
  addresses: Address[];
  onOpenAddresses: () => void;
  onOpenSavedPros: () => void;
  onOpenHelpSupport: () => void;
  onOpenEmergency: () => void;
  onSwitchToProMode: () => void;
  onSwitchRole: () => void;
  onOpenPrivacyTerms: (title: string) => void;
  onToast: (msg: string) => void;
  onLogout: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  userSession,
  addresses,
  onOpenAddresses,
  onOpenSavedPros,
  onOpenHelpSupport,
  onOpenEmergency,
  onSwitchToProMode,
  onSwitchRole,
  onOpenPrivacyTerms,
  onToast,
  onLogout,
}) => {
  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-6 bg-[#FAFAFA]">
      {/* Header */}
      <div className="bg-white border-b border-[#EFEFEF] px-4 pt-4 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-[18px] font-bold text-[#111111] tracking-tight">Account</h1>
          <button
            onClick={onSwitchRole}
            className="px-2.5 py-1 rounded-xl bg-[#F5F5F5] border border-[#E5E5E5] text-[11.5px] font-bold text-[#111111] hover:bg-[#EBEBEB] transition-colors"
          >
            Switch Role
          </button>
        </div>

        {/* Profile Card */}
        <div className="flex items-center gap-3.5 mt-4 p-3.5 rounded-2xl bg-[#F9F9F9] border border-[#EBEBEB]">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#111111] text-white text-[18px] font-extrabold shrink-0">
            {userSession?.avatarInitials || 'JD'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[16px] font-bold text-[#111111] truncate">
              {userSession?.fullName || 'John Doe'}
            </h3>
            <p className="text-[12.5px] text-[#6B6B6B] truncate">
              {userSession?.phoneNumber || '+91 98765 43210'}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="inline-block text-[10.5px] font-bold text-[#1E7A34] bg-[#E9F6EC] border border-[#1E7A34]/20 px-2 py-0.5 rounded-full">
                Verified {userSession?.role ? userSession.role.charAt(0).toUpperCase() + userSession.role.slice(1) : 'Customer'}
              </span>
              <span className="text-[11px] text-[#888888]">· {userSession?.city || 'Delhi'}</span>
            </div>
          </div>
          <button
            onClick={() => onToast('Profile details updated')}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white text-[#6B6B6B] transition-colors"
            aria-label="Edit Profile"
          >
            <AppIcon name="user" size={16} />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Settings Group 1: Bookings & Addresses */}
        <div className="bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden divide-y divide-[#F0F0F0]">
          <button
            onClick={onOpenAddresses}
            className="w-full flex items-center justify-between p-3.5 hover:bg-[#F9F9F9] transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#F5F5F5] text-[#111111]">
                <AppIcon name="pin" size={18} />
              </div>
              <div>
                <h4 className="text-[13.5px] font-bold text-[#111111]">Saved Addresses</h4>
                <p className="text-[11.5px] text-[#6B6B6B]">
                  {addresses.length} addresses saved (Home, Work)
                </p>
              </div>
            </div>
            <AppIcon name="chevron-right" size={16} className="text-[#888888]" />
          </button>

          <button
            onClick={onOpenSavedPros}
            className="w-full flex items-center justify-between p-3.5 hover:bg-[#F9F9F9] transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#F5F5F5] text-[#111111]">
                <AppIcon name="heart" size={18} />
              </div>
              <div>
                <h4 className="text-[13.5px] font-bold text-[#111111]">Saved Professionals</h4>
                <p className="text-[11.5px] text-[#6B6B6B]">Quick rebooking for favorite experts</p>
              </div>
            </div>
            <AppIcon name="chevron-right" size={16} className="text-[#888888]" />
          </button>

          <button
            onClick={() => onToast('UPI and Card details are safely stored.')}
            className="w-full flex items-center justify-between p-3.5 hover:bg-[#F9F9F9] transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#F5F5F5] text-[#111111]">
                <AppIcon name="card" size={18} />
              </div>
              <div>
                <h4 className="text-[13.5px] font-bold text-[#111111]">Payment Modes</h4>
                <p className="text-[11.5px] text-[#6B6B6B]">UPI ID, saved cards & cash on service</p>
              </div>
            </div>
            <AppIcon name="chevron-right" size={16} className="text-[#888888]" />
          </button>
        </div>

        {/* Switch to Professional Mode Banner */}
        <div className="bg-[#111111] text-white rounded-2xl p-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded text-white inline-block mb-1">
              FOR SERVICE WORKERS
            </span>
            <h4 className="text-[14.5px] font-bold truncate">Are you a Painter or Plumber?</h4>
            <p className="text-[12px] text-[#D4D4D4] mt-0.5">
              Switch to Pro Partner view to accept jobs & track earnings.
            </p>
          </div>
          <button
            onClick={onSwitchToProMode}
            className="shrink-0 px-3 py-2 rounded-xl bg-white text-[#111111] text-[12px] font-bold hover:bg-[#F5F5F5] active:scale-95 transition-all"
          >
            Partner View
          </button>
        </div>

        {/* Settings Group 2: Support, Safety & Legal */}
        <div className="bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden divide-y divide-[#F0F0F0]">
          <button
            onClick={onOpenEmergency}
            className="w-full flex items-center justify-between p-3.5 hover:bg-[#F9F9F9] transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#FBEAEA] text-[#C23B3B]">
                <AppIcon name="phone" size={18} />
              </div>
              <div>
                <h4 className="text-[13.5px] font-bold text-[#C23B3B]">Emergency Helpline</h4>
                <p className="text-[11.5px] text-[#888888]">24/7 priority support for gas & water leaks</p>
              </div>
            </div>
            <AppIcon name="chevron-right" size={16} className="text-[#888888]" />
          </button>

          <button
            onClick={onOpenHelpSupport}
            className="w-full flex items-center justify-between p-3.5 hover:bg-[#F9F9F9] transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#F5F5F5] text-[#111111]">
                <AppIcon name="shield" size={18} />
              </div>
              <div>
                <h4 className="text-[13.5px] font-bold text-[#111111]">Help & FAQs</h4>
                <p className="text-[11.5px] text-[#6B6B6B]">Cancellation policy, refunds & complaints</p>
              </div>
            </div>
            <AppIcon name="chevron-right" size={16} className="text-[#888888]" />
          </button>

          <button
            onClick={() => onOpenPrivacyTerms('Terms of Service')}
            className="w-full flex items-center justify-between p-3.5 hover:bg-[#F9F9F9] transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#F5F5F5] text-[#111111]">
                <AppIcon name="file" size={18} />
              </div>
              <div>
                <h4 className="text-[13.5px] font-bold text-[#111111]">Terms & Privacy</h4>
                <p className="text-[11.5px] text-[#6B6B6B]">Customer rights, warranty & privacy guidelines</p>
              </div>
            </div>
            <AppIcon name="chevron-right" size={16} className="text-[#888888]" />
          </button>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-[#FBEAEA] text-[#C23B3B] text-[13.5px] font-bold hover:bg-[#F7DADA] active:scale-98 transition-all"
        >
          <AppIcon name="logout" size={18} />
          Log Out / Switch Account
        </button>

        <p className="text-center text-[11px] text-[#888888]">
          OnnCall App Version 2.4.0 · Powered by React Native Design System
        </p>
      </div>
    </div>
  );
};
