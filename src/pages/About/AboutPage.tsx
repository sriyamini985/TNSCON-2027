import React from 'react';
import { Award, HeartPulse, Shield } from 'lucide-react';
import { InteractiveHoverButton } from '../../components/ui/InteractiveHoverButton';
import { welcomeMessage } from '../../data/conferenceData';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-transparent text-[#182230]">
      
      {/* Page Header Banner: Official Logo Deep Blue */}
      <section className="bg-[#001A4D] text-white py-16 border-b border-[#003399]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3 text-left">
            <span className="text-xs uppercase tracking-widest text-[#FFCC00] font-bold px-3 py-1 rounded-full bg-white/10 border border-[#D49B00]/40">
              About the Society & Conference
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-white font-bold">
              Telangana Neurosciences Society
            </h1>
            <p className="text-sm sm:text-base text-[#FAF5ED]/85 font-light leading-relaxed">
              Advancing surgical mastery, neurological care, academic exchange, and compassionate patient outcomes across the State of Telangana and nationwide.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-16 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Welcome Message Section */}
          <div className="bg-[#FFFDF9] rounded-2xl p-8 sm:p-12 border border-[#E5DCCB] shadow-xs">
            <div className="max-w-3xl space-y-6">
              <span className="text-xs uppercase tracking-widest font-bold text-[#003399] px-3 py-1 rounded-full bg-[#EBF1FA] border border-[#003399]/20">
                Official Welcome Message
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#003399] font-bold">
                {welcomeMessage.salutation}
              </h2>

              <div className="space-y-4 text-[#182230] text-base leading-relaxed">
                {welcomeMessage.body.map((p, i) => (
                  <p key={i} className={i === 0 ? 'text-lg text-[#003399] font-medium' : ''}>
                    {p}
                  </p>
                ))}
              </div>

              <div className="pt-8 border-t border-[#E5DCCB] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <h4 className="font-serif text-base font-bold text-[#003399]">
                    Dr. R T S Naik
                  </h4>
                  <p className="text-xs font-semibold text-[#D49B00] uppercase tracking-wide">
                    Organizing Chairman
                  </p>
                  <p className="text-xs text-[#556070] mt-0.5">
                    Senior Consultant Neurosurgeon
                  </p>
                </div>

                <div>
                  <h4 className="font-serif text-base font-bold text-[#003399]">
                    Dr. Chandrakanth Tapsi
                  </h4>
                  <p className="text-xs font-semibold text-[#D49B00] uppercase tracking-wide">
                    Organizing Secretary
                  </p>
                  <p className="text-xs text-[#556070] mt-0.5">
                    Consultant Neurophysician
                  </p>
                </div>

                <div>
                  <h4 className="font-serif text-base font-bold text-[#003399]">
                    Dr. G. Venu Gopal
                  </h4>
                  <p className="text-xs font-semibold text-[#D49B00] uppercase tracking-wide">
                    Joint Organizing Secretary
                  </p>
                  <p className="text-xs text-[#556070] mt-0.5">
                    Consultant Neurospecialist
                  </p>
                </div>

                <div>
                  <h4 className="font-serif text-base font-bold text-[#003399]">
                    Scientific Chairs
                  </h4>
                  <p className="text-xs font-semibold text-[#D49B00] uppercase tracking-wide">
                    Neurosurgery & Neurology
                  </p>
                  <p className="text-xs text-[#556070] mt-0.5">
                    Dr. T V Ramakrishna Murthy & Dr. G Subbaiah Choudary
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Pillars of Academic Excellence */}
          <div className="space-y-8">
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-[#003399]">
                Core Academic Mission
              </span>
              <h2 className="font-serif text-3xl text-[#003399] mt-1 font-bold">
                Pillars of TNSCON 2027
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative overflow-hidden bg-[#FFFDF9] p-6 rounded-xl border border-[#E5DCCB] shadow-xs space-y-3 hover:border-[#003399] transition-all">
                <div className="w-12 h-12 rounded-lg bg-[#EBF1FA] text-[#003399] flex items-center justify-center border border-[#003399]/20">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#003399]">
                  Clinical & Surgical Innovation
                </h3>
                <p className="text-xs text-[#556070] leading-relaxed">
                  Exploring breakthrough surgical techniques in skull base resections, robotic spine instrumentation, intraoperative neuromonitoring, and minimally invasive corridors.
                </p>
              </div>

              <div className="relative overflow-hidden bg-[#FFFDF9] p-6 rounded-xl border border-[#E5DCCB] shadow-xs space-y-3 hover:border-[#003399] transition-all">
                <div className="w-12 h-12 rounded-lg bg-[#EBF1FA] text-[#003399] flex items-center justify-center border border-[#003399]/20">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#003399]">
                  Neurological Advances
                </h3>
                <p className="text-xs text-[#556070] leading-relaxed">
                  Focusing on rapid stroke thrombectomy pathways, emerging monoclonal therapies for neuroimmunology, refractory epilepsy surgery, and Parkinsonian DBS.
                </p>
              </div>

              <div className="relative overflow-hidden bg-[#FFFDF9] p-6 rounded-xl border border-[#E5DCCB] shadow-xs space-y-3 hover:border-[#D49B00] transition-all">
                <div className="w-12 h-12 rounded-lg bg-[#FFF8E7] text-[#D49B00] flex items-center justify-center border border-[#D49B00]/30">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#003399]">
                  Resident Mentorship
                </h3>
                <p className="text-xs text-[#556070] leading-relaxed">
                  Fostering next-generation neuroscientists through the prestigious Dr. R T S Naik Award Paper session, resident symposia, and operative video review sessions.
                </p>
              </div>
            </div>
          </div>

          {/* Statewide Neuroscience Network Across Telangana Districts */}
          <div className="space-y-6">
            <div className="border-b border-[#E5DCCB] pb-3">
              <span className="text-xs uppercase tracking-widest font-bold text-[#003399]">
                Statewide Presence
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#003399] mt-1 font-bold">
                Telangana Neurosciences Network
              </h2>
              <p className="text-xs text-[#556070] mt-1">
                Connecting clinicians, academic medical colleges, and specialty neuroscience centers across Telangana districts.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
              {[
                { name: 'Hyderabad', file: 'Hyderabad.png', tag: 'State Capital & Conference Hub' },
                { name: 'Warangal', file: 'Warangal.png', tag: 'Kakatiya Medical Region' },
                { name: 'Khammam', file: 'Khammam.png', tag: 'Eastern Telangana Center' },
                { name: 'Karimnagar', file: 'Karimnagar.png', tag: 'Northern Regional Hub' },
                { name: 'Nizamabad', file: 'Nizamabad.png', tag: 'North-Western Network' },
                { name: 'Mahbubnagar', file: 'Mahbubnagar.png', tag: 'Southern Telangana Network' },
                { name: 'Nalgonda', file: 'Nalagonda.png', tag: 'Central-South Regional Center' },
                { name: 'Medak', file: 'Medak.png', tag: 'Medak & Sangareddy Region' },
                { name: 'Adilabad', file: 'Adilabad.png', tag: 'Northern Frontier Medical Outreach' },
              ].map((district) => (
                <div
                  key={district.name}
                  className="bg-[#FFFDF9] rounded-xl overflow-hidden border border-[#E5DCCB] shadow-xs hover:border-[#003399] hover:shadow-md transition-all group text-left"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-stone-100 relative">
                    <img
                      src={`/assets/images/districts/${district.file}`}
                      alt={`${district.name} Telangana District`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute bottom-2 left-2 text-white font-serif font-bold text-sm drop-shadow">
                      {district.name}
                    </span>
                  </div>
                  <div className="p-3">
                    <span className="text-[10px] uppercase font-bold text-[#D49B00] block tracking-wider">
                      Telangana District
                    </span>
                    <p className="text-[11px] text-[#556070] truncate mt-0.5 font-medium">
                      {district.tag}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats & Info */}
          <div className="bg-[#FFFDF9] rounded-2xl p-8 border border-[#E5DCCB] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#003399]">
                Join the Conclave in Hyderabad
              </h3>
              <p className="text-xs text-[#556070] mt-1 max-w-xl">
                Be part of three immersive days of academic discovery, peer discussions, and collaborative fellowship at Begumpet Airport.
              </p>
            </div>
            <InteractiveHoverButton
              to="/registration"
              text="Register Now"
              variant="blue"
              className="py-2.5 px-6 text-xs font-bold"
            />
          </div>

        </div>
      </section>

    </div>
  );
};

export default AboutPage;
