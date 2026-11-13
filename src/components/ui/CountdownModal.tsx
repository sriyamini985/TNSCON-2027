import React, { useState, useEffect } from 'react';
import { X, Clock, Sparkles, Globe, ExternalLink } from 'lucide-react';
import { InteractiveHoverButton } from './InteractiveHoverButton';
import { siteContent } from '../../data/siteContent';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CountdownModal: React.FC<CountdownModalProps> = ({ isOpen, onClose }) => {
  const calculateTimeLeft = (): TimeLeft => {
    const targetDate = new Date(siteContent.conference.startDateISO).getTime();
    const now = Date.now();
    const difference = Math.max(0, targetDate - now);

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Keyboard accessibility: Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const formatUnit = (num: number): string => {
    return String(num).padStart(2, '0');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#001A4D]/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="countdown-modal-title"
    >
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#001A4D] via-[#002266] to-[#003399] p-5 sm:p-8 text-white border border-white/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Gold Glow Effects */}
        <div 
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[#D49B00]/20 blur-3xl pointer-events-none" 
          aria-hidden="true" 
        />
        <div 
          className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-[#003399]/40 blur-3xl pointer-events-none" 
          aria-hidden="true" 
        />

        {/* Top Header Strip with Close Button */}
        <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-semibold text-white">
            <Sparkles className="w-3.5 h-3.5 text-[#FFCC00]" />
            <span id="countdown-modal-title">Academic Medical Conclave</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-white/70 font-mono">11th Edition</span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Close Countdown Dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Countdown Inner Frame */}
        <div className="relative z-10 bg-white/5 border border-white/15 rounded-2xl p-5 sm:p-6 my-5 backdrop-blur-xs">
          
          {/* Section Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#D49B00]" />
              <span className="text-xs uppercase tracking-[0.14em] font-semibold text-[#FFCC00]">
                Conference Begins In
              </span>
            </div>
            <span className="text-[10px] text-white/60 tracking-wider uppercase font-medium">
              Asia/Kolkata (IST)
            </span>
          </div>

          {/* 4 Numeric Tiles with Gold Separators */}
          <div className="grid grid-cols-7 items-center text-center py-2">
            {/* Days */}
            <div className="col-span-1 flex flex-col items-center">
              <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tabular-nums text-white leading-tight">
                {timeLeft.days}
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-white/70 font-medium mt-1">
                Days
              </span>
            </div>

            {/* Separator */}
            <span className="col-span-1 text-[#D49B00] text-2xl sm:text-3xl font-serif font-light pb-4 select-none">
              :
            </span>

            {/* Hours */}
            <div className="col-span-1 flex flex-col items-center">
              <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tabular-nums text-white leading-tight">
                {formatUnit(timeLeft.hours)}
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-white/70 font-medium mt-1">
                Hours
              </span>
            </div>

            {/* Separator */}
            <span className="col-span-1 text-[#D49B00] text-2xl sm:text-3xl font-serif font-light pb-4 select-none">
              :
            </span>

            {/* Minutes */}
            <div className="col-span-1 flex flex-col items-center">
              <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tabular-nums text-white leading-tight">
                {formatUnit(timeLeft.minutes)}
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-white/70 font-medium mt-1">
                Minutes
              </span>
            </div>

            {/* Separator */}
            <span className="col-span-1 text-[#D49B00] text-2xl sm:text-3xl font-serif font-light pb-4 select-none">
              :
            </span>

            {/* Seconds */}
            <div className="col-span-1 flex flex-col items-center">
              <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tabular-nums text-[#FFCC00] leading-tight">
                {formatUnit(timeLeft.seconds)}
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-white/70 font-medium mt-1">
                Seconds
              </span>
            </div>
          </div>

          {/* Official Domain & Society Links */}
          <div className="pt-3 mt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
            <span className="text-white/75 text-[11px] sm:text-xs text-center sm:text-left">
              Conference: <strong className="text-white font-medium">{siteContent.conference.officialDomain}</strong>
            </span>
            <a
              href="https://www.telangananeuro.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D49B00] hover:bg-[#FFCC00] text-[#001A4D] font-bold text-[11px] shadow-xs transition-colors"
            >
              <Globe className="w-3 h-3" />
              <span>Visit telangananeuro.com</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

        </div>

        {/* Association Society Feature Pill */}
        <div className="relative z-10 bg-white/10 border border-[#D49B00]/40 rounded-xl px-3.5 py-2.5 mb-4 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-left min-w-0">
            <Globe className="w-4 h-4 text-[#FFCC00] flex-shrink-0" />
            <div className="truncate">
              <span className="text-[10px] uppercase font-bold text-[#FFCC00] tracking-wider block">
                Official Association Portal
              </span>
              <span className="text-white/90 text-xs font-medium truncate block">
                Telangana Neurosciences Society (TNS)
              </span>
            </div>
          </div>
          <a
            href="https://www.telangananeuro.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-[#D49B00] hover:text-[#001A4D] text-[#FFCC00] font-bold text-xs border border-white/20 transition-all"
          >
            <span>Society Website</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* 3 Small Floating Stat Chips */}
        <div className="relative z-10 grid grid-cols-3 gap-2.5 pb-5">
          {siteContent.heroChips.map((chip) => (
            <div
              key={chip.label}
              className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl px-2.5 py-2 text-center text-white"
            >
              <span className="block font-semibold text-xs leading-tight text-[#FFCC00]">
                {chip.label}
              </span>
              <span className="text-[9.5px] text-white/70 block leading-tight mt-0.5 truncate">
                {chip.detail}
              </span>
            </div>
          ))}
        </div>

        {/* Action Buttons Inside Modal */}
        <div className="relative z-10 pt-2 border-t border-white/15 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InteractiveHoverButton
            to="/registration"
            onClick={onClose}
            text="Register as Delegate"
            variant="gold"
            className="py-2.5 px-4 text-xs font-bold"
          />
          
          <InteractiveHoverButton
            to="/abstract-submission"
            onClick={onClose}
            text="Submit Abstract"
            variant="dark"
            className="py-2.5 px-4 text-xs font-semibold"
          />
        </div>

      </div>
    </div>
  );
};

export default CountdownModal;
