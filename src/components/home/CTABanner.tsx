import React from 'react';
import { Calendar, MapPin, Sparkles } from 'lucide-react';
import { InteractiveHoverButton } from '../ui/InteractiveHoverButton';
import { siteContent } from '../../data/siteContent';

export const CTABanner: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-[#001A4D] py-20 lg:py-24 text-white text-center">
      
      {/* Decorative Gold Accent Gradient Lines */}
      <div 
        className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#D49B00] to-transparent" 
        aria-hidden="true" 
      />
      <div 
        className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#003399]/40 blur-3xl pointer-events-none" 
        aria-hidden="true" 
      />
      <div 
        className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-[#D49B00]/10 blur-3xl pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="max-w-[1240px] mx-auto px-6 relative z-10 space-y-8">
        
        {/* Pill Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-[#FFCC00] backdrop-blur-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Delegate Registrations & Abstract Portal Active</span>
        </div>

        {/* Title */}
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight max-w-3xl mx-auto leading-tight">
          {siteContent.ctaBanner.heading}
        </h2>

        {/* Subtitle */}
        <p className="text-[#FAF5ED]/85 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-light">
          {siteContent.ctaBanner.subheading}
        </p>

        {/* Metadata Details Strip */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-[#FAF5ED]/70 pt-2 pb-2">
          <span className="flex items-center gap-1.5 font-medium">
            <Calendar className="w-4 h-4 text-[#D49B00]" />
            <strong className="text-white">12–14 March 2027</strong>
          </span>
          <span className="hidden sm:inline text-white/30">•</span>
          <span className="flex items-center gap-1.5 font-medium">
            <MapPin className="w-4 h-4 text-[#D49B00]" />
            <span>Rajiv Gandhi Terminal, Begumpet Airport, Hyderabad</span>
          </span>
        </div>

        {/* Action Buttons (Interactive Hover Animation, responsive stacked on mobile) */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
          {/* Register Button: Gold Accent Expansion */}
          <InteractiveHoverButton
            to={siteContent.ctaBanner.primaryButton.path}
            text={siteContent.ctaBanner.primaryButton.label}
            variant="gold"
            className="py-3.5 px-8 text-base shadow-md w-full sm:w-auto"
          />

          {/* Submit Abstract Button: Dark / Frosted Expansion */}
          <InteractiveHoverButton
            to={siteContent.ctaBanner.secondaryButton.path}
            text={siteContent.ctaBanner.secondaryButton.label}
            variant="dark"
            className="py-3.5 px-7 text-base w-full sm:w-auto"
          />
        </div>

      </div>

    </section>
  );
};

export default CTABanner;
