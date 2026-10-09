import React, { useState } from 'react';
import { ChatThread } from '../types';
import { AppIcon } from '../components/AppIcon';

interface ChatScreenProps {
  thread: ChatThread;
  onBack: () => void;
  onSendMessage: (proId: string, text: string) => void;
  onCallPro: (name: string) => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  thread,
  onBack,
  onSendMessage,
  onCallPro,
}) => {
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(thread.proId, inputText.trim());
    setInputText('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAFAFA]">
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-[#EFEFEF] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 -ml-1 rounded-full text-[#111111] hover:bg-[#F5F5F5] active:scale-95 transition-all"
            aria-label="Back"
          >
            <AppIcon name="arrow-left" size={22} />
          </button>
          <div className="w-10 h-10 rounded-full bg-[#F5F5F5] border border-[#E5E5E5] text-[14px] font-bold text-[#111111] flex items-center justify-center">
            {thread.proName[0]}
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-[#111111] leading-tight">
              {thread.proName}
            </h2>
            <p className="text-[11.5px] text-[#1E7A34] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1E7A34]" />
              Online · {thread.proRole}
            </p>
          </div>
        </div>

        <button
          onClick={() => onCallPro(thread.proName)}
          className="flex items-center justify-center w-10 h-10 rounded-full border border-[#E5E5E5] text-[#111111] hover:bg-[#F5F5F5] active:scale-95 transition-all"
          aria-label="Call"
        >
          <AppIcon name="phone" size={18} />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
        <div className="text-center my-2">
          <span className="text-[11px] font-semibold text-[#888888] bg-white border border-[#E5E5E5] px-3 py-1 rounded-full">
            All messages are end-to-end coordinated
          </span>
        </div>

        {thread.messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[78%] p-3.5 rounded-2xl text-[13.5px] leading-relaxed ${
                  isUser
                    ? 'bg-[#111111] text-white rounded-br-xs shadow-xs'
                    : 'bg-white text-[#111111] border border-[#E5E5E5] rounded-bl-xs shadow-xs'
                }`}
              >
                <p>{msg.text}</p>
                <span
                  className={`block text-[10px] mt-1 text-right ${
                    isUser ? 'text-white/70' : 'text-[#888888]'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Input Box */}
      <div className="sticky bottom-0 bg-white border-t border-[#E5E5E5] p-3 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder={`Message ${thread.proName.split(' ')[0]}...`}
          className="flex-1 py-2.5 px-4 rounded-xl bg-[#F5F5F5] border border-[#E5E5E5] text-[13.5px] text-[#111111] placeholder:text-[#888888] focus:outline-hidden focus:border-[#111111] focus:bg-white"
        />
        <button
          onClick={handleSend}
          disabled={!inputText.trim()}
          className="w-11 h-11 rounded-xl bg-[#111111] text-white flex items-center justify-center disabled:opacity-40 hover:bg-black active:scale-95 transition-all shrink-0"
          aria-label="Send"
        >
          <AppIcon name="send" size={17} />
        </button>
      </div>
    </div>
  );
};
