import React from 'react';
import { AppIcon } from './AppIcon';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-t-[28px] max-h-[85vh] flex flex-col shadow-[0_-12px_36px_rgba(0,0,0,0.2)] animate-in slide-in-from-bottom duration-250">
        {/* Handle */}
        <div className="pt-3 pb-1 flex justify-center">
          <div className="w-10 h-1 rounded-full bg-[#D4D4D4]" />
        </div>

        {/* Head */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#EFEFEF]">
          <div>
            <h3 className="text-[17px] font-bold text-[#111111]">{title}</h3>
            {subtitle && <p className="text-[12px] text-[#6B6B6B] mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full text-[#6B6B6B] hover:bg-[#F5F5F5] active:scale-95 transition-all"
            aria-label="Close"
          >
            <AppIcon name="close" size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto no-scrollbar">{children}</div>
      </div>
    </div>
  );
};
