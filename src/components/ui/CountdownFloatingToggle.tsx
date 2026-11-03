import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { siteContent } from '../../data/siteContent';

interface CountdownFloatingToggleProps {
  onOpen: () => void;
}

export const CountdownFloatingToggle: React.FC<CountdownFloatingToggleProps> = ({ onOpen }) => {
  const calculateDaysLeft = (): number => {
    const targetDate = new Date(siteContent.conference.startDateISO).getTime();
    const now = Date.now();
    const difference = Math.max(0, targetDate - now);
    return Math.floor(difference / (1000 * 60 * 60 * 24));
  };

  const [daysLeft, setDaysLeft] = useState<number>(calculateDaysLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setDaysLeft(calculateDaysLeft());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <button
      onClick={onOpen}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 bg-[#001A4D]/95 hover:bg-[#002266] text-white border border-[#D49B00]/80 shadow-[0_12px_32px_rgba(0,26,77,0.4)] px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full flex items-center gap-2 sm:gap-2.5 cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D49B00]"
      aria-label="Open Conference Countdown Modal"
    >
      <div className="relative flex items-center justify-center">
        <Clock className="w-4 h-4 text-[#FFCC00] transition-transform duration-300 group-hover:rotate-12" />
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#D49B00] animate-ping" />
      </div>

      <div className="flex items-center gap-1.5 text-xs font-semibold">
        <span className="font-bold text-[#FFCC00] tabular-nums font-mono">
          {daysLeft}d
        </span>
        <span className="text-[#FAF5ED]/90 hidden sm:inline">to TNSCON</span>
      </div>

      <span className="text-[10px] uppercase font-bold tracking-wider bg-white/10 group-hover:bg-[#D49B00] group-hover:text-[#001A4D] text-[#FFCC00] px-2 py-0.5 rounded-full transition-colors ml-0.5">
        Timer ↗
      </span>
    </button>
  );
};

export default CountdownFloatingToggle;
