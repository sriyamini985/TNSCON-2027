import React, { useState } from 'react';
import {
  Users,
  Building2,
  CheckCircle2,
  Mail,
  MapPin,
  Search,
  Sparkles
} from 'lucide-react';
import { siteContent } from '../../data/siteContent';

export const CommitteePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const committee = siteContent.organizingCommittee;

  // Filter check for remaining members search
  const matchesSearch = (name: string, role?: string) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return name.toLowerCase().includes(term) || (role && role.toLowerCase().includes(term));
  };

  return (
    <div className="min-h-screen bg-transparent text-[#182230] antialiased">
      
      {/* ========================================================= */}
      {/* HERO BANNER: Academic Medical Prestige                    */}
      {/* ========================================================= */}
      <section className="bg-[#001A4D] text-white py-16 lg:py-20 border-b border-[#003399]/40 text-left relative overflow-hidden">
        {/* Subtle Ambient Radial Glow */}
        <div 
          className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-[#D49B00]/15 blur-3xl pointer-events-none" 
          aria-hidden="true" 
        />
        <div 
          className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-[#003399]/40 blur-3xl pointer-events-none" 
          aria-hidden="true" 
        />

        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl space-y-4">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-[#FFCC00] backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>11th Annual Conference · Telangana Neurosciences Society</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[52px] font-bold text-white tracking-tight leading-[1.1]">
              Organizing Committee
            </h1>

            <p className="text-sm sm:text-base text-[#FAF5ED]/85 leading-relaxed font-light">
              Distinguished clinical leadership, founding patrons, advisory board members, and specialized working committees steering TNSCON 2027 in Hyderabad.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#FAF5ED]/70 pt-2">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#D49B00]" />
                <span>Rajiv Gandhi Terminal, Begumpet Airport, Hyderabad</span>
              </span>
              <span>•</span>
              <span className="font-semibold text-white">12–14 March 2027</span>
            </div>

          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 py-12 lg:py-20 space-y-16 lg:space-y-20">

        {/* ========================================================= */}
        {/* 1. STARTING 4 ORGANIZING COMMITTEE MEMBERS WITH PHOTO HOLDER */}
        {/* ========================================================= */}
        <section className="space-y-8 text-left">
          
          <div className="border-b border-[#E5DCCB] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-[#D49B00] block">
                Conference Leadership
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#182230] mt-1">
                Core Organizing Committee
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#556070] max-w-md">
              Lead office bearers heading scientific evaluation, operations, and secretariat administration.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {committee.coreLeadership.map((leader) => (
              <div
                key={leader.name}
                className="relative overflow-hidden bg-[#FFFDF9] rounded-2xl p-5 border border-[#E5DCCB] shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-[#003399] transition-all duration-200 flex flex-col text-center group"
              >
                {/* Photo Frame */}
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gradient-to-br from-[#001A4D] to-[#003399] border border-[#E5DCCB] shadow-inner flex items-center justify-center mx-auto mb-4 group-hover:scale-[1.01] transition-transform duration-200">
                  {leader.photo ? (
                    <img
                      src={leader.photo}
                      alt={leader.name}
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-[#D49B00]/50 text-[#FFCC00] font-serif text-2xl font-bold flex items-center justify-center shadow-md">
                      {leader.initials}
                    </div>
                  )}
                </div>

                {/* Name */}
                <h3 className="font-serif text-lg font-bold text-[#182230] leading-snug group-hover:text-[#003399] transition-colors">
                  {leader.name}
                </h3>

                {/* Role */}
                <p className="text-xs font-bold text-[#D49B00] uppercase tracking-wider mt-2">
                  {leader.role}
                </p>
                {leader.designation && (
                  <p className="text-xs text-[#556070] mt-0.5 font-medium">
                    {leader.designation}
                  </p>
                )}

              </div>
            ))}
          </div>

          {/* Official Announcement Poster Feature */}
          <div className="bg-[#FFFDF9] p-6 sm:p-8 rounded-2xl border border-[#E5DCCB] shadow-xs flex flex-col md:flex-row items-center gap-8 text-left mt-8">
            <div className="w-full md:w-1/3 max-w-sm mx-auto">
              <img
                src="/assets/images/tnscon_diwali_committee_poster.jpg"
                alt="TNSCON 2027 Official Leadership Announcement"
                className="rounded-xl shadow-md border border-[#E5DCCB] w-full object-contain"
              />
            </div>
            <div className="w-full md:w-2/3 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D49B00] px-3 py-1 rounded-full bg-[#FFF8E7] border border-[#D49B00]/30 inline-block">
                Official Society Confirmation
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#003399]">
                Organising & Scientific Leadership for TNSCON 2027
              </h3>
              <p className="text-xs sm:text-sm text-[#556070] leading-relaxed">
                Confirmed by the Telangana Neurosciences Society executive council for the 11th Annual State Conference scheduled on 12th–14th March 2027 at Begumpet Airport, Hyderabad.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                <div className="p-3 rounded-lg bg-[#FAF5ED] border border-[#E5DCCB]">
                  <strong className="text-[#003399] block font-serif text-sm">Organising Committee</strong>
                  <p className="text-[#182230] mt-1">Dr. R T S Naik (Chairman)</p>
                  <p className="text-[#182230]">Dr. Chandrakanth Tapsi (Secretary)</p>
                  <p className="text-[#182230]">Dr. G. Venu Gopal (Joint Secretary)</p>
                </div>
                <div className="p-3 rounded-lg bg-[#FAF5ED] border border-[#E5DCCB]">
                  <strong className="text-[#003399] block font-serif text-sm">Scientific Committee</strong>
                  <p className="text-[#182230] mt-1">Dr. T V Ramakrishna Murthy (Scientific Chair)</p>
                  <p className="text-[#182230]">Dr. G Subbaiah Choudary (Scientific Chair)</p>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* ========================================================= */}
        {/* QUICK SEARCH FILTER BAR                                   */}
        {/* ========================================================= */}
        <div className="bg-[#FFFDF9] p-4 rounded-xl border border-[#E5DCCB] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-2.5 text-xs text-[#182230] font-semibold">
            <Building2 className="w-4 h-4 text-[#D49B00]" />
            <span>Office Bearers & Sub-Committees</span>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#556070] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search member by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#E5DCCB] focus:outline-none focus:border-[#003399] bg-[#FAF5ED] text-[#182230]"
            />
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. PATRONS & FOUNDER MEMBERS (from official letterhead)     */}
        {/* ========================================================= */}
        <section className="space-y-6 text-left">
          <div className="border-b border-[#E5DCCB] pb-3">
            <span className="text-xs uppercase tracking-widest font-bold text-[#D49B00] block">
              Society Heritage
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#182230] mt-1">
              Patrons & Founder Members
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {committee.founderMembers
              .filter((m) => matchesSearch(m.name, m.designation))
              .map((member) => (
                <div
                  key={member.name}
                  className="bg-[#FFFDF9] p-5 rounded-xl border border-[#E5DCCB] shadow-2xs hover:border-[#003399] transition-all flex flex-col"
                >
                  <div className="space-y-2">
                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-[#D49B00] shadow-sm flex items-center justify-center bg-[#FAF5ED]">
                      {(member as any).photo ? (
                        <img src={(member as any).photo} alt={member.name} className="w-full h-full object-cover object-center" />
                      ) : (
                        <span className="font-serif font-bold text-sm text-[#003399]">
                          {member.name.split(' ').slice(-1)[0][0]}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#D49B00] block">
                      {member.designation}
                    </span>
                    <h4 className="font-serif font-bold text-[#182230] text-base leading-snug">
                      {member.name}
                    </h4>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 3. ADVISORS & PAST LEADERSHIP (from official letterhead)  */}
        {/* ========================================================= */}
        <section className="space-y-6 text-left">
          <div className="border-b border-[#E5DCCB] pb-3">
            <span className="text-xs uppercase tracking-widest font-bold text-[#D49B00] block">
              Advisory Board
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#182230] mt-1">
              Advisors & Immediate Past President
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {committee.advisors
              .filter((m) => matchesSearch(m.name, m.designation))
              .map((adv) => (
                <div
                  key={adv.name}
                  className="bg-[#FFFDF9] p-6 rounded-2xl border border-[#E5DCCB] shadow-xs hover:border-[#003399] transition-all flex items-start gap-4"
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-[#D49B00] shadow-sm flex-shrink-0 flex items-center justify-center bg-[#001A4D]">
                    {(adv as any).photo ? (
                      <img src={(adv as any).photo} alt={adv.name} className="w-full h-full object-cover object-center" />
                    ) : (
                      <span className="font-serif font-bold text-lg text-[#FFCC00]">
                        {adv.name.split(' ').slice(-1)[0][0]}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#D49B00] px-2 py-0.5 rounded bg-[#D49B00]/10">
                      {adv.designation}
                    </span>
                    <h4 className="font-serif font-bold text-[#182230] text-lg pt-1">
                      {adv.name}
                    </h4>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4. OFFICE BEARERS & EX-OFFICIO MEMBERS (letterhead)       */}
        {/* ========================================================= */}
        <section className="space-y-6 text-left">
          <div className="border-b border-[#E5DCCB] pb-3">
            <span className="text-xs uppercase tracking-widest font-bold text-[#D49B00] block">
              Society Governance
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#182230] mt-1">
              Executive Office Bearers & Ex-Officio Members
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {committee.officeBearers
              .filter((m) => matchesSearch(m.name, m.role))
              .map((ob) => (
                <div
                  key={ob.name}
                  className="bg-[#FFFDF9] p-5 rounded-xl border border-[#E5DCCB] shadow-2xs hover:border-[#003399] transition-all flex flex-col"
                >
                  <div className="space-y-1.5">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#D49B00] shadow-sm mb-2 flex items-center justify-center bg-[#FAF5ED]">
                      {(ob as any).photo ? (
                        <img src={(ob as any).photo} alt={ob.name} className="w-full h-full object-cover object-center" />
                      ) : (
                        <span className="font-serif font-bold text-sm text-[#003399]">
                          {ob.name.split(' ').slice(-1)[0][0]}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#003399] px-2 py-0.5 rounded bg-[#FAF5ED] border border-[#E5DCCB] inline-block">
                      {ob.role}
                    </span>
                    <h4 className="font-serif font-bold text-[#182230] text-base leading-snug pt-1">
                      {ob.name}
                    </h4>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 5. EXECUTIVE COUNCIL MEMBERS (from official letterhead)   */}
        {/* ========================================================= */}
        <section className="space-y-6 text-left">
          <div className="border-b border-[#E5DCCB] pb-3">
            <span className="text-xs uppercase tracking-widest font-bold text-[#D49B00] block">
              Council
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#182230] mt-1">
              Executive Committee Members
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {committee.executiveMembers
              .filter((m) => matchesSearch(m.name, m.designation))
              .map((exec) => (
                <div
                  key={exec.name}
                  className="bg-[#FFFDF9] p-5 rounded-xl border border-[#E5DCCB] shadow-2xs hover:border-[#003399] transition-all flex items-center gap-3.5"
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden border border-[#D49B00] shadow-sm text-[#003399] flex items-center justify-center font-bold text-sm flex-shrink-0 bg-[#FAF5ED]">
                    {(exec as any).photo ? (
                      <img src={(exec as any).photo} alt={exec.name} className="w-full h-full object-cover object-center" />
                    ) : (
                      <span className="font-serif font-bold text-sm text-[#003399]">
                        {exec.name.replace(/^(Dr\.|Prof\.)\s*/, '').split(' ').filter(Boolean).map((n: string) => n[0]).slice(0, 2).join('')}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-serif font-bold text-[#182230] text-sm truncate">
                      {exec.name}
                    </h4>
                    <p className="text-[11px] text-[#556070]">
                      {exec.designation}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 6. CONFERENCE WORKING SUB-COMMITTEES (Reference Structure)*/}
        {/* ========================================================= */}
        <section className="space-y-6 text-left">
          <div className="border-b border-[#E5DCCB] pb-3">
            <span className="text-xs uppercase tracking-widest font-bold text-[#D49B00] block">
              Conference Operations
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#182230] mt-1">
              Conference Working Sub-Committees
            </h2>
            <p className="text-xs text-[#556070] mt-1">
              Modeled after the national IANCON congress committee governance framework.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {committee.subCommittees.map((sub) => (
              <div
                key={sub.committeeName}
                className="bg-[#FFFDF9] rounded-2xl p-6 border border-[#E5DCCB] shadow-xs space-y-4 text-left"
              >
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#E5DCCB]">
                  <div className="w-8 h-8 rounded-lg bg-[#001A4D] text-[#FFCC00] flex items-center justify-center font-bold">
                    <Users className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#182230]">
                    {sub.committeeName}
                  </h3>
                </div>

                {/* Chairpersons */}
                <div className="space-y-1">
                  <span className="text-[10.5px] uppercase font-bold tracking-wider text-[#D49B00] block">
                    Chairpersons
                  </span>
                  <div className="flex flex-wrap gap-2 pt-0.5">
                    {sub.chairpersons.map((c) => (
                      <span
                        key={c}
                        className="text-xs font-semibold text-[#003399] bg-[#FAF5ED] border border-[#E5DCCB] px-2.5 py-1 rounded-md"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Co-Chairpersons */}
                {sub.coChairpersons.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10.5px] uppercase font-bold tracking-wider text-[#556070] block">
                      Co-Chairpersons
                    </span>
                    <div className="flex flex-wrap gap-2 pt-0.5">
                      {sub.coChairpersons.map((cc) => (
                        <span
                          key={cc}
                          className="text-xs font-medium text-[#556070] bg-[#FAF5ED] border border-[#E5DCCB] px-2 py-0.5 rounded"
                        >
                          {cc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Committee Members */}
                <div className="space-y-1 pt-2 border-t border-[#E5DCCB]">
                  <span className="text-[10.5px] uppercase font-bold tracking-wider text-[#556070] block">
                    Committee Members
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {sub.members.map((m) => (
                      <span key={m} className="text-xs text-[#182230] bg-[#FAF5ED] px-2 py-0.5 rounded border border-[#E5DCCB]/60">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </section>

        {/* Secretariat Transparency Note */}
        <div className="bg-[#FFFDF9] p-6 rounded-2xl border border-[#E5DCCB] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#556070] text-left">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <strong className="text-[#182230] block font-serif text-sm">Official Secretariat Verification</strong>
              <span>
                All organizing appointments are confirmed from the official letterhead of the Telangana Neurosciences Society (#3-4-1, 3rd Floor, SKS Neuro, Hyderabad).
              </span>
            </div>
          </div>
          <a
            href="mailto:secretariat@tnscon2027hyd.com"
            className="flex-shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-[#003399] hover:text-[#D49B00] underline underline-offset-4"
          >
            <Mail className="w-3.5 h-3.5 text-[#D49B00]" />
            <span>Contact Secretariat</span>
          </a>
        </div>

      </main>

    </div>
  );
};

export default CommitteePage;
