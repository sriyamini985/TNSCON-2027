import React from 'react';
import { Link } from 'react-router-dom';

interface BrandLogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'dark',
  size = 'md',
  showSubtitle = true,
  className = ''
}) => {
  const isLight = variant === 'light';
  const subtitleColor = isLight ? 'text-[#FAF5ED]/85' : 'text-[#556070]';

  // Specific height scales matching the official logo aspect ratio (1024x428, ~2.39:1)
  const logoHeights = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-11',
    lg: 'h-13 sm:h-15'
  };

  return (
    <Link to="/" className={`inline-flex flex-col text-left group ${className}`}>
      {/* Official TNSCON 2027 Uploaded Logo */}
      <div className="flex items-center">
        {isLight ? (
          // Crisp, high-contrast container for dark footers/headers
          <div className="bg-white/95 hover:bg-white px-2.5 py-1.5 rounded-lg shadow-xs transition-all duration-300 group-hover:shadow-sm">
            <img
              src="/assets/images/tnscon_logo.png"
              alt="TNSCON 2027 — Telangana Neurosciences Society Official Logo"
              className={`${logoHeights[size]} w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]`}
            />
          </div>
        ) : (
          // Transparent natural rendering for light backgrounds (Navbar, etc.)
          <img
            src="/assets/images/tnscon_logo.png"
            alt="TNSCON 2027 — Telangana Neurosciences Society Official Logo"
            className={`${logoHeights[size]} w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02] drop-shadow-xs`}
          />
        )}
      </div>

      {showSubtitle && (
        <span className={`text-[10px] uppercase tracking-wider font-semibold ${subtitleColor} mt-1 line-clamp-1`}>
          Telangana Neurosciences Society
        </span>
      )}
    </Link>
  );
};
