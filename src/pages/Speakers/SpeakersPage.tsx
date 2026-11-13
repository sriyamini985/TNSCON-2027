import React from 'react';
import { AlertCircle } from 'lucide-react';
import { leadershipData } from '../../data/conferenceData';

export const SpeakersPage: React.FC = () => {
  // Confirmed Organizing Leaders
  const confirmedLeaders = [
    {
      name: leadershipData.organizingChairman.name,
      role: 'Organising Chairman',
      specialty: 'Neurosurgery',
      designation: leadershipData.organizingChairman.designation,
      institution: 'Telangana Neurosciences Society',
      session: 'Presidential Address & Masterclass in Skull Base Surgery',
      initials: 'RN',
      isConfirmed: true
    },
    {
      name: leadershipData.organizingSecretary.name,
      role: 'Organising Secretary',
      specialty: 'Neurology',
      designation: leadershipData.organizingSecretary.designation,
      institution: 'Telangana Neurosciences Society',
      session: 'Acute Stroke Interventions & Telestroke Networks in Telangana',
      initials: 'CT',
      isConfirmed: true
    },
    {
      name: 'Dr. N Pratap Kumar',
      role: 'Scientific Committee — Neurosurgery',
      specialty: 'Neurosurgery',
      designation: 'Consultant Neurosurgeon',
      institution: 'Telangana Neurosciences Society',
      session: 'Minimally Invasive Spinal Stabilization & Deformity Correction',
      initials: 'PK',
      isConfirmed: true
    },
    {
      name: 'Dr. Subbaiah Choudary',
      role: 'Scientific Committee — Neurology',
      specialty: 'Neurology',
      designation: 'Consultant Neurophysician',
      institution: 'Telangana Neurosciences Society',
      session: 'Advances in Monoclonal Antibodies for Refractory Neuroimmunology',
      initials: 'SC',
      isConfirmed: true
    }
  ];

  // Placeholder Guest Faculty slots
  const placeholderFaculty = [
    {
      name: 'National Guest Faculty 1',
      role: 'Invited Keynote Speaker',
      specialty: 'Neurosurgery',
      designation: 'Professor & Head of Neurosurgery',
      institution: 'National Medical Center (TBA)',
      session: 'Endoscopic Transorbital & Transcranial Approaches',
      initials: 'NF1',
      isConfirmed: false
    },
    {
      name: 'National Guest Faculty 2',
      role: 'Invited Keynote Speaker',
      specialty: 'Neurology',
      designation: 'Senior Consultant & Neurologist',
      institution: 'Premier Neurology Institute (TBA)',
      session: 'Epilepsy Pre-surgical Evaluation & Stereo-EEG Trajectories',
      initials: 'NF2',
      isConfirmed: false
    },
    {
      name: 'State Faculty Delegate 1',
      role: 'Symposium Panelist',
      specialty: 'Neurosurgery',
      designation: 'Consultant Neurosurgeon',
      institution: 'Hyderabad Neuroscience Center',
      session: 'Pediatric Hydrocephalus: Shunt vs ETV Paradigms',
      initials: 'SF1',
      isConfirmed: false
    },
    {
      name: 'State Faculty Delegate 2',
      role: 'Symposium Panelist',
      specialty: 'Neurology',
      designation: 'Consultant Neurologist',
      institution: 'Telangana Medical Hospital',
      session: 'Neuromuscular Junction Disorders & Myasthenia Crisis Protocols',
      initials: 'SF2',
      isConfirmed: false
    }
  ];

  return (
    <div className="min-h-screen bg-transparent text-[#182230]">
      
      {/* Banner */}
      <section className="bg-[#001A4D] text-white py-12 sm:py-14 border-b border-[#003399]/40 text-left">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#FFCC00] font-bold px-3 py-1 rounded-full bg-white/10 border border-[#D49B00]/40">
              Distinguished Faculty
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-white font-bold">
              Speakers & Scientific Leadership
            </h1>
            <p className="text-sm text-[#FAF5ED]/85 font-light leading-relaxed">
              Leading neurosurgeons and neurologists steering the scientific sessions, debates, and masterclasses at TNSCON 2027.
            </p>
          </div>
        </div>
      </section>

      {/* Advisory Banner */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 -mt-5 relative z-10 text-left">
        <div className="bg-[#FFFDF9] border border-[#E5DCCB] rounded-xl p-4 flex items-start gap-3 text-xs text-[#182230] shadow-xs">
          <AlertCircle className="w-5 h-5 text-[#003399] flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#003399] block text-sm font-serif">Faculty Disclosure Notice:</strong>
            The confirmed organizing leadership profiles below represent official conference appointments. Additional invited national and international keynote faculty positions are currently undergoing confirmation and will be announced periodically by the Secretariat.
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <section className="py-10 sm:py-12 text-left">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 space-y-12">
          
          {/* Confirmed Leadership Section */}
          <div className="space-y-6">
            <h2 className="font-serif text-2xl text-[#003399] font-bold border-b border-[#E5DCCB] pb-3">
              Confirmed Conference Leadership & Scientific Committee
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {confirmedLeaders.map((leader) => (
                <div
                  key={leader.name}
                  className="relative overflow-hidden bg-[#FFFDF9] rounded-2xl p-6 border border-[#E5DCCB] hover:border-[#003399] transition-all shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="w-20 h-20 rounded-full bg-[#001A4D] text-[#FFCC00] font-serif text-2xl font-bold flex items-center justify-center mx-auto mb-4 ring-4 ring-[#EBF1FA]">
                      {leader.initials}
                    </div>

                    <div className="text-center space-y-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#FFF8E7] text-[#003399] border border-[#D49B00]/30">
                        {leader.role}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-[#003399] pt-1">
                        {leader.name}
                      </h3>
                      <p className="text-xs font-semibold text-[#182230]">
                        {leader.designation}
                      </p>
                      <p className="text-xs text-[#556070]">
                        {leader.institution}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#E5DCCB] text-xs">
                    <span className="text-[10px] uppercase tracking-wider text-[#556070] block">
                      Session Highlight
                    </span>
                    <p className="text-xs font-medium text-[#003399] mt-0.5 leading-snug">
                      {leader.session}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Invited Guest Faculty Slots (Clearly Marked Placeholder) */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#E5DCCB] pb-3">
              <h2 className="font-serif text-2xl text-[#003399] font-bold">
                Invited National & State Faculty Slots
              </h2>
              <span className="text-xs text-[#003399] bg-[#EBF1FA] border border-[#003399]/20 px-2.5 py-1 rounded-full font-medium">
                Editable Placeholder Slots
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {placeholderFaculty.map((fac) => (
                <div
                  key={fac.name}
                  className="relative overflow-hidden bg-[#FFFDF9] rounded-2xl p-6 border-dashed border-2 border-[#D8CEBC] flex flex-col justify-between opacity-85 hover:opacity-100 transition-opacity hover:border-[#D49B00]"
                >
                  <div>
                    <div className="w-16 h-16 rounded-full bg-[#FAF5ED] border border-[#E5DCCB] text-[#003399] font-bold text-lg flex items-center justify-center mx-auto mb-3">
                      {fac.initials}
                    </div>

                    <div className="text-center space-y-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#FAF5ED] text-[#556070] border border-[#E5DCCB]">
                        {fac.role}
                      </span>
                      <h4 className="font-serif text-base font-bold text-[#182230] pt-1">
                        {fac.name}
                      </h4>
                      <p className="text-xs text-[#556070]">
                        {fac.designation}
                      </p>
                      <p className="text-[11px] text-[#556070] italic">
                        {fac.institution}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E5DCCB] text-xs">
                    <span className="text-[10px] uppercase tracking-wider text-[#556070] block">
                      Assigned Topic
                    </span>
                    <p className="text-xs text-[#182230] mt-0.5 leading-snug">
                      {fac.session}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default SpeakersPage;
