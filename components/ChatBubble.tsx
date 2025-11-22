
import React from 'react';
import { Message } from '../types';

interface ChatBubbleProps {
  message: Message;
  onActionClick?: (actionText: string) => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, onActionClick }) => {
  const isModel = message.role === 'model';
  
  // Don't render tool outputs or system messages directly in chat
  if (message.role === 'system') return null;

  return (
    <div className={`flex flex-col w-full mb-6 ${isModel ? 'items-start' : 'items-end'}`}>
      <div className={`flex w-full ${isModel ? 'justify-start' : 'justify-end'}`}>
        <div
          className={`max-w-[85%] md:max-w-[75%] px-5 py-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
            isModel
              ? 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
              : 'bg-[#E63946] text-white rounded-tr-none shadow-md'
          }`}
        >
          {isModel && (
            <div className="flex items-center gap-2 mb-2 border-b border-gray-100 pb-1">
                <span className="text-xl">👨‍🍳</span>
                <span className="text-xs font-bold text-[#023E8A] uppercase tracking-wider">San Marzano Bot</span>
            </div>
          )}
          <div className="whitespace-pre-wrap">{message.text}</div>
        </div>
      </div>
      
      {/* Quick Actions / Suggestions */}
      {isModel && message.actions && message.actions.length > 0 && (
        <div className="mt-3 ml-2 flex flex-wrap gap-2 animate-fade-in-up">
            {message.actions.map((action, idx) => (
                <button
                    key={idx}
                    onClick={() => onActionClick && onActionClick(action)}
                    className="bg-white text-[#023E8A] border border-[#023E8A]/20 px-4 py-2 rounded-full text-xs font-bold shadow-sm hover:bg-[#FFB703] hover:text-[#023E8A] hover:border-[#FFB703] hover:shadow-md transition-all transform hover:-translate-y-0.5 active:scale-95"
                >
                    {action}
                </button>
            ))}
        </div>
      )}
    </div>
  );
};
