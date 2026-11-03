import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  to?: string;
  variant?: 'blue' | 'gold' | 'dark' | 'outline-blue';
  children?: React.ReactNode;
}

export const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ text, to, variant = 'blue', className = '', children, ...props }, ref) => {
  const displayText = text || (typeof children === 'string' ? children : 'Button');
  
  // Theme color styles matching the official TNSCON 2027 logo palette
  let dotBg = 'bg-[#003399]';
  let defaultTextColor = 'text-[#003399]';
  let hoverTextColor = 'text-white';
  let borderColor = 'border-[#003399]/40 hover:border-[#003399]';
  let containerBg = 'bg-[#FFFDF9]';

  if (variant === 'gold') {
    dotBg = 'bg-[#D49B00]';
    defaultTextColor = 'text-[#003399]';
    hoverTextColor = 'text-[#001A4D]';
    borderColor = 'border-[#D49B00]/60 hover:border-[#D49B00]';
    containerBg = 'bg-[#FFFDF9]';
  } else if (variant === 'dark') {
    dotBg = 'bg-[#D49B00]';
    defaultTextColor = 'text-white';
    hoverTextColor = 'text-[#001A4D]';
    borderColor = 'border-white/30 hover:border-white';
    containerBg = 'bg-white/10 backdrop-blur-xs';
  } else if (variant === 'outline-blue') {
    dotBg = 'bg-[#003399]';
    defaultTextColor = 'text-[#003399]';
    hoverTextColor = 'text-white';
    borderColor = 'border-[#003399] hover:border-[#003399]';
    containerBg = 'bg-[#FAF5ED]/90 backdrop-blur-xs';
  }

  const content = (
    <>
      {/* Expanding circle background on hover */}
      <span
        className={`absolute left-3.5 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full ${dotBg} transition-all duration-500 ease-out group-hover:scale-[75] pointer-events-none`}
        aria-hidden="true"
      />

      {/* Default text (slides out and fades on hover) */}
      <span className={`relative z-10 flex items-center gap-2 pl-3.5 transition-all duration-300 ease-out group-hover:translate-x-10 group-hover:opacity-0 ${defaultTextColor} font-semibold text-sm tracking-wide whitespace-nowrap`}>
        {displayText}
      </span>

      {/* Hover revealed text + arrow (slides in from right) */}
      <div className={`absolute inset-0 z-20 flex h-full w-full translate-x-10 items-center justify-center gap-2 ${hoverTextColor} opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100 font-bold text-sm tracking-wide whitespace-nowrap pointer-events-none`}>
        <span>{displayText}</span>
        <ArrowRight className="w-4 h-4 flex-shrink-0" />
      </div>
    </>
  );

  const baseClasses = `group relative inline-flex items-center justify-center cursor-pointer overflow-hidden rounded-full border ${borderColor} ${containerBg} px-6 py-3 text-center shadow-xs transition-colors duration-300 select-none ${className}`;

  if (to) {
    return (
      <Link to={to} className={baseClasses} onClick={props.onClick as any}>
        {content}
      </Link>
    );
  }

  return (
    <button ref={ref} className={baseClasses} {...props}>
      {content}
    </button>
  );
});

InteractiveHoverButton.displayName = 'InteractiveHoverButton';

export default InteractiveHoverButton;
