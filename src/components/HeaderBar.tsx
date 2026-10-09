import React from 'react';
import { AppIcon } from './AppIcon';

interface HeaderBarProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  transparent?: boolean;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightAction,
  transparent = false,
}) => {
  return (
    <header
      className={`sticky top-0 z-30 flex items-center justify-between px-4 py-3 min-h-[56px] transition-colors ${
        transparent ? 'bg-transparent' : 'bg-white border-b border-[#E5E5E5]'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {showBack && (
          <button
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 -ml-1 rounded-full text-[#111111] hover:bg-[#F5F5F5] active:scale-95 transition-all"
            aria-label="Go back"
          >
            <AppIcon name="arrow-left" size={22} />
          </button>
        )}
        <div className="flex flex-col min-w-0">
          {title && (
            <h1 className="text-[17px] font-bold text-[#111111] tracking-tight leading-tight truncate">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-[12px] font-medium text-[#6B6B6B] leading-tight truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {rightAction && <div className="flex items-center gap-1 shrink-0">{rightAction}</div>}
    </header>
  );
};
