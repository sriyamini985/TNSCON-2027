import React from 'react';
import { siteContent } from '../../data/siteContent';

export const StatsStrip: React.FC = () => {
  return (
    <section className="bg-[#FAF5ED] py-12 lg:py-16 border-b border-[#E5DCCB]">
      <div className="max-w-[1240px] mx-auto px-6">
        
        {/* Four Stat Cards on an Ivory-tinted Row with Elegant Dividers */}
        <div className="bg-[#FFFDF9] rounded-2xl border border-[#E5DCCB] shadow-[0_4px_24px_-4px_rgba(0,51,153,0.04)] divide-y md:divide-y-0 md:divide-x divide-[#E5DCCB] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          
          {siteContent.statsStrip.map((stat) => (
            <div
              key={stat.label}
              className="p-6 sm:p-8 flex flex-col justify-center text-left space-y-1 hover:bg-[#FAF5ED]/60 transition-colors duration-200"
            >
              {/* Stat Value with Editorial Serif */}
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#003399] tracking-tight leading-none">
                  {stat.value}
                </span>
                {stat.isPlaceholder && (
                  /* TODO: Replace placeholder value with official certified count */
                  <span className="text-[10px] uppercase tracking-wider text-[#D49B00] font-semibold bg-[#D49B00]/10 px-1.5 py-0.5 rounded">
                    Est.
                  </span>
                )}
              </div>

              {/* Stat Label */}
              <h3 className="font-semibold text-base text-[#182230] pt-1">
                {stat.label}
              </h3>

              {/* Stat Description */}
              <p className="text-xs sm:text-[13px] text-[#556070] leading-snug">
                {stat.description}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default StatsStrip;
