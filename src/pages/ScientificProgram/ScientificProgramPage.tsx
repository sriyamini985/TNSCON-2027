import React, { useState } from 'react';
import { Clock, MapPin, Filter, AlertCircle } from 'lucide-react';
import { sampleScientificProgram } from '../../data/conferenceData';

export const ScientificProgramPage: React.FC = () => {
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Neurosurgery', 'Neurology', 'Plenary', 'Award Papers', 'Free Papers', 'Poster Session'];

  const currentDay = sampleScientificProgram[selectedDayIdx];

  const filteredSessions = currentDay.sessions.filter(session => {
    if (selectedCategory === 'All') return true;
    return session.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-transparent text-[#182230]">
      
      {/* Banner */}
      <section className="bg-[#001A4D] text-white py-12 sm:py-14 border-b border-[#003399]/40 text-left">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#FFCC00] font-bold px-3 py-1 rounded-full bg-white/10 border border-[#D49B00]/40">
              Scientific Program Schedule
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-white font-bold">
              Academic Curriculum & Sessions
            </h1>
            <p className="text-sm text-[#FAF5ED]/85 font-light leading-relaxed">
              Three comprehensive days of didactic plenary lectures, operative neurosurgical masterclasses, acute stroke symposia, and award paper colloquia.
            </p>
          </div>
        </div>
      </section>

      {/* Advisory Banner */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 -mt-5 relative z-10 text-left">
        <div className="bg-[#FFFDF9] border border-[#E5DCCB] rounded-xl p-4 flex items-start gap-3 text-xs text-[#182230] shadow-xs">
          <AlertCircle className="w-5 h-5 text-[#003399] flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#003399] block text-sm font-serif">Notice Regarding Scientific Schedule:</strong>
            The schedule below represents the provisional scientific curriculum framework. Exact speaker allocations, masterclass slots, and paper timings will be finalized by the Scientific Committee (Dr. N Pratap Kumar & Dr. Subbaiah Choudary) following peer-review completion. All entries labeled with <em>"Placeholder Entry"</em> are provided for conference structural visualization.
          </div>
        </div>
      </div>

      {/* Schedule Interface */}
      <section className="py-10 sm:py-12 text-left">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 space-y-8">
          
          {/* Day Selector & Category Filters */}
          <div className="bg-[#FFFDF9] p-5 rounded-2xl border border-[#E5DCCB] shadow-xs space-y-4">
            
            {/* Day Selector Tabs */}
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
              {sampleScientificProgram.map((item, idx) => (
                <button
                  key={item.day}
                  onClick={() => setSelectedDayIdx(idx)}
                  className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    selectedDayIdx === idx
                      ? 'bg-[#003399] text-white shadow-xs'
                      : 'bg-[#FAF5ED] text-[#182230] border border-[#E5DCCB] hover:bg-[#EBF1FA]'
                  }`}
                >
                  <span className="block font-serif text-sm sm:text-base">
                    {item.day.split('—')[0].trim()}
                  </span>
                  <span className={`text-[10px] sm:text-[11px] font-normal ${selectedDayIdx === idx ? 'text-[#FFCC00]' : 'text-[#556070]'}`}>
                    {item.date}
                  </span>
                </button>
              ))}
            </div>

            {/* Category Filter Pills */}
            <div className="pt-3 border-t border-[#E5DCCB] flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[#556070] font-semibold flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5 text-[#003399]" /> Filter by:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#003399] text-white font-bold shadow-xs'
                      : 'bg-[#FAF5ED] text-[#556070] hover:text-[#003399] border border-[#E5DCCB]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

          </div>

          {/* Session Cards List */}
          <div className="space-y-4">
            {filteredSessions.length === 0 ? (
              <div className="bg-[#FFFDF9] p-12 text-center rounded-2xl border border-[#E5DCCB] text-[#556070]">
                No sessions found for category "{selectedCategory}" on this day.
              </div>
            ) : (
              filteredSessions.map((session, idx) => (
                <div
                  key={idx}
                  className="relative overflow-hidden bg-[#FFFDF9] rounded-xl p-5 sm:p-6 border border-[#E5DCCB] hover:border-[#003399]/50 transition-all shadow-xs flex flex-col md:flex-row md:items-start justify-between gap-6"
                >
                  {/* Left: Timing & Hall */}
                  <div className="md:w-56 flex-shrink-0 space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#EBF1FA] text-[#003399] font-manrope font-bold text-xs border border-[#003399]/20">
                      <Clock className="w-3.5 h-3.5 text-[#D49B00]" />
                      <span>{session.time}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-[#556070]">
                      <MapPin className="w-3.5 h-3.5 text-[#003399]" />
                      <span>{session.hall}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#EBF1FA] text-[#003399] border border-[#003399]/20">
                        {session.category}
                      </span>
                      {session.isPlaceholder && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#FAF5ED] text-[#556070] border border-[#E5DCCB]">
                          Placeholder Entry
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Center: Title & Description */}
                  <div className="flex-1 space-y-2">
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#003399]">
                      {session.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#182230]/85 leading-relaxed">
                      {session.details}
                    </p>
                  </div>

                  {/* Right: Speaker */}
                  <div className="md:w-52 flex-shrink-0 md:text-right pt-2 md:pt-0 border-t md:border-t-0 border-[#E5DCCB]">
                    <span className="text-[10px] uppercase tracking-wider text-[#556070] block">
                      Faculty / Presenter
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#182230] block mt-0.5">
                      {session.speaker}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </section>

    </div>
  );
};

export default ScientificProgramPage;
