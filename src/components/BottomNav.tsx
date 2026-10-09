import React from 'react';
import { TabType } from '../types';
import { AppIcon } from './AppIcon';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  unreadChatCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  unreadChatCount,
}) => {
  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'marketplace', label: 'Marketplace', icon: 'wrench' },
    { id: 'bookings', label: 'Bookings', icon: 'calendar' },
    { id: 'inbox', label: 'Inbox', icon: 'chat' },
    { id: 'profile', label: 'Profile', icon: 'user' },
  ];

  return (
    <nav className="sticky bottom-0 z-30 w-full bg-white border-t border-[#E5E5E5] px-2 pt-2 pb-3 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
      <div className="grid grid-cols-5 items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="group flex flex-col items-center justify-center min-h-[48px] py-1 transition-transform active:scale-95"
              aria-label={tab.label}
            >
              <div className="relative">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                    isActive ? 'text-[#111111]' : 'text-[#888888] group-hover:text-[#444444]'
                  }`}
                >
                  <AppIcon name={tab.icon} size={22} />
                </div>
                {tab.id === 'inbox' && unreadChatCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-[#111111] text-[10px] font-bold text-white ring-2 ring-white">
                    {unreadChatCount}
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] font-semibold tracking-tight transition-colors ${
                  isActive ? 'text-[#111111]' : 'text-[#888888]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
