import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Calendar, Phone, ArrowRight } from 'lucide-react';
import { siteContent } from '../../data/siteContent';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#001A4D] text-[#FAF5ED] border-t border-[#003399]/40">
      
      {/* Top Gold Accent Line */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[#D49B00] to-transparent" aria-hidden="true" />

      <div className="max-w-[1240px] mx-auto px-6 py-16 lg:py-20 text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* ========================================================= */}
          {/* Column 1: TNSCON 2027 Brand & Event Metadata (3.5 cols)    */}
          {/* ========================================================= */}
          <div className="lg:col-span-3 space-y-5">
            <Link to="/" className="inline-flex items-center gap-3.5 group" aria-label="TNSCON 2027 Home">
              <img
                src="/assets/images/tnscon_logo_white.png"
                alt="TNSCON 2027 Logo"
                className="h-14 sm:h-16 w-auto object-contain filter drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
              />
              <div>
                <span className="font-bold text-[#FAF5ED] text-lg sm:text-xl block leading-tight">
                  TNSCON 2027
                </span>
                <span className="text-[11px] uppercase tracking-wider text-[#FFCC00] block font-semibold mt-0.5">
                  Telangana Neurosciences Society
                </span>
              </div>
            </Link>

            <div className="space-y-2.5 text-xs sm:text-[13px] text-[#FAF5ED]/80 pt-1">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#D49B00] flex-shrink-0" />
                <strong className="text-[#FAF5ED]">12th – 14th March 2027</strong>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D49B00] flex-shrink-0 mt-0.5" />
                <span className="leading-snug">
                  Conference Hall, Rajiv Gandhi Terminal, Begumpet Airport, Hyderabad
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs text-[#FAF5ED]/60">
              <Link
                to="/venue"
                className="hover:text-[#FFCC00] transition-colors inline-flex items-center gap-1 underline underline-offset-4"
              >
                <span>Venue Guide</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <span>•</span>
              <Link
                to="/admin"
                className="hover:text-[#FFCC00] transition-colors inline-flex items-center gap-1"
              >
                <span>Admin Portal</span>
              </Link>
              <span>•</span>
              <Link
                to="/abstract-viewer"
                className="hover:text-[#FFCC00] transition-colors inline-flex items-center gap-1"
              >
                <span>Abstract Viewer (Public)</span>
              </Link>
            </div>
          </div>

          {/* ========================================================= */}
          {/* Column 2: Leadership & Organizing Core (3 cols)          */}
          {/* ========================================================= */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-serif text-base font-bold text-[#FAF5ED] tracking-wide border-b border-[#FAF5ED]/15 pb-2">
              Conference Leadership
            </h4>

            <div className="space-y-3 text-xs sm:text-[13px] text-[#FAF5ED]/80 leading-snug">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#FFCC00] block">
                  Organizing Chairman
                </span>
                <strong className="text-[#FAF5ED] text-sm block">Dr. R.T.S. Naik</strong>
                <span className="text-[#FAF5ED]/60 text-[11px]">Senior Consultant Neurosurgeon</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#FFCC00] block">
                  Organizing Secretary
                </span>
                <strong className="text-[#FAF5ED] text-sm block">Dr. Chandrakanth Tapsi</strong>
                <span className="text-[#FAF5ED]/60 text-[11px]">Consultant Neurophysician</span>
              </div>

              <div className="pt-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#FFCC00] block">
                  Scientific Committee Leads
                </span>
                <p className="text-[#FAF5ED]/90 text-xs">
                  Dr. N. Pratap Kumar <span className="text-[#FAF5ED]/50">(Neurosurgery)</span>
                </p>
                <p className="text-[#FAF5ED]/90 text-xs">
                  Dr. G.V. Subbaiah Choudary <span className="text-[#FAF5ED]/50">(Neurology)</span>
                </p>
              </div>

              <div className="pt-1">
                <Link
                  to="/committee"
                  className="text-xs font-semibold text-[#FFCC00] hover:text-[#FAF5ED] inline-flex items-center gap-1 underline underline-offset-4"
                >
                  <span>View Full Committee Directory</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* Column 3: Secretariat & Corresponding Address (3 cols)    */}
          {/* ========================================================= */}
          <div className="lg:col-span-3 space-y-4">
            <div>
              <h4 className="font-serif text-base font-bold text-[#FAF5ED] tracking-wide border-b border-[#FAF5ED]/15 pb-2">
                Secretariat
              </h4>
              <span className="text-[10px] uppercase font-bold tracking-[0.12em] text-[#FFCC00] block mt-2">
                Corresponding Address
              </span>
            </div>

            <div className="space-y-2.5 text-xs sm:text-[13px] text-[#FAF5ED]/80 leading-relaxed">
              <div>
                <strong className="text-[#FAF5ED] text-sm block">Dr. Chandrakanth Tapsi</strong>
                <span className="text-[#FAF5ED]/70 block">Telangana Neurosciences Society</span>
                <span className="text-[#FAF5ED]/60 text-xs block">
                  # 3-4-1, 3rd Floor, SKS Neuro, Chapel Road, Hyderabad, 500001
                </span>
              </div>

              <div className="pt-2 border-t border-[#FAF5ED]/10 space-y-1.5">
                <a
                  href="tel:+919492759745"
                  className="flex items-center gap-2 text-[#FAF5ED] hover:text-[#FFCC00] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#D49B00] flex-shrink-0" />
                  <span>+91-94927 59745</span>
                </a>

                <a
                  href="mailto:secretariat@tnscon2027hyd.com"
                  className="flex items-center gap-2 text-[#FAF5ED] hover:text-[#FFCC00] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#D49B00] flex-shrink-0" />
                  <span className="truncate">secretariat@tnscon2027hyd.com</span>
                </a>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* Column 4: Conference Manager (CMC Details) (3 cols)       */}
          {/* ========================================================= */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-serif text-base font-bold text-[#FAF5ED] tracking-wide border-b border-[#FAF5ED]/15 pb-2">
              Conference Manager
            </h4>

            {/* CMC Logo (Transparent, enlarged) */}
            <div className="pt-0.5">
              <img
                src="/assets/images/cmc_logo_transparent.png"
                alt="CMC — Conference Management Company"
                className="h-10 sm:h-12 w-auto object-contain filter drop-shadow-sm"
              />
            </div>

            <div className="space-y-2 text-xs sm:text-[13px] text-[#FAF5ED]/80 leading-relaxed">
              <span className="text-[10.5px] uppercase font-bold tracking-wider text-[#FFCC00] block">
                CMC - Conference Management Company
              </span>

              <div>
                <strong className="text-[#FAF5ED] text-sm block">Mr. Kiran Kumar Lella</strong>
                <span className="text-[#FAF5ED]/60 text-xs block">Conference Manager</span>
              </div>

              <div className="pt-2 border-t border-[#FAF5ED]/10 space-y-1.5">
                <a
                  href="tel:+919676541985"
                  className="flex items-center gap-2 text-[#FAF5ED] hover:text-[#FFCC00] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#D49B00] flex-shrink-0" />
                  <span>+91-96765 41985</span>
                </a>

                <a
                  href="mailto:kiran@cmchyd.com"
                  className="flex items-center gap-2 text-[#FAF5ED] hover:text-[#FFCC00] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#D49B00] flex-shrink-0" />
                  <span>kiran@cmchyd.com</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Strip */}
        <div className="mt-14 pt-8 border-t border-[#FAF5ED]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF5ED]/60">
          <p>© 2027 Telangana Neurosciences Society. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>11th Annual Conference</span>
            <span>•</span>
            <span>Managed by CMC</span>
            <span>•</span>
            <span>Hyderabad, Telangana</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
