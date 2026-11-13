import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-[#001A4D]/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="countdown-modal-title"
    >
      {/* Modal Container: Warm Ivory & Gold Brand Palette (replaces monotone all-blue background) */}
      <div 
        className="relative w-full max-w-4xl lg:max-w-5xl max-h-[92vh] md:max-h-[85vh] lg:max-h-[600px] overflow-y-auto md:overflow-hidden rounded-3xl bg-[#FAF5ED] p-4 sm:p-6 md:p-6 text-[#182230] border-2 border-[#D49B00]/60 shadow-[0_25px_80px_-15px_rgba(0,26,77,0.45)] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gold Gradient Accent Trim */}
        <div 
          className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#D49B00] via-[#FFCC00] to-[#D49B00] rounded-t-3xl" 
          aria-hidden="true"
        />

        {/* Ambient Warm Glow Effects */}
        <div 
          className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-[#D49B00]/15 blur-3xl pointer-events-none" 
          aria-hidden="true" 
        />
        <div 
          className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-[#003399]/10 blur-3xl pointer-events-none" 
          aria-hidden="true" 
        />

        {/* Absolute Close Button [X] */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-30 p-2 rounded-full bg-[#001A4D]/5 hover:bg-[#001A4D]/15 text-[#001A4D] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#003399] cursor-pointer shadow-xs border border-[#001A4D]/10"
          aria-label="Close Announcement Dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 2-Column Side-by-Side Layout: Poster on Left, Content on Right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6 items-center">
          
          {/* Left Side: Highlighted Gold-Framed Call for Abstracts Poster */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <Link
              to="/abstract-submission"
              onClick={onClose}
              className="relative w-full rounded-2xl overflow-hidden border-[3px] border-[#D49B00] ring-2 sm:ring-[3px] ring-[#FFCC00] shadow-[0_8px_30px_rgba(212,155,0,0.4)] bg-white p-1 sm:p-1.5 group flex items-center justify-center cursor-pointer block focus:outline-none focus:ring-2 focus:ring-[#003399] transition-all hover:shadow-[0_12px_40px_rgba(212,155,0,0.55)]"
              title="Click to Submit Abstract"
            >
              <img
                src="/assets/images/tnscon_call_for_abstracts_poster.jpg"
                alt="TNSCON 2027 Official Call for Abstracts Announcement Flyer"
                className="w-full h-auto max-h-[320px] sm:max-h-[380px] md:max-h-[420px] lg:max-h-[455px] object-contain mx-auto rounded-xl group-hover:scale-[1.015] transition-transform duration-300"
              />
              {/* Urgent Deadline Badge Overlay */}
              <div className="absolute top-3 right-3 bg-[#001A4D] text-[#FFCC00] border-2 border-[#D49B00] px-2.5 py-1 rounded-full text-[10.5px] font-bold shadow-lg flex items-center gap-1.5 pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>Deadline: 31 Jan 2027</span>
              </div>
            </Link>
          </div>

          {/* Right Side: Conference Content, Live Countdown, Society Website & Action Buttons */}
          <div className="md:col-span-7 flex flex-col justify-between h-full py-0.5 pr-0 md:pr-2">
            
            {/* Top Announcement Badge */}
            <div className="flex items-center justify-between gap-2 mb-2 pr-10 md:pr-0">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#003399]/10 border border-[#003399]/25 text-[11px] font-bold text-[#003399]">
                <Sparkles className="w-3.5 h-3.5 text-[#D49B00]" />
                <span id="countdown-modal-title">Official Conference Announcement</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-[#D49B00] px-2 py-0.5 rounded-full bg-[#D49B00]/10 border border-[#D49B00]/30 hidden sm:inline">
                11th Edition · 2027
              </span>
            </div>

            {/* Conference Title & Begumpet Venue */}
            <div className="mb-2.5">
              <div className="flex items-baseline gap-2 flex-wrap">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#001A4D] tracking-tight">
                  TNSCON 2027
                </h2>
                <span className="text-xs text-[#D49B00] font-bold uppercase tracking-wider">
                  Telangana Neurosciences Society
                </span>
              </div>
              <p className="text-xs sm:text-[13px] text-[#556070] font-medium mt-0.5 leading-snug">
                12th–14th March 2027 · Begumpet Airport, Hyderabad
              </p>
            </div>

            {/* Compact Live Countdown Timer Frame (Crisp White & Gold Accent Frame) */}
            <div className="bg-white border-2 border-[#D49B00]/40 rounded-2xl p-2.5 sm:p-3 mb-2.5 shadow-xs">
              <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#E5DCCB]">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#D49B00]" />
                  <span className="text-[10.5px] sm:text-[11px] uppercase tracking-wider font-bold text-[#003399]">
                    Conference Begins In
                  </span>
                </div>
                <span className="text-[10px] text-[#556070] font-mono font-medium">
                  Begumpet Airport · Live
                </span>
              </div>

              {/* 4 Numeric Tiles with Gold Separators */}
              <div className="grid grid-cols-7 items-center text-center py-0.5">
                {/* Days */}
                <div className="col-span-1 flex flex-col items-center">
                  <span className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tabular-nums text-[#001A4D] leading-tight">
                    {timeLeft.days}
                  </span>
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#667085] font-semibold mt-0.5">
                    Days
                  </span>
                </div>
                <span className="col-span-1 text-[#D49B00] text-xl sm:text-2xl font-serif font-bold pb-2 select-none">:</span>

                {/* Hours */}
                <div className="col-span-1 flex flex-col items-center">
                  <span className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tabular-nums text-[#001A4D] leading-tight">
                    {formatUnit(timeLeft.hours)}
                  </span>
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#667085] font-semibold mt-0.5">
                    Hours
                  </span>
                </div>
                <span className="col-span-1 text-[#D49B00] text-xl sm:text-2xl font-serif font-bold pb-2 select-none">:</span>

                {/* Minutes */}
                <div className="col-span-1 flex flex-col items-center">
                  <span className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tabular-nums text-[#001A4D] leading-tight">
                    {formatUnit(timeLeft.minutes)}
                  </span>
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#667085] font-semibold mt-0.5">
                    Mins
                  </span>
                </div>
                <span className="col-span-1 text-[#D49B00] text-xl sm:text-2xl font-serif font-bold pb-2 select-none">:</span>

                {/* Seconds */}
                <div className="col-span-1 flex flex-col items-center">
                  <span className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tabular-nums text-[#D49B00] leading-tight">
                    {formatUnit(timeLeft.seconds)}
                  </span>
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#D49B00] font-semibold mt-0.5">
                    Secs
                  </span>
                </div>
              </div>
            </div>

            {/* Official Society Website Pill (Warm Amber Tint) */}
            <div className="bg-[#FFF9EE] border-2 border-[#D49B00]/45 rounded-xl px-3 py-2 mb-2.5 flex items-center justify-between gap-2.5 text-xs shadow-2xs">
              <div className="flex items-center gap-2 min-w-0">
                <Globe className="w-4 h-4 text-[#D49B00] flex-shrink-0" />
                <div className="truncate">
                  <span className="text-[9.5px] uppercase font-bold text-[#D49B00] tracking-wider block">
                    Official Society Website
                  </span>
                  <span className="text-[#001A4D] text-xs font-bold truncate block">
                    telangananeuro.com
                  </span>
                </div>
              </div>
              <a
                href="https://www.telangananeuro.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#D49B00] hover:bg-[#FFCC00] text-[#001A4D] font-bold text-[11px] transition-colors shadow-xs"
              >
                <span>Visit Society</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Abstract Track Summary Chip */}
            <div className="bg-white border border-[#E5DCCB] rounded-xl px-3 py-1.5 mb-3 flex items-center justify-between gap-2 text-xs shadow-2xs">
              <div className="text-left min-w-0">
                <span className="text-[9.5px] uppercase font-bold text-[#003399] tracking-wider block">
                  Call For Abstracts
                </span>
                <span className="text-[#556070] text-[11px] font-medium truncate block">
                  Award Papers · Free Oral Papers · E-Posters
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold whitespace-nowrap">
                Deadline: 31 Jan
              </span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-[#E5DCCB]">
              <InteractiveHoverButton
                to="/abstract-submission"
                onClick={onClose}
                text="Submit Abstract"
                variant="gold"
                className="py-2.5 px-4 text-xs font-bold w-full shadow-sm"
              />
              <InteractiveHoverButton
                to="/registration"
                onClick={onClose}
                text="Register as Delegate"
                variant="blue"
                className="py-2.5 px-4 text-xs font-semibold w-full shadow-sm"
              />
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default CountdownModal;
