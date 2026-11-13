import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  BookOpen,
  Filter,
  FileText,
  User,
  Building,
  Award,
  Calendar,
  Eye,
  LogOut,
  Printer,
  X,
  CheckCircle2,
  Share2,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { api } from '../../services/api';
import { AbstractRecord } from '../../types/types';

export const AbstractViewerPage: React.FC = () => {
  const [viewerToken, setViewerToken] = useState<string | null>(api.getViewerToken());
  const [viewerName, setViewerName] = useState<string>('Public Viewer');
  const [emailInput, setEmailInput] = useState<string>('');
  const [abstracts, setAbstracts] = useState<AbstractRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [selectedAbstract, setSelectedAbstract] = useState<AbstractRecord | null>(null);

  // Load public abstracts
  useEffect(() => {
    loadPublicAbstracts();
  }, []);

  const loadPublicAbstracts = async () => {
    setIsLoading(true);
    try {
      const res = await api.getPublicAbstracts();
      setAbstracts(res.abstracts || []);
    } catch (err) {
      console.error('Failed to load public abstracts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewerLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const identity = emailInput.trim() || 'Public Viewer';
    const res = await api.viewerLogin({ username: identity, email: emailInput.trim() });
    setViewerToken(res.token);
    setViewerName(identity);
  };

  const handleViewerLogout = () => {
    api.logoutViewer();
    setViewerToken(null);
  };

  // Filtered abstracts
  const filteredAbstracts = useMemo(() => {
    return abstracts.filter((abs) => {
      if (selectedCategory !== 'All' && abs.category !== selectedCategory) return false;
      if (selectedSpecialty !== 'All' && abs.specialty !== selectedSpecialty) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          abs.title?.toLowerCase().includes(q) ||
          abs.presentingAuthorName?.toLowerCase().includes(q) ||
          abs.coAuthors?.toLowerCase().includes(q) ||
          abs.presentingAuthorInstitution?.toLowerCase().includes(q) ||
          abs.subTopic?.toLowerCase().includes(q) ||
          abs.submissionId?.toLowerCase().includes(q) ||
          abs.fullAbstractText?.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [abstracts, selectedCategory, selectedSpecialty, searchQuery]);

  // Statistics
  const totalCount = abstracts.length;
  const awardCount = abstracts.filter((a) => a.category === 'Award Paper Presentation').length;
  const oralCount = abstracts.filter((a) => a.category === 'Free Paper Presentation').length;
  const posterCount = abstracts.filter((a) => a.category === 'Poster Presentation').length;

  // If not logged in as viewer, show dedicated Viewer Login
  if (!viewerToken) {
    return (
      <div className="min-h-screen bg-[#FAF5ED] py-12 px-4 flex items-center justify-center">
        <div className="bg-[#FFFDF9] rounded-2xl p-8 sm:p-10 border border-[#E5DCCB] shadow-xl max-w-lg w-full text-left space-y-6">
          <div className="text-center space-y-2">
            <img
              src="/assets/images/tnscon_logo.png"
              alt="TNSCON 2027 Logo"
              className="h-14 w-auto mx-auto object-contain mb-2"
            />
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#EBF1FA] text-[#003399] border border-[#003399]/20">
              Public Abstract Viewing Portal
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#003399]">
              TNSCON 2027 Scientific Repository
            </h2>
            <p className="text-xs text-[#556070] leading-relaxed">
              Open public viewing portal for delegates, peer reviewers, neuroscientists, and medical attendees to browse conference abstracts and e-posters.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {/* Quick 1-Click Access for General Public */}
            <button
              onClick={() => handleViewerLogin()}
              className="w-full py-3.5 px-4 rounded-xl bg-[#003399] hover:bg-[#002266] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4 text-[#FFCC00]" />
              <span>Enter as Public Viewer (Instant Access)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-[#E5DCCB] w-full" />
              <span className="bg-[#FFFDF9] px-3 text-[11px] font-medium text-[#556070] uppercase tracking-wider">
                Or Sign In with Delegate Details
              </span>
            </div>

            <form onSubmit={handleViewerLogin} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#003399] mb-1">
                  Delegate Email or Full Name (Optional)
                </label>
                <input
                  type="text"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="e.g. doctor@hospital.org or Dr. Sharma"
                  className="w-full p-2.5 rounded-lg border border-[#E5DCCB] text-xs font-medium bg-[#FAF5ED] text-[#182230] focus:border-[#003399]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-[#FAF5ED] hover:bg-[#EBF1FA] border border-[#003399]/30 text-[#003399] font-bold text-xs transition-colors cursor-pointer"
              >
                Sign In to Personalized Viewer
              </button>
            </form>
          </div>

          {/* Footer Navigation */}
          <div className="pt-4 border-t border-[#E5DCCB] flex flex-col sm:flex-row items-center justify-between text-xs text-[#556070] gap-2">
            <Link to="/" className="hover:text-[#003399] underline">
              ← Return to Homepage
            </Link>
            <Link
              to="/admin"
              className="hover:text-[#003399] font-bold inline-flex items-center gap-1 text-[#003399]"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Secretariat Admin Login →</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF5ED]">
      {/* Top Header Bar */}
      <div className="bg-[#001A4D] text-white border-b-2 border-[#D49B00] px-4 sm:px-6 py-4">
        <div className="max-w-[1240px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#FFFDF9] px-2.5 py-1 rounded-md shadow-xs flex items-center justify-center">
              <img
                src="/assets/images/tnscon_logo.png"
                alt="TNSCON 2027 Logo"
                className="h-7 w-auto object-contain"
              />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-lg font-bold">
                  TNSCON 2027 Scientific Abstract Repository
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Public Viewing
                </span>
              </div>
              <p className="text-[11px] text-[#FAF5ED]/80">
                11th Annual Conference of Telangana Neurosciences Society · Begumpet Airport, Hyderabad
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-[#FAF5ED]/70 block uppercase">Viewing as</span>
              <strong className="text-xs text-white">{viewerName}</strong>
            </div>

            <Link
              to="/admin"
              className="flex items-center gap-1.5 text-xs text-[#FAF5ED] hover:text-white px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#FFCC00]" />
              <span>Admin Portal</span>
            </Link>

            <button
              onClick={handleViewerLogout}
              className="flex items-center gap-1.5 text-xs text-red-200 hover:text-white px-3 py-1.5 rounded-lg bg-red-900/40 border border-red-400/30 cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Viewer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Banner with Metrics */}
        <div className="bg-[#FFFDF9] border border-[#E5DCCB] rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="text-left max-w-2xl space-y-1">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#003399]" />
                <h2 className="font-serif text-xl font-bold text-[#003399]">
                  Conference Scientific Presentations & E-Posters
                </h2>
              </div>
              <p className="text-xs text-[#556070] leading-relaxed">
                Browse through peer-reviewed research accepted for presentation at TNSCON 2027. Use the filters below to search by specialty, surgical topic, or author.
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-[#FAF5ED] border border-[#E5DCCB]">
                <span className="text-[10px] uppercase font-bold text-[#556070] block">Published</span>
                <span className="font-serif text-xl font-bold text-[#003399]">{totalCount}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF5ED] border border-[#E5DCCB]">
                <span className="text-[10px] uppercase font-bold text-[#556070] block">Oral Papers</span>
                <span className="font-serif text-xl font-bold text-[#003399]">{oralCount}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF5ED] border border-[#E5DCCB]">
                <span className="text-[10px] uppercase font-bold text-[#556070] block">Award Papers</span>
                <span className="font-serif text-xl font-bold text-[#D49B00]">{awardCount}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF5ED] border border-[#E5DCCB]">
                <span className="text-[10px] uppercase font-bold text-[#556070] block">E-Posters</span>
                <span className="font-serif text-xl font-bold text-[#003399]">{posterCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filters Toolbar */}
        <div className="bg-[#FFFDF9] border border-[#E5DCCB] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#556070]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, author name, institution, or clinical keywords..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5DCCB] text-xs font-medium bg-[#FAF5ED] text-[#182230] focus:border-[#003399]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#556070] hover:text-[#003399]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Specialty Dropdown */}
            <div className="w-full md:w-56">
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl border border-[#E5DCCB] text-xs font-medium bg-[#FAF5ED] text-[#182230] focus:border-[#003399]"
              >
                <option value="All">All Specialties</option>
                <option value="Neurosurgery">Neurosurgery</option>
                <option value="Neurology">Neurology</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E5DCCB]">
            <span className="text-xs font-bold text-[#003399] mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Category:</span>
            </span>
            {[
              { id: 'All', label: 'All Presentations' },
              { id: 'Award Paper Presentation', label: 'Award Papers' },
              { id: 'Free Paper Presentation', label: 'Oral Free Papers' },
              { id: 'Poster Presentation', label: 'E-Posters' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#003399] text-white shadow-xs'
                    : 'bg-[#FAF5ED] text-[#556070] hover:text-[#003399] border border-[#E5DCCB]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Abstract Cards List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#556070] px-1">
            <span>
              Showing <strong>{filteredAbstracts.length}</strong> of {totalCount} published abstracts
            </span>
            <span className="text-[11px] text-[#556070]/80">
              Double click any card or click "Read Full Abstract" for complete text
            </span>
          </div>

          {isLoading ? (
            <div className="bg-[#FFFDF9] rounded-2xl p-12 border border-[#E5DCCB] text-center text-xs text-[#556070]">
              Loading published abstracts...
            </div>
          ) : filteredAbstracts.length === 0 ? (
            <div className="bg-[#FFFDF9] rounded-2xl p-12 border border-[#E5DCCB] text-center space-y-2">
              <FileText className="w-8 h-8 text-[#556070] mx-auto opacity-50" />
              <p className="font-bold text-sm text-[#003399]">No abstracts matched your search criteria.</p>
              <p className="text-xs text-[#556070]">Try clearing search keywords or choosing "All Presentations".</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredAbstracts.map((abs) => (
                <div
                  key={abs.id || abs.submissionId}
                  className="bg-[#FFFDF9] rounded-2xl p-6 border border-[#E5DCCB] hover:border-[#003399]/40 hover:shadow-md transition-all text-left space-y-4 cursor-pointer"
                  onClick={() => setSelectedAbstract(abs)}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5DCCB] pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-[#FAF5ED] text-[#003399] border border-[#E5DCCB]">
                        {abs.submissionId}
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          abs.category === 'Award Paper Presentation'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : abs.category === 'Free Paper Presentation'
                            ? 'bg-blue-100 text-blue-900 border border-blue-300'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        }`}
                      >
                        {abs.category}
                      </span>
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-stone-100 text-[#556070]">
                        {abs.specialty} · {abs.subTopic}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Accepted for Conference
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#003399] leading-snug">
                    {abs.title}
                  </h3>

                  {/* Author Information */}
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#182230]">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#003399]" />
                      <span>
                        <strong>
                          {abs.presentingAuthorTitle} {abs.presentingAuthorName}
                        </strong>
                        {abs.presentingAuthorDesignation && (
                          <span className="text-[#556070]"> ({abs.presentingAuthorDesignation})</span>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-[#003399]" />
                      <span className="text-[#556070]">{abs.presentingAuthorInstitution}</span>
                    </div>

                    {abs.coAuthors && (
                      <div className="w-full text-xs text-[#556070]">
                        <strong>Co-Authors:</strong> {abs.coAuthors}
                      </div>
                    )}
                  </div>

                  {/* Summary / Structured Abstract Preview */}
                  <div className="p-3.5 rounded-xl bg-[#FAF5ED] border border-[#E5DCCB] text-xs text-[#182230] leading-relaxed space-y-1.5">
                    {abs.introduction && (
                      <p>
                        <strong className="text-[#003399]">Introduction:</strong> {abs.introduction}
                      </p>
                    )}
                    {abs.results && (
                      <p>
                        <strong className="text-[#003399]">Results:</strong> {abs.results}
                      </p>
                    )}
                    {abs.conclusion && (
                      <p>
                        <strong className="text-[#003399]">Conclusion:</strong> {abs.conclusion}
                      </p>
                    )}
                    {!abs.introduction && !abs.results && abs.fullAbstractText && (
                      <p className="line-clamp-3">{abs.fullAbstractText}</p>
                    )}
                  </div>

                  {/* Card Bottom Toolbar */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-[#556070]">
                      Word Count: <strong>{abs.wordCount || 240}</strong> words
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAbstract(abs);
                      }}
                      className="px-4 py-2 rounded-lg bg-[#003399] hover:bg-[#002266] text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#FFCC00]" />
                      <span>Read Full Abstract & Citation</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FULL ABSTRACT DETAIL & CITATION MODAL */}
      {selectedAbstract && (
        <div className="fixed inset-0 z-50 bg-[#001A4D]/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FFFDF9] rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col border border-[#E5DCCB] shadow-2xl overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="p-6 bg-[#001A4D] text-white flex items-start justify-between border-b-2 border-[#D49B00]">
              <div className="space-y-1.5 text-left pr-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-white/10 text-white font-mono text-xs font-bold border border-white/20">
                    {selectedAbstract.submissionId}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FFCC00] text-[#001A4D] text-xs font-bold">
                    {selectedAbstract.category}
                  </span>
                  <span className="text-xs text-[#FAF5ED]/80">
                    {selectedAbstract.specialty} · {selectedAbstract.subTopic}
                  </span>
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-white leading-snug">
                  {selectedAbstract.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedAbstract(null)}
                className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-left">
              {/* Authors & Institutional Affiliation */}
              <div className="p-4 rounded-xl bg-[#FAF5ED] border border-[#E5DCCB] space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#003399] block">
                  Author & Affiliation
                </span>
                <p className="text-sm font-bold text-[#182230]">
                  {selectedAbstract.presentingAuthorTitle} {selectedAbstract.presentingAuthorName}
                  {selectedAbstract.presentingAuthorDesignation && (
                    <span className="font-normal text-[#556070]">
                      {' '}— {selectedAbstract.presentingAuthorDesignation}
                    </span>
                  )}
                </p>
                <p className="text-xs text-[#556070]">{selectedAbstract.presentingAuthorInstitution}</p>
                {selectedAbstract.coAuthors && (
                  <p className="text-xs text-[#182230] pt-1 border-t border-[#E5DCCB]/60">
                    <strong>Co-Investigators:</strong> {selectedAbstract.coAuthors}
                  </p>
                )}
              </div>

              {/* Full Structured Text */}
              <div className="space-y-4">
                <h4 className="font-serif text-base font-bold text-[#003399] border-b border-[#E5DCCB] pb-1">
                  Structured Scientific Abstract
                </h4>

                {selectedAbstract.introduction && (
                  <div className="space-y-1">
                    <strong className="text-xs uppercase font-bold text-[#003399] block">
                      1. Background & Introduction
                    </strong>
                    <p className="text-xs text-[#182230] leading-relaxed">{selectedAbstract.introduction}</p>
                  </div>
                )}

                {selectedAbstract.methods && (
                  <div className="space-y-1">
                    <strong className="text-xs uppercase font-bold text-[#003399] block">
                      2. Materials & Methods
                    </strong>
                    <p className="text-xs text-[#182230] leading-relaxed">{selectedAbstract.methods}</p>
                  </div>
                )}

                {selectedAbstract.results && (
                  <div className="space-y-1">
                    <strong className="text-xs uppercase font-bold text-[#003399] block">
                      3. Results & Observations
                    </strong>
                    <p className="text-xs text-[#182230] leading-relaxed">{selectedAbstract.results}</p>
                  </div>
                )}

                {selectedAbstract.conclusion && (
                  <div className="space-y-1">
                    <strong className="text-xs uppercase font-bold text-[#003399] block">
                      4. Conclusions & Clinical Implications
                    </strong>
                    <p className="text-xs text-[#182230] leading-relaxed">{selectedAbstract.conclusion}</p>
                  </div>
                )}

                {!selectedAbstract.introduction && selectedAbstract.fullAbstractText && (
                  <div className="space-y-1">
                    <p className="text-xs text-[#182230] leading-relaxed whitespace-pre-line">
                      {selectedAbstract.fullAbstractText}
                    </p>
                  </div>
                )}
              </div>

              {/* Official Conference Citation */}
              <div className="p-4 rounded-xl bg-[#EBF1FA] border border-[#003399]/20 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#003399]">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>How to Cite this Paper</span>
                </div>
                <p className="font-mono text-[11px] text-[#182230] bg-[#FFFDF9] p-2.5 rounded border border-[#E5DCCB]">
                  {selectedAbstract.presentingAuthorName} et al. (2027). "{selectedAbstract.title}".{' '}
                  <em>
                    Proceedings of the 11th Annual Conference of Telangana Neurosciences Society (TNSCON 2027)
                  </em>
                  , Hyderabad, Telangana. Ref: {selectedAbstract.submissionId}.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#FAF5ED] border-t border-[#E5DCCB] flex items-center justify-between">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg bg-[#FAF5ED] hover:bg-[#EBF1FA] border border-[#003399]/30 text-[#003399] font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Abstract</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedAbstract(null)}
                className="px-6 py-2 rounded-lg bg-[#003399] hover:bg-[#002266] text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AbstractViewerPage;
