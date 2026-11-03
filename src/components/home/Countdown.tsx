import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { siteContent } from '../../data/siteContent';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const Countdown: React.FC = () => {
  const calculateTimeLeft = (): TimeLeft => {
    // Exact conference commencement: 12 March 2027, 09:00 AM IST (Asia/Kolkata, UTC+05:30)
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

  const formatUnit = (num: number): string => {
    return String(num).padStart(2, '0');
  };

  return (
    <div className="text-white w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/15">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#D49B00]" />
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.14em] font-semibold text-[#FFCC00]">
            Conference Begins In
          </span>
        </div>
        <span className="text-[10px] sm:text-[11px] text-white/70 tracking-wider uppercase font-medium">
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

      {/* Official Domain Line */}
      <div className="pt-4 mt-4 border-t border-white/15 text-center">
        <span className="text-xs text-white/80 tracking-wide font-normal">
          Official website:{' '}
          <strong className="text-white font-medium hover:text-[#FFCC00] transition-colors">
            {siteContent.conference.officialDomain}
          </strong>
        </span>
      </div>
    </div>
  );
};

export default Countdown;
