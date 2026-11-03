import React from 'react';
import { Brain, Activity, Layers, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { siteContent, FocusAreaItem } from '../../data/siteContent';

const iconMap = {
  Brain,
  Activity,
  Layers,
  Sparkles,
};

export const FocusAreas: React.FC = () => {
  return (
    <section className="bg-[#F2EAE0] py-20 lg:py-28 border-b border-[#E5DCCB]">
      <div className="max-w-[1240px] mx-auto px-6 text-left">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFDF9] border border-[#E5DCCB] text-xs font-semibold text-[#182230] shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D49B00]" />
              <span className="uppercase tracking-wider">Academic Curriculum</span>
            </div>
            
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] text-[#182230] font-bold tracking-tight leading-tight">
              Scientific Focus Areas
            </h2>
            
            <p className="text-[#556070] text-base lg:text-[17px] leading-relaxed">
              Curated by the Scientific Committee to bridge cutting-edge clinical neuroscience with surgical mastery, translational research, and practical evidence-based protocols.
            </p>
          </div>

          <Link
            to="/committee"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#003399] hover:text-[#002266] underline decoration-[#D49B00] underline-offset-4 flex-shrink-0"
          >
            <span>View Organizing Committee</span>
            <ArrowRight className="w-4 h-4 text-[#D49B00]" />
          </Link>
        </div>

        {/* 4-Card Grid with Gentle Hover Lift */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {siteContent.focusAreas.map((area: FocusAreaItem) => {
            const IconComponent = iconMap[area.iconName] || Brain;

            return (
              <div
                key={area.id}
                className="bg-[#FFFDF9] rounded-2xl p-7 border border-[#E5DCCB] shadow-[0_4px_20px_-2px_rgba(0,51,153,0.04)] hover:-translate-y-1.5 hover:shadow-[0_12px_32px_-4px_rgba(0,51,153,0.08)] hover:border-[#003399] transition-all duration-200 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  
                  {/* Icon Container */}
                  <div className="w-12 h-12 rounded-xl bg-[#FAF5ED] border border-[#E5DCCB] text-[#003399] flex items-center justify-center group-hover:bg-[#003399] group-hover:text-white transition-colors duration-200 shadow-2xs">
                    <IconComponent className="w-6 h-6" />
                  </div>

                  {/* Subtitle */}
                  <span className="text-[11px] uppercase tracking-wider text-[#D49B00] font-semibold block">
                    {area.subtitle}
                  </span>

                  {/* Title */}
                  <h3 className="font-serif text-xl font-bold text-[#182230] leading-snug">
                    {area.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-[13px] text-[#556070] leading-relaxed">
                    {area.description}
                  </p>
                </div>

                {/* Highlights List */}
                <div className="pt-6 mt-6 border-t border-[#E5DCCB] space-y-1.5">
                  {area.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-[#556070]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D49B00] flex-shrink-0" />
                      <span className="truncate">{h}</span>
                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FocusAreas;
