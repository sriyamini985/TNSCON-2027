import React, { useState } from 'react';
import { FileCheck, Monitor, ChevronDown, ChevronUp } from 'lucide-react';

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
      <div className={`rounded-xl border border-[#003399]/25 bg-[#FFFDF9] p-4 sm:p-5 text-sm shadow-xs ${className}`}>
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-[#EBF1FA] text-[#003399] flex-shrink-0 mt-0.5 border border-[#003399]/20">
            <FileCheck className="w-5 h-5 text-[#003399]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-[#003399] text-base font-serif">
                Official Abstract Submission Instructions
              </h4>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-xs text-[#003399] hover:text-[#001A4D] font-semibold flex items-center gap-1 underline cursor-pointer"
              >
                {isOpen ? 'Hide Details' : 'Key Guidelines'}
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[#182230] mt-1.5 leading-relaxed text-xs sm:text-sm">
              All research abstracts must be submitted directly through this official portal for peer review by the <strong>TNSCON 2027 Scientific Committee</strong>. Accepted papers and digital e-posters will be officially indexed and scheduled in the scientific conference schedule.
            </p>
            {isOpen && (
              <div className="mt-3 pt-3 border-t border-[#E5DCCB] text-xs text-[#556070] space-y-1.5">
                <p>• <strong>300-Word Limit:</strong> Structured abstract covering Introduction, Methods, Results, and Conclusion.</p>
                <p>• <strong>Mandatory Delegate Registration:</strong> The primary presenting author must register as a conference delegate by 31 January 2027.</p>
                <p>• <strong>Author Notifications:</strong> Formal acceptance notices and session allocation timings will be communicated via registered email.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'eposter') {
    return (
      <div className={`rounded-xl border border-[#D49B00]/40 bg-[#FFFDF9] p-4 sm:p-5 text-sm shadow-xs ${className}`}>
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-[#FFF8E7] text-[#D49B00] flex-shrink-0 mt-0.5 border border-[#D49B00]/30">
            <Monitor className="w-5 h-5 text-[#D49B00]" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-[#003399] text-base font-serif">
              Digital E-Poster Display Specifications
            </h4>
            <p className="text-[#182230] mt-1.5 leading-relaxed text-xs sm:text-sm">
              Accepted e-posters will be showcased on high-definition 42" LCD digital display kiosks at Begumpet Airport. Authors are requested to prepare a single-slide presentation in standard <strong>16:9 widescreen format (1920×1080 resolution, PDF or PowerPoint)</strong>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
