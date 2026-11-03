import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDateStr?: string;
  className?: string;
  variant?: 'light' | 'dark' | 'compact' | 'editorial';
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  // 12 March 2027, 09:00:00 IST (UTC+05:30)
  targetDateStr = '2027-03-12T09:00:00+05:30',
  className = '',
  variant = 'editorial'
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isCompleted: false
  });

  useEffect(() => {
    const calculateTime = () => {
      const targetTime = new Date(targetDateStr).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isCompleted: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDateStr]);

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 text-xs font-manrope font-semibold ${className}`}>
        <span className="text-[#D49B00] font-bold">{timeLeft.days}d</span>
        <span className="text-[#556070]">:</span>
        <span>{String(timeLeft.hours).padStart(2, '0')}h</span>
        <span className="text-[#556070]">:</span>
        <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>
        <span className="text-[#556070]">:</span>
        <span className="text-[#D49B00] font-bold">{String(timeLeft.seconds).padStart(2, '0')}s</span>
      </div>
    );
  }

  // Editorial integrated variant (designed for clean light backgrounds)
  if (variant === 'editorial') {
    const units = [
      { label: 'DAYS', value: timeLeft.days },
      { label: 'HOURS', value: timeLeft.hours },
      { label: 'MINUTES', value: timeLeft.minutes },
      { label: 'SECONDS', value: timeLeft.seconds }
    ];

    return (
      <div className={`inline-flex items-center gap-2 sm:gap-4 py-2 px-3 sm:px-4 rounded-xl bg-[#FFFDF9] border border-[#E5DCCB] shadow-xs ${className}`}>
        {units.map((unit, idx) => (
          <React.Fragment key={unit.label}>
            <div className="flex flex-col items-center justify-center min-w-[50px] sm:min-w-[62px]">
              <span className="font-manrope font-extrabold text-xl sm:text-2xl tracking-tight leading-none text-[#003399]">
                {String(unit.value).padStart(2, '0')}
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-widest font-semibold mt-1 text-[#556070]">
                {unit.label}
              </span>
            </div>
            {idx < units.length - 1 && (
              <span className="text-sm font-bold text-[#D49B00] -mt-2 select-none">
                :
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  // Light / dark legacy variants
  const isLight = variant === 'light';
  const boxBg = isLight ? 'bg-white/10 backdrop-blur-md border border-white/20' : 'bg-[#FFFDF9] border border-[#E5DCCB]';
  const numColor = isLight ? 'text-white' : 'text-[#003399]';
  const labelColor = isLight ? 'text-white/75' : 'text-[#556070]';

  const units = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINUTES', value: timeLeft.minutes },
    { label: 'SECONDS', value: timeLeft.seconds }
  ];

  return (
    <div className={`flex items-center gap-2 sm:gap-3 ${className}`}>
      {units.map((unit, idx) => (
        <React.Fragment key={unit.label}>
          <div className={`flex flex-col items-center justify-center min-w-[60px] sm:min-w-[70px] py-2 px-2 rounded-lg ${boxBg} transition-all`}>
            <span className={`font-manrope font-extrabold text-xl sm:text-2xl tracking-tight leading-none ${numColor}`}>
              {String(unit.value).padStart(2, '0')}
            </span>
            <span className={`text-[9px] sm:text-[10px] tracking-widest font-semibold mt-1.5 ${labelColor}`}>
              {unit.label}
            </span>
          </div>
          {idx < units.length - 1 && (
            <span className="text-lg font-bold text-[#D49B00] -mt-2 select-none">
              :
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CountdownTimer;
