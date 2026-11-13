import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';
import { siteContent, TimelineDateItem } from '../../data/siteContent';

export const ImportantDates: React.FC = () => {
  return (
    <section className="bg-[#FAF5ED] py-20 lg:py-28 border-b border-[#E5DCCB]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 text-left">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFDF9] border border-[#E5DCCB] text-xs font-semibold text-[#182230]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D49B00]" />
            <span className="uppercase tracking-wider">Milestones & Cut-Offs</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] text-[#182230] font-bold tracking-tight">
            Important Conference Dates
          </h2>

          <p className="text-[#556070] text-base lg:text-[17px] leading-relaxed">
            All cut-offs are strictly observed by the Scientific Committee to enable rigorous blinded peer review and schedule finalization.
          </p>
        </div>

        {/* Timeline: Horizontal on Desktop (grid lg:grid-cols-4), Vertical on Mobile */}
        <div className="relative">
          
          {/* Connecting Line (Desktop) */}
          <div 
            className="hidden lg:block absolute top-[28px] left-[10%] right-[10%] h-[2px] bg-[#E5DCCB] z-0" 
            aria-hidden="true" 
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6 relative z-10">
            {siteContent.importantDates.map((item: TimelineDateItem, idx) => {
              const isConfirmed = item.status === 'Confirmed';

              return (
                <div
                  key={item.title}
                  className="bg-[#FFFDF9] rounded-2xl p-6 border border-[#E5DCCB] shadow-xs flex flex-col justify-between hover:border-[#003399] transition-colors duration-200 text-left relative"
                >
                  <div>
                    {/* Node Dot / Status Header */}
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E5DCCB]">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            isConfirmed
                              ? 'border-[#003399] bg-[#003399]'
                              : 'border-[#D49B00] bg-[#D49B00]'
                          }`}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        </div>
                        <span className="text-xs font-mono font-semibold text-[#556070]">
                          Step 0{idx + 1}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded ${
                          isConfirmed
                            ? 'bg-[#003399] text-white'
                            : item.status === 'Open'
                            ? 'bg-[#D49B00]/15 text-[#B88500]'
                            : 'bg-[#FAF5ED] text-[#556070]'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    {/* Milestone Date */}
                    <div className="space-y-1">
                      <span className="font-serif text-2xl font-bold text-[#003399] block leading-tight">
                        {item.date}
                      </span>
                      <h3 className="font-semibold text-sm text-[#182230] pt-1">
                        {item.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-[#556070] mt-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Indicator Footer */}
                  <div className="pt-4 mt-4 border-t border-[#E5DCCB] flex items-center gap-1.5 text-[11px] text-[#556070]">
                    {isConfirmed ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#003399]" />
                        <span>Officially Scheduled</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5 text-[#D49B00]" />
                        <span>Action Required</span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};

export default ImportantDates;
