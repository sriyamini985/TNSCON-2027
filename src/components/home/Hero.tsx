import React from 'react';
import { Calendar, MapPin, Landmark, Clock } from 'lucide-react';
import { InteractiveHoverButton } from '../ui/InteractiveHoverButton';
import { siteContent } from '../../data/siteContent';

interface HeroProps {
  onOpenCountdown?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenCountdown }) => {
  return (
    <section className="relative overflow-hidden bg-[#FAF5ED] pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-[#E5DCCB] min-h-[85vh] flex items-center">
      
      {/* ========================================================= */}
      {/* High-Resolution Illustrated Background: Glowing Brain & Charminar */}
      {/* ========================================================= */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <img
          src="/assets/images/home_hero_bg_hd.jpg"
          alt="TNSCON 2027 Neural Atlas and Hyderabad Heritage Background"
          className="w-full h-full object-cover object-right md:object-center lg:object-right-top opacity-90 transition-opacity duration-300"
        />
        {/* Mobile & Desktop Content-Aware Scrim: 
            Vertical subtle scrim on mobile protects full-width text, horizontal scrim on desktop leaves Charminar/Brain vibrant */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF5ED]/95 via-[#FAF5ED]/85 to-[#FAF5ED]/50 md:bg-gradient-to-r md:from-[#FAF5ED]/95 md:via-[#FAF5ED]/75 md:to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#FAF5ED] via-[#FAF5ED]/60 to-transparent" />
      </div>

      <div className="max-w-[1240px] mx-auto px-6 w-full relative z-10">
        <div className="max-w-2xl lg:max-w-3xl space-y-6 text-left">
          
          {/* Top Pill Badges Row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Society Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFDF9]/95 backdrop-blur-xs border border-[#E5DCCB] text-xs font-semibold text-[#182230] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#D49B00] flex-shrink-0" />
              <span>11th Annual Conference · Telangana Neurosciences Society</span>
            </div>

            {/* Interactive Countdown Trigger Pill */}
            {onOpenCountdown && (
              <button
                onClick={onOpenCountdown}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#003399] text-white hover:bg-[#002266] text-xs font-semibold shadow-xs transition-all duration-200 hover:scale-105 cursor-pointer border border-[#D49B00]/60"
              >
                <Clock className="w-3.5 h-3.5 text-[#FFCC00]" />
                <span>Open Countdown Popup</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFCC00] animate-pulse" />
              </button>
            )}
          </div>

          {/* H1 Headline: "TNSCON" in navy + "2027" in gold italic serif */}
          <div className="space-y-3">
            <h1 
              className="font-bold text-[#003399] tracking-tight leading-[1.05]"
              style={{ fontSize: 'clamp(2.15rem, 6.5vw, 4.5rem)' }}
            >
              TNSCON <span className="font-serif italic font-normal text-[#D49B00]">2027</span>
            </h1>

            {/* Tagline: Serif Italic (24–28px) */}
            <p className="font-serif italic text-xl sm:text-2xl lg:text-[30px] text-[#182230]/95 font-light leading-snug">
              “{siteContent.conference.tagline}”
            </p>
          </div>

          {/* One-Line Supporting Text */}
          <p className="text-[#556070] text-sm sm:text-base lg:text-[18px] leading-relaxed max-w-2xl font-normal">
            {siteContent.conference.heroDescription}
          </p>

          {/* Key Facts Row: 3 Cleanly Aligned Items with Icons */}
          <div className="pt-3 pb-3 border-y border-[#003399]/20 bg-[#FFFDF9]/85 backdrop-blur-xs rounded-xl px-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left shadow-xs">
            {/* Date */}
            <div className="flex items-start gap-2.5">
              <Calendar className="w-5 h-5 text-[#D49B00] flex-shrink-0 mt-0.5" />
              <div>
                <span className="block text-xs uppercase tracking-wider text-[#556070] font-medium">Dates</span>
                <strong className="block text-sm font-semibold text-[#182230]">12–14 March 2027</strong>
              </div>
            </div>

            {/* City */}
            <div className="flex items-start gap-2.5">
              <MapPin className="w-5 h-5 text-[#D49B00] flex-shrink-0 mt-0.5" />
              <div>
                <span className="block text-xs uppercase tracking-wider text-[#556070] font-medium">Location</span>
                <strong className="block text-sm font-semibold text-[#182230]">Hyderabad, Telangana</strong>
              </div>
            </div>

            {/* Venue */}
            <div className="flex items-start gap-2.5">
              <Landmark className="w-5 h-5 text-[#D49B00] flex-shrink-0 mt-0.5" />
              <div>
                <span className="block text-xs uppercase tracking-wider text-[#556070] font-medium">Conference Venue</span>
                <strong className="block text-xs font-semibold text-[#182230] leading-snug line-clamp-2">
                  Rajiv Gandhi Terminal, Begumpet Airport
                </strong>
              </div>
            </div>
          </div>

          {/* CTA Buttons (Interactive Hover Animation, responsive stacked on mobile) */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            {/* Primary CTA: Official Blue Hover Expansion */}
            <InteractiveHoverButton
              to="/registration"
              text="Register as Delegate"
              variant="blue"
              className="py-3.5 px-7 text-base shadow-sm w-full sm:w-auto"
            />

            {/* Secondary CTA: Official Gold Hover Expansion */}
            <InteractiveHoverButton
              to="/abstract-submission"
              text="Submit Abstract"
              variant="gold"
              className="py-3.5 px-6 text-base shadow-sm w-full sm:w-auto"
            />
          </div>

          {/* Urgency Subtext with Gold Dot */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-[#556070] font-medium pt-1">
            <span className="w-2 h-2 rounded-full bg-[#D49B00] animate-pulse flex-shrink-0" />
            <span>{siteContent.conference.abstractUrgency}</span>
          </div>

        </div>
      </div>

    </section>
  );
};

export default Hero;
