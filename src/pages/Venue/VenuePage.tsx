import React from 'react';
import { Navigation, Plane, Train, Hotel, ExternalLink, CheckCircle2 } from 'lucide-react';
import { conferenceInfo } from '../../data/conferenceData';

export const VenuePage: React.FC = () => {
  const travelModes = [
    {
      title: 'By Air (RGIA Shamshabad)',
      description: 'Rajiv Gandhi International Airport (HYD) connects Hyderabad with all major Indian cities and international hubs. Take the PVNR Elevated Expressway or direct airport Pushpak coach to Begumpet (approx. 40–50 mins).',
      icon: Plane
    },
    {
      title: 'By Train (Secunderabad / Hyderabad)',
      description: 'Secunderabad Junction is only 4.5 km (10 mins) from Begumpet Airport. Hyderabad Deccan (Nampally) is 7 km away. Both stations connect to direct metro lines.',
      icon: Train
    },
    {
      title: 'By Hyderabad Metro Rail',
      description: 'Prakash Nagar and Begumpet Metro Stations (Blue Line) are located within 1 km of the Rajeev Gandhi Terminal gate, offering seamless rapid transit across the city.',
      icon: Navigation
    }
  ];

  const nearbyHotels = [
    {
      name: 'Taj Deccan & Taj Vivanta Begumpet',
      category: '5-Star Luxury',
      distance: '1.8 km from Venue',
      area: 'Begumpet / Banjara Hills'
    },
    {
      name: 'Marriott Hyderabad & Courtyard',
      category: '5-Star Luxury',
      distance: '3.5 km from Venue',
      area: 'Tank Bund / Hussain Sagar'
    },
    {
      name: 'The Park Hyderabad',
      category: '5-Star Business',
      distance: '2.4 km from Venue',
      area: 'Somajiguda'
    },
    {
      name: 'ITC Kakatiya Luxury Collection',
      category: '5-Star Luxury',
      distance: '1.2 km from Venue',
      area: 'Begumpet'
    }
  ];

  const landmarks = [
    {
      name: 'Charminar & Laad Bazaar',
      image: '/assets/images/place_charminar.png',
      desc: 'The iconic 1591 monument of Hyderabad surrounded by vibrant heritage bazaars.'
    },
    {
      name: 'Golconda Fort',
      image: '/assets/images/place_golkonda_fort.jpg',
      desc: 'Historic citadel of the Qutb Shahi dynasty with acoustic architectural wonders.'
    },
    {
      name: 'Salar Jung Museum',
      image: '/assets/images/place_salarjung_museum.png',
      desc: 'One of the world’s largest one-man collections of international antiquities.'
    },
    {
      name: 'Chowmahalla Palace',
      image: '/assets/images/place_chowmahalla_palace.jpg',
      desc: 'Opulent palace of the Nizams of Hyderabad with exquisite chandeliers and gardens.'
    }
  ];

  return (
    <div className="min-h-screen bg-transparent text-[#182230]">
      
      {/* Banner */}
      <section className="bg-[#001A4D] text-white py-14 border-b border-[#003399]/40 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#FFCC00] font-bold px-3 py-1 rounded-full bg-white/10 border border-[#D49B00]/40">
              Conference Destination
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-white font-bold">
              Begumpet Airport, Hyderabad
            </h1>
            <p className="text-sm text-[#FAF5ED]/85 font-light leading-relaxed">
              Conference Hall, Rajeev Gandhi Terminal, Begumpet Airport, Hyderabad, Telangana.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Venue Profile Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs uppercase tracking-widest font-bold text-[#003399] px-3 py-1 rounded-full bg-[#EBF1FA] border border-[#003399]/20">
                Aviation & Medical Conclave
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#003399] font-bold">
                The Historic Rajeev Gandhi Terminal
              </h2>
              <p className="text-sm text-[#182230] leading-relaxed">
                Begumpet Airport is one of India’s pioneering aviation centers, established in 1930 during the Nizam era. Today, the renovated <strong>Rajeev Gandhi Terminal Conference Hall</strong> serves as a premier venue for national academic conclaves, combining spacious conference halls, exhibition foyers, green surroundings, and ample parking with central city convenience.
              </p>

              <div className="space-y-2 text-xs text-[#556070]">
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#003399] flex-shrink-0" />
                  <span>Main Plenary Hall (Charminar Auditorium) with multi-screen audiovisual array</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#003399] flex-shrink-0" />
                  <span>Parallel halls for Neurosurgery & Neurology breakout masterclasses</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#003399] flex-shrink-0" />
                  <span>Dedicated Scientific Preview Room for digital slide uploads & tech rehearsals</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#003399] flex-shrink-0" />
                  <span>Expansive exhibition lobby accommodating 42" LCD E-Poster terminals</span>
                </p>
              </div>

              <div className="pt-2">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(conferenceInfo.venue.fullAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#003399] hover:bg-[#002266] text-white text-xs font-bold transition-all shadow-xs"
                >
                  <Navigation className="w-4 h-4 text-[#FFCC00]" />
                  <span>Open in Google Maps / Directions</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white/70" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border border-[#E5DCCB] shadow-xs aspect-[4/3] bg-[#FFFDF9] relative">
                <iframe
                  title="Begumpet Airport Map"
                  src="https://maps.google.com/maps?q=Begumpet%20Airport%20Rajiv%20Gandhi%20Terminal%20Hyderabad&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>
            </div>

          </div>

          {/* Transit & Travel Modes */}
          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-[#003399]">
                Transit & Connectivity
              </span>
              <h2 className="font-serif text-2xl text-[#003399] mt-1 font-bold">
                How to Reach Begumpet Airport
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {travelModes.map((m) => {
                const Icon = m.icon;
                return (
                  <div key={m.title} className="relative overflow-hidden bg-[#FFFDF9] p-6 rounded-2xl border border-[#E5DCCB] shadow-xs space-y-3 hover:border-[#003399] transition-all">
                    <div className="w-10 h-10 rounded-lg bg-[#EBF1FA] text-[#003399] flex items-center justify-center border border-[#003399]/20">
                      <Icon className="w-5 h-5 text-[#D49B00]" />
                    </div>
                    <h3 className="font-serif text-base font-bold text-[#003399]">
                      {m.title}
                    </h3>
                    <p className="text-xs text-[#556070] leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Accommodation Options */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#E5DCCB] pb-3">
              <div>
                <span className="text-xs uppercase tracking-widest font-bold text-[#003399]">
                  Accommodation Options
                </span>
                <h2 className="font-serif text-2xl text-[#003399] mt-1 font-bold">
                  Nearby Hotels & Guest Stays
                </h2>
              </div>
              <span className="text-xs text-[#556070]">
                Delegates are advised to book directly in advance.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {nearbyHotels.map((h) => (
                <div key={h.name} className="relative overflow-hidden bg-[#FFFDF9] p-5 rounded-xl border border-[#E5DCCB] shadow-xs space-y-2 hover:border-[#003399] transition-all">
                  <Hotel className="w-5 h-5 text-[#003399]" />
                  <h4 className="font-serif font-bold text-sm text-[#003399]">
                    {h.name}
                  </h4>
                  <p className="text-xs text-[#D49B00] font-bold">{h.category}</p>
                  <p className="text-xs text-[#556070]">{h.distance} • {h.area}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hyderabad Tourism & Heritage */}
          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-[#003399]">
                City of Pearls
              </span>
              <h2 className="font-serif text-2xl text-[#003399] mt-1 font-bold">
                Explore Historic Hyderabad
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {landmarks.map((l) => (
                <div key={l.name} className="relative overflow-hidden bg-[#FFFDF9] rounded-xl border border-[#E5DCCB] shadow-xs group hover:border-[#D49B00] transition-all">
                  <div className="aspect-[4/3] overflow-hidden bg-[#FAF5ED]">
                    <img
                      src={l.image}
                      alt={l.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 space-y-1">
                    <h4 className="font-serif font-bold text-sm text-[#003399]">
                      {l.name}
                    </h4>
                    <p className="text-[11px] text-[#556070] leading-snug">
                      {l.desc}
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

export default VenuePage;
