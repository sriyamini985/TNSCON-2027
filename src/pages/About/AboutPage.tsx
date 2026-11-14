import React, { useState } from 'react';
import { Award, HeartPulse, Shield, Globe, ExternalLink, MapPin, Building2, Maximize2, X } from 'lucide-react';
import { InteractiveHoverButton } from '../../components/ui/InteractiveHoverButton';
import { welcomeMessage } from '../../data/conferenceData';

export const AboutPage: React.FC = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<any | null>(null);
  return (
    <div className="min-h-screen bg-transparent text-[#182230]">
      
      {/* Page Header Banner: Official Logo Deep Blue */}
      <section className="bg-[#001A4D] text-white py-14 sm:py-16 border-b border-[#003399]/40">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
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
      <section className="py-12 sm:py-16 text-left">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16">
          
          {/* Official Society Banner & Association Link */}
          <div className="rounded-2xl overflow-hidden border border-[#E5DCCB] shadow-sm bg-[#FFFDF9]">
            <img
              src="/assets/images/districts/Hyderabad.png"
              alt="Telangana Neurosciences Society (TNS) Official Banner"
              className="w-full h-auto object-cover max-h-[260px]"
            />
            <div className="p-4 sm:p-5 bg-[#FAF5ED] border-t border-[#E5DCCB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#D49B00] tracking-wider block">
                  Parent Medical Society
                </span>
                <strong className="text-sm text-[#003399] font-serif block">
                  Telangana Neurosciences Society (TNS)
                </strong>
                <p className="text-[#556070] text-[11px] mt-0.5">
                  State apex medical society fostering academic exchange, surgical advancement, and neurological research across Telangana.
                </p>
              </div>
              <a
                href="https://www.telangananeuro.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#003399] hover:bg-[#002266] text-white font-bold text-xs shadow-xs transition-colors flex-shrink-0"
              >
                <Globe className="w-3.5 h-3.5 text-[#FFCC00]" />
                <span>Visit Association Website</span>
                <ExternalLink className="w-3 h-3 text-white/80" />
              </a>
            </div>
          </div>

          {/* Welcome Message Section */}
          <div className="bg-[#FFFDF9] rounded-2xl p-6 sm:p-10 lg:p-12 border border-[#E5DCCB] shadow-xs space-y-8">
            <div className="space-y-6">
              <span className="inline-flex items-center text-xs uppercase tracking-widest font-bold text-[#003399] px-3.5 py-1 rounded-full bg-[#EBF1FA] border border-[#003399]/20">
                Official Welcome Message
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#003399] font-bold">
                {welcomeMessage.salutation}
              </h2>

              <div className="space-y-4 text-[#182230] text-sm sm:text-base leading-relaxed max-w-4xl">
                {welcomeMessage.body.map((p, i) => (
                  <p key={i} className={i === 0 ? 'text-base sm:text-lg text-[#003399] font-medium leading-relaxed' : ''}>
                    {p}
                  </p>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-[#E5DCCB] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-[#FAF5ED]/60 p-4 rounded-xl border border-[#E5DCCB]/70 flex items-start gap-3">
                <img
                  src="/assets/images/committee/dr_rts_naik.png"
                  alt="Dr. R T S Naik"
                  className="w-12 h-12 rounded-full object-cover object-top border-2 border-[#D49B00] shadow-sm flex-shrink-0"
                />
                <div>
                  <h4 className="font-serif text-base font-bold text-[#003399]">
                    Dr. R T S Naik
                  </h4>
                  <p className="text-[11px] font-bold text-[#D49B00] uppercase tracking-wide mt-0.5">
                    Organizing Chairman
                  </p>
                </div>
              </div>

              <div className="bg-[#FAF5ED]/60 p-4 rounded-xl border border-[#E5DCCB]/70 flex items-start gap-3">
                <img
                  src="/assets/images/dr_chandrakanth_tapsi.jpg"
                  alt="Dr. Chandrakanth Tapsi"
                  className="w-12 h-12 rounded-full object-cover object-center border-2 border-[#D49B00] shadow-sm flex-shrink-0"
                />
                <div>
                  <h4 className="font-serif text-base font-bold text-[#003399]">
                    Dr. Chandrakanth Tapsi
                  </h4>
                  <p className="text-[11px] font-bold text-[#D49B00] uppercase tracking-wide mt-0.5">
                    Organizing Secretary
                  </p>
                </div>
              </div>

              <div className="bg-[#FAF5ED]/60 p-4 rounded-xl border border-[#E5DCCB]/70">
                <h4 className="font-serif text-base font-bold text-[#003399]">
                  Dr. G. Venu Gopal
                </h4>
                <p className="text-[11px] font-bold text-[#D49B00] uppercase tracking-wide mt-1">
                  Joint Organizing Secretary
                </p>
              </div>

              <div className="bg-[#FAF5ED]/60 p-4 rounded-xl border border-[#E5DCCB]/70">
                <h4 className="font-serif text-base font-bold text-[#003399]">
                  Scientific Chairs
                </h4>
                <p className="text-xs text-[#556070] mt-1 font-medium">
                  Dr. T V Ramakrishna Murthy & Dr. G Subbaiah Choudary
                </p>
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
            <div className="border-b border-[#E5DCCB] pb-3 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <span className="text-xs uppercase tracking-widest font-bold text-[#003399]">
                  Statewide Presence & Network
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#003399] mt-1 font-bold">
                  Telangana Neurosciences Network
                </h2>
                <p className="text-xs text-[#556070] mt-1">
                  Connecting clinicians, academic medical colleges, and specialty neuroscience centers across all Telangana districts.
                </p>
              </div>
              <span className="text-[11px] text-[#D49B00] font-semibold bg-[#FFF8E7] px-3 py-1 rounded-full border border-[#D49B00]/30 self-start sm:self-auto">
                9 Regional Medical Hubs
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  name: 'Hyderabad',
                  file: 'Hyderabad.png',
                  tag: 'State Capital & Conference Hub',
                  landmark: 'Charminar & Begumpet Airport Hub',
                  centers: 'NIMS · Osmania General Hospital · Gandhi Hospital · Apollo Health City · Yashoda'
                },
                {
                  name: 'Warangal',
                  file: 'Warangal.png',
                  tag: 'Kakatiya Medical Region',
                  landmark: 'Thousand Pillar Temple',
                  centers: 'Kakatiya Medical College (KMC) · MGM Hospital · Regional Trauma Centers'
                },
                {
                  name: 'Khammam',
                  file: 'Khammam.png',
                  tag: 'Eastern Telangana Center',
                  landmark: 'Historical Khammam Fort',
                  centers: 'Government Medical College Khammam · Mamata Medical College & Hospital'
                },
                {
                  name: 'Karimnagar',
                  file: 'Karimnagar.png',
                  tag: 'Northern Regional Hub',
                  landmark: 'Lower Manair Dam & Elgandal',
                  centers: 'Government Medical College Karimnagar · Prathima Institute of Medical Sciences'
                },
                {
                  name: 'Nizamabad',
                  file: 'Nizamabad.png',
                  tag: 'North-Western Network',
                  landmark: 'Nizamabad Historical Quilla',
                  centers: 'Government Medical College Nizamabad · Regional Neuro Referral Center'
                },
                {
                  name: 'Mahbubnagar',
                  file: 'Mahbubnagar.png',
                  tag: 'Southern Telangana Network',
                  landmark: 'Pillalamarri Ancient Banyan',
                  centers: 'Government Medical College Mahbubnagar · SVS Medical College & Hospital'
                },
                {
                  name: 'Nalgonda',
                  file: 'Nalagonda.png',
                  tag: 'Central-South Regional Center',
                  landmark: 'Nagarjuna Sagar & Devarakonda',
                  centers: 'Government Medical College Nalgonda · Kamineni Institute of Medical Sciences'
                },
                {
                  name: 'Medak',
                  file: 'Medak.png',
                  tag: 'Medak & Sangareddy Region',
                  landmark: 'Historic Medak Cathedral',
                  centers: 'Government Medical College Siddipet/Medak · RVM Institute of Medical Sciences'
                },
                {
                  name: 'Adilabad',
                  file: 'Adilabad.png',
                  tag: 'Northern Frontier Medical Outreach',
                  landmark: 'Kuntala Waterfalls & Sahyadri',
                  centers: 'Rajiv Gandhi Institute of Medical Sciences (RIMS Adilabad)'
                },
              ].map((district) => (
                <div
                  key={district.name}
                  onClick={() => setSelectedDistrict(district)}
                  className="bg-[#FFFDF9] rounded-2xl overflow-hidden border border-[#E5DCCB] shadow-xs hover:border-[#003399] hover:shadow-lg transition-all group text-left cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Panoramic District Banner - 1920x500 matches 192/50 aspect ratio with 0 clipped text */}
                    <div className="w-full aspect-[192/50] overflow-hidden bg-[#FAF5ED] border-b border-[#E5DCCB] relative group-hover:opacity-95 transition-all">
                      <img
                        src={`/assets/images/districts/${district.file}`}
                        alt={`${district.name} — Telangana Neurosciences Society`}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute top-2 right-2 bg-black/50 hover:bg-black/75 backdrop-blur-xs text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <div className="p-4 space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-[#003399] flex-shrink-0" />
                          <h3 className="font-serif text-lg font-bold text-[#003399]">
                            {district.name}
                          </h3>
                        </div>
                        <span className="text-[9.5px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#D49B00]/15 text-[#8B6508] border border-[#D49B00]/30 truncate max-w-[170px]">
                          {district.tag}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs pt-1 border-t border-[#E5DCCB]/60">
                        <div className="flex items-start gap-1.5 text-[11px] text-[#556070]">
                          <Building2 className="w-3.5 h-3.5 text-[#003399] flex-shrink-0 mt-0.5" />
                          <span className="leading-snug">
                            <strong className="text-[#182230] font-medium">Key Institutions:</strong> {district.centers}
                          </span>
                        </div>
                        <div className="text-[10.5px] text-[#556070]/80 pl-5">
                          Landmark: {district.landmark}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 py-2 bg-[#FAF5ED] border-t border-[#E5DCCB] flex items-center justify-between text-[11px] text-[#003399] font-semibold group-hover:bg-[#EBF1FA] transition-colors">
                    <span>View High-Res Banner</span>
                    <span className="text-xs group-hover:translate-x-0.5 transition-transform">→</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Lightbox Modal for High-Res Panoramic District Banner */}
            {selectedDistrict && (
              <div 
                className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
                onClick={() => setSelectedDistrict(null)}
              >
                <div 
                  className="bg-[#FFFDF9] rounded-2xl max-w-4xl w-full border border-[#D49B00] overflow-hidden shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-4 bg-[#001A4D] text-white flex items-center justify-between border-b border-[#003399]">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#FFCC00]" />
                      <h3 className="font-serif text-lg font-bold text-white">
                        {selectedDistrict.name} District — Telangana Neurosciences Society
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedDistrict(null)}
                      className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-4 sm:p-6 space-y-4">
                    <div className="w-full aspect-[192/50] rounded-xl overflow-hidden border border-[#E5DCCB] shadow-inner bg-[#FAF5ED]">
                      <img
                        src={`/assets/images/districts/${selectedDistrict.file}`}
                        alt={selectedDistrict.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#FAF5ED] p-4 rounded-xl border border-[#E5DCCB]">
                      <div>
                        <span className="text-[#556070] block text-[10.5px] uppercase font-bold">Regional Medical Role:</span>
                        <strong className="text-sm text-[#003399] font-serif block mt-0.5">{selectedDistrict.tag}</strong>
                        <p className="text-[#556070] text-[11.5px] mt-1">Landmark: {selectedDistrict.landmark}</p>
                      </div>
                      <div>
                        <span className="text-[#556070] block text-[10.5px] uppercase font-bold">Connected Centers & Colleges:</span>
                        <p className="text-[#182230] text-[11.5px] mt-1 leading-relaxed font-medium">{selectedDistrict.centers}</p>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-3 bg-[#FAF5ED] border-t border-[#E5DCCB] flex justify-end">
                    <button
                      onClick={() => setSelectedDistrict(null)}
                      className="px-5 py-2 rounded-lg bg-[#003399] hover:bg-[#002266] text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Close Preview
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Stats & Info */}
          <div className="bg-[#FFFDF9] rounded-2xl p-6 sm:p-8 border border-[#E5DCCB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
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
