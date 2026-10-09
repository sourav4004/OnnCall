import React from 'react';
import { ChatThread } from '../types';
import { AppIcon } from '../components/AppIcon';

interface InboxTabProps {
  threads: ChatThread[];
  onOpenChat: (thread: ChatThread) => void;
  onExploreServices: () => void;
}

export const InboxTab: React.FC<InboxTabProps> = ({
  threads,
  onOpenChat,
  onExploreServices,
}) => {
  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-6 bg-[#FAFAFA]">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-[#EFEFEF] px-4 pt-4 pb-3">
        <h1 className="text-[18px] font-bold text-[#111111] tracking-tight">Messages</h1>
        <p className="text-[12px] text-[#6B6B6B]">Direct chat with your assigned professionals</p>
      </div>

      <div className="p-4 space-y-2.5">
        {threads.length > 0 ? (
          threads.map((thread) => (
            <div
              key={thread.proId}
              onClick={() => onOpenChat(thread)}
              className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white border border-[#E5E5E5] hover:border-[#111111]/30 hover:shadow-xs transition-all cursor-pointer"
            >
              <div className="relative shrink-0">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#F5F5F5] border border-[#E5E5E5] text-[15px] font-bold text-[#111111]">
                  {thread.proName[0]}
                </div>
                {thread.unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#111111] text-[10px] font-extrabold text-white flex items-center justify-center ring-2 ring-white">
                    {thread.unreadCount}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-[14.5px] font-bold text-[#111111] truncate">
                    {thread.proName}
                  </h4>
                  <span className="text-[11px] font-medium text-[#888888] shrink-0">
                    {thread.lastTime}
                  </span>
                </div>
                <p className="text-[11.5px] text-[#888888] font-medium truncate -mt-0.5">
                  {thread.proRole}
                </p>
                <p
                  className={`text-[12.5px] truncate mt-0.5 ${
                    thread.unreadCount > 0
                      ? 'font-bold text-[#111111]'
                      : 'text-[#6B6B6B]'
                  }`}
                >
                  {thread.lastMessage}
                </p>
              </div>

              <AppIcon name="chevron-right" size={16} className="text-[#888888] shrink-0" />
            </div>
          ))
        ) : (
          <div className="text-center py-16 px-4 bg-white rounded-2xl border border-[#E5E5E5]">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#F5F5F5] text-[#888888] mx-auto mb-3">
              <AppIcon name="chat" size={26} />
            </div>
            <h3 className="text-[16px] font-bold text-[#111111]">No messages yet</h3>
            <p className="text-[13px] text-[#6B6B6B] max-w-xs mx-auto mt-1 leading-relaxed">
              When you schedule a service, you can chat directly with your assigned painter, plumber, or electrician here.
            </p>
            <button
              onClick={onExploreServices}
              className="mt-4 px-5 py-2.5 rounded-xl bg-[#111111] text-white text-[13px] font-bold hover:bg-black active:scale-95 transition-all"
            >
              Explore Services
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
