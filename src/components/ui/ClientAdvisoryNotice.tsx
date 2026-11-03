import React, { useState } from 'react';
import { AlertTriangle, Info, ChevronDown, ChevronUp } from 'lucide-react';

interface ClientAdvisoryNoticeProps {
  type?: 'abstract' | 'eposter' | 'general';
  className?: string;
}

export const ClientAdvisoryNotice: React.FC<ClientAdvisoryNoticeProps> = ({
  type = 'abstract',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (type === 'abstract') {
    return (
      <div className={`rounded-xl border border-[#D49B00]/50 bg-[#FFFDF9] p-4 sm:p-5 text-sm shadow-xs ${className}`}>
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-[#EBF1FA] text-[#003399] flex-shrink-0 mt-0.5 border border-[#003399]/20">
            <Info className="w-5 h-5 text-[#003399]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-[#003399] text-base font-serif">
                Submission Portal Notice & Academic Transparency
              </h4>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-xs text-[#003399] hover:text-[#001A4D] font-semibold flex items-center gap-1 underline cursor-pointer"
              >
                {isOpen ? 'Show Less' : 'Details'}
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[#182230] mt-1.5 leading-relaxed text-xs sm:text-sm">
              <strong>Official Note:</strong> The supplied draft guidelines contain an external reference to <em>NEUROVASCON 2026</em>. As instructed by conference leadership, TNSCON 2027 provides a direct, dedicated submission system on this official website (<span className="text-[#003399] font-semibold">tnscon2027hyd.com</span>). Submissions are recorded directly in the Telangana Neurosciences Society secretariat database.
            </p>
            {isOpen && (
              <div className="mt-3 pt-3 border-t border-[#E5DCCB] text-xs text-[#556070] space-y-1.5">
                <p>• <strong>Strict 250-Word Limit:</strong> Automatically validated during drafting.</p>
                <p>• <strong>Presenter Registration Requirement:</strong> All presenting authors must register as delegates by 31 January 2027.</p>
                <p>• <strong>Configurable Target:</strong> The scientific committee can redirect or synchronize abstract routing anytime via the admin control panel.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'eposter') {
    return (
      <div className={`rounded-xl border border-[#003399]/30 bg-[#FFFDF9] p-4 sm:p-5 text-sm shadow-xs ${className}`}>
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-[#EBF1FA] text-[#003399] flex-shrink-0 mt-0.5 border border-[#003399]/20">
            <AlertTriangle className="w-5 h-5 text-[#003399]" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-[#003399] text-base font-serif">
              E-Poster Aspect Ratio & Orientation Notice
            </h4>
            <p className="text-[#182230] mt-1.5 leading-relaxed text-xs sm:text-sm">
              <strong>Orientation Specification:</strong> Standard LCD conference displays feature a <strong>16:9 ratio</strong>. Preliminary guidelines recommend single-slide portrait orientation. Authors may prepare slides in standard 16:9 (1920×1080) or portrait format; final display configuration will be confirmed prior to on-site upload at the Begumpet preview room.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
