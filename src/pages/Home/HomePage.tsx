import React, { useState, useEffect } from 'react';
import { Hero } from '../../components/home/Hero';
import { StatsStrip } from '../../components/home/StatsStrip';
import { FocusAreas } from '../../components/home/FocusAreas';
import { ImportantDates } from '../../components/home/ImportantDates';
import { CTABanner } from '../../components/home/CTABanner';
import { CountdownModal } from '../../components/ui/CountdownModal';
import { CountdownFloatingToggle } from '../../components/ui/CountdownFloatingToggle';

export const HomePage: React.FC = () => {
  const [isCountdownOpen, setIsCountdownOpen] = useState(false);

  // Automatically popup when the website is opened
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCountdownOpen(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF5ED] text-[#182230] antialiased">
      {/* SECTION A: HERO EXPERIENCE (Unobstructed Neural Brain & Charminar Artwork) */}
      <Hero onOpenCountdown={() => setIsCountdownOpen(true)} />

      {/* SECTION B: HIGHLIGHT STRIP */}
      <StatsStrip />

      {/* SECTION C: SCIENTIFIC FOCUS AREAS */}
      <FocusAreas />

      {/* SECTION D: IMPORTANT DATES TIMELINE */}
      <ImportantDates />

      {/* SECTION E: CALL TO ACTION BANNER */}
      <CTABanner />

      {/* Floating Toggle Button (Always accessible in bottom right) */}
      <CountdownFloatingToggle onOpen={() => setIsCountdownOpen(true)} />

      {/* Countdown & Academic Conclave Popup Modal */}
      <CountdownModal 
        isOpen={isCountdownOpen} 
        onClose={() => setIsCountdownOpen(false)} 
      />
    </div>
  );
};

export default HomePage;
