import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Search,
  Award,
  Users,
  Send
} from 'lucide-react';
import { abstractTopics } from '../../data/conferenceData';
import { ClientAdvisoryNotice } from '../../components/ui/ClientAdvisoryNotice';
import { api } from '../../services/api';
import { AbstractSubmissionData } from '../../types/types';

export const AbstractSubmissionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'guidelines' | 'submit' | 'status'>('submit');

  // Submission Form State
  const [category, setCategory] = useState<'Award Paper Presentation' | 'Free Paper Presentation' | 'Poster Presentation'>('Free Paper Presentation');
  const [specialty, setSpecialty] = useState<'Neurosurgery' | 'Neurology'>('Neurosurgery');
  const [subTopic, setSubTopic] = useState('Skull Base Surgery');
  const [title, setTitle] = useState('');
  const [authorTitle, setAuthorTitle] = useState('Dr.');
  const [presentingAuthorName, setPresentingAuthorName] = useState('');
  const [presentingAuthorEmail, setPresentingAuthorEmail] = useState('');
  const [presentingAuthorPhone, setPresentingAuthorPhone] = useState('');
  const [presentingAuthorDesignation, setPresentingAuthorDesignation] = useState('Senior Resident / Consultant');
  const [presentingAuthorInstitution, setPresentingAuthorInstitution] = useState('');
  const [isResident, setIsResident] = useState(false);
  const [coAuthors, setCoAuthors] = useState('');

  // Structured Abstract Sections
  const [introduction, setIntroduction] = useState('');
  const [methods, setMethods] = useState('');
  const [results, setResults] = useState('');
  const [conclusion, setConclusion] = useState('');

  // File uploads
  const [abstractFile, setAbstractFile] = useState<File | null>(null);
  const [bonafideFile, setBonafideFile] = useState<File | null>(null);

  // Status & Feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Status Tracker State
  const [searchQuery, setSearchQuery] = useState('');
  const [trackedAbstract, setTrackedAbstract] = useState<any | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [trackError, setTrackError] = useState('');

  // Live Word Count calculation
  const fullText = `${introduction} ${methods} ${results} ${conclusion}`.trim();
  const wordCount = fullText ? fullText.split(/\s+/).filter(Boolean).length : 0;
  const isWordLimitExceeded = wordCount > 250;

  const handleSpecialtyChange = (spec: 'Neurosurgery' | 'Neurology') => {
    setSpecialty(spec);
    setSubTopic(spec === 'Neurosurgery' ? abstractTopics.neurosurgery[0] : abstractTopics.neurology[0]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'abstract' | 'bonafide') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (type === 'abstract') {
        const ext = file.name.split('.').pop()?.toLowerCase();
        if (ext !== 'doc' && ext !== 'docx') {
          alert('Please upload a Microsoft Word document (.doc or .docx)');
          return;
        }
        setAbstractFile(file);
      } else {
        setBonafideFile(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (isWordLimitExceeded) {
      setErrorMessage(`Your abstract currently contains ${wordCount} words. The strict limit is 250 words.`);
      return;
    }

    if (wordCount < 50) {
      setErrorMessage('Please provide a complete structured abstract (minimum 50 words).');
      return;
    }

    if (category === 'Award Paper Presentation' && !isResident) {
      setErrorMessage('Award Paper Presenters must be postgraduate residents / fellows with a bonafide certificate from the department head.');
      return;
    }

    try {
      setIsSubmitting(true);
      const submissionData: AbstractSubmissionData = {
        category,
        specialty,
        subTopic,
        title,
        wordCount,
        presentingAuthorTitle: authorTitle,
        presentingAuthorName,
        presentingAuthorEmail,
        presentingAuthorPhone,
        presentingAuthorDesignation,
        presentingAuthorInstitution,
        isResident,
        coAuthors,
        introduction,
        methods,
        results,
        conclusion,
        fullAbstractText: fullText,
        abstractFile,
        bonafideFile
      };

      const res = await api.submitAbstract(submissionData);
      setSubmitSuccess(res.submission);
    } catch (err: any) {
      setErrorMessage(err.message || 'Submission failed. Please check the form.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setTrackError('');
    setTrackedAbstract(null);
    try {
      setIsTracking(true);
      const res = await api.getAbstractStatus(searchQuery.trim());
      setTrackedAbstract(res.abstract);
    } catch (err: any) {
      setTrackError(err.message || 'No abstract found matching this query.');
    } finally {
      setIsTracking(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-[#182230]">
      
      {/* Banner */}
      <section className="bg-[#001A4D] border-b border-[#003399]/40 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3 text-left">
            <span className="text-xs uppercase tracking-widest text-[#FFCC00] font-bold px-3 py-1 rounded-full bg-white/10 border border-[#D49B00]/40">
              Call For Papers & E-Posters
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-white font-bold tracking-tight">
              Abstract Submission Portal
            </h1>
            <p className="text-sm text-[#FAF5ED]/85 font-light leading-relaxed">
              Open from <strong>05 November 2026 to 31 January 2027</strong>. Present your original research to the neuroscience community at TNSCON 2027.
            </p>
          </div>
        </div>
      </section>

      {/* Discrepancy & Transparency Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 relative z-10 space-y-3">
        <ClientAdvisoryNotice type="abstract" />
        <ClientAdvisoryNotice type="eposter" />
      </div>

      {/* Main Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Navigation Tabs */}
          <div className="flex border-b border-[#E5DCCB] mb-8">
            <button
              onClick={() => setActiveTab('submit')}
              className={`py-3 px-6 font-bold text-sm border-b-2 cursor-pointer transition-colors ${
                activeTab === 'submit'
                  ? 'border-[#003399] text-[#003399] bg-[#FFFDF9] rounded-t-lg'
                  : 'border-transparent text-[#556070] hover:text-[#003399]'
              }`}
            >
              Submit Abstract Form
            </button>
            <button
              onClick={() => setActiveTab('guidelines')}
              className={`py-3 px-6 font-bold text-sm border-b-2 cursor-pointer transition-colors ${
                activeTab === 'guidelines'
                  ? 'border-[#003399] text-[#003399] bg-[#FFFDF9] rounded-t-lg'
                  : 'border-transparent text-[#556070] hover:text-[#003399]'
              }`}
            >
              Guidelines & Topics
            </button>
            <button
              onClick={() => setActiveTab('status')}
              className={`py-3 px-6 font-bold text-sm border-b-2 cursor-pointer transition-colors ${
                activeTab === 'status'
                  ? 'border-[#003399] text-[#003399] bg-[#FFFDF9] rounded-t-lg'
                  : 'border-transparent text-[#556070] hover:text-[#003399]'
              }`}
            >
              Track Submission Status
            </button>
          </div>

          {/* TAB 1: SUBMISSION FORM */}
          {activeTab === 'submit' && (
            <div className="bg-[#FFFDF9] rounded-2xl p-6 sm:p-10 border border-[#E5DCCB] shadow-sm max-w-4xl mx-auto">
              
              {submitSuccess ? (
                <div className="text-center py-10 space-y-5">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#D49B00] uppercase tracking-wider">
                      Successfully Received
                    </span>
                    <h2 className="font-serif text-3xl font-bold text-[#003399]">
                      Abstract Submitted Successfully!
                    </h2>
                    <p className="text-sm text-[#556070] max-w-lg mx-auto">
                      Your submission has been assigned a unique tracking identifier and forwarded to the TNSCON 2027 Scientific Committee.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-[#EBF1FA] border border-[#D49B00] max-w-md mx-auto text-left text-sm space-y-2">
                    <div className="flex justify-between border-b border-[#E5DCCB] pb-2">
                      <span className="text-[#556070]">Submission ID:</span>
                      <strong className="text-[#003399] font-manrope">{submitSuccess.submissionId}</strong>
                    </div>
                    <div className="flex justify-between border-b border-[#E5DCCB] pb-2">
                      <span className="text-[#556070]">Category:</span>
                      <span className="font-semibold text-[#182230]">{submitSuccess.category}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#E5DCCB] pb-2">
                      <span className="text-[#556070]">Specialty:</span>
                      <span className="font-semibold text-[#182230]">{submitSuccess.specialty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#556070]">Word Count:</span>
                      <span className="font-bold text-emerald-700">{submitSuccess.wordCount} words (Passes &le;250)</span>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-center gap-4">
                    <button
                      onClick={() => {
                        setSubmitSuccess(null);
                        setTitle('');
                        setIntroduction('');
                        setMethods('');
                        setResults('');
                        setConclusion('');
                        setAbstractFile(null);
                      }}
                      className="px-5 py-2.5 rounded-lg bg-[#003399] text-white font-bold text-xs hover:bg-[#002266] transition-colors cursor-pointer"
                    >
                      Submit Another Abstract
                    </button>
                    <button
                      onClick={() => {
                        setSearchQuery(submitSuccess.submissionId);
                        setActiveTab('status');
                      }}
                      className="px-5 py-2.5 rounded-lg border border-[#003399] text-[#003399] font-bold text-xs hover:bg-[#EBF1FA] transition-colors cursor-pointer"
                    >
                      View in Tracker
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8 text-left">
                  
                  {/* Category Selection */}
                  <div className="space-y-3">
                    <label className="block text-xs uppercase font-bold tracking-wider text-[#003399]">
                      1. Select Presentation Category *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'Award Paper Presentation', title: 'Award Paper', subtitle: 'Resident competition with HOD certificate' },
                        { id: 'Free Paper Presentation', title: 'Free Oral Paper', subtitle: 'Open slot for original research' },
                        { id: 'Poster Presentation', title: 'E-Poster Presentation', subtitle: 'Digital 42" LCD panel presentation' }
                      ].map((cat) => (
                        <div
                          key={cat.id}
                          onClick={() => setCategory(cat.id as any)}
                          className={`relative overflow-hidden p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            category === cat.id
                              ? 'border-[#003399] bg-[#EBF1FA]/70 shadow-sm'
                              : 'border-[#E5DCCB] hover:border-[#003399] bg-[#FFFDF9]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <strong className="text-sm text-[#003399] font-bold">{cat.title}</strong>
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              category === cat.id ? 'border-[#003399] bg-[#003399]' : 'border-gray-400'
                            }`}>
                              {category === cat.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                          </div>
                          <p className="text-[11px] text-[#556070] leading-snug">{cat.subtitle}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Specialty & Sub-Topic Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-bold tracking-wider text-[#003399] mb-1.5">
                        2. Discipline / Specialty *
                      </label>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => handleSpecialtyChange('Neurosurgery')}
                          className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                            specialty === 'Neurosurgery'
                              ? 'bg-[#003399] text-white border-[#003399]'
                              : 'bg-[#FAF5ED] text-[#556070] border-[#E5DCCB]'
                          }`}
                        >
                          Neurosurgery
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSpecialtyChange('Neurology')}
                          className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                            specialty === 'Neurology'
                              ? 'bg-[#003399] text-white border-[#003399]'
                              : 'bg-[#FAF5ED] text-[#556070] border-[#E5DCCB]'
                          }`}
                        >
                          Neurology
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-bold tracking-wider text-[#003399] mb-1.5">
                        3. Topic Classification *
                      </label>
                      <select
                        value={subTopic}
                        onChange={(e) => setSubTopic(e.target.value)}
                        className="w-full py-2.5 px-3 text-xs rounded-lg border border-[#E5DCCB] bg-[#FAF5ED] text-[#182230] font-medium focus:outline-none focus:border-[#003399]"
                      >
                        {(specialty === 'Neurosurgery' ? abstractTopics.neurosurgery : abstractTopics.neurology).map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-xs uppercase font-bold tracking-wider text-[#003399] mb-1.5">
                      4. Title of Abstract (Concise, avoid abbreviations) *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Endoscopic Transsphenoidal Resection in Suprasellar Pituitary Lesions..."
                      className="w-full p-3 rounded-lg border border-[#E5DCCB] text-sm focus:outline-none focus:border-[#003399] bg-[#FAF5ED] text-[#182230]"
                    />
                  </div>

                  {/* Presenting Author Information */}
                  <div className="space-y-4 pt-4 border-t border-[#E5DCCB]">
                    <h3 className="text-sm font-bold text-[#003399] uppercase tracking-wider">
                      5. Presenting Author Information
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs text-[#556070] mb-1">Title</label>
                        <select
                          value={authorTitle}
                          onChange={(e) => setAuthorTitle(e.target.value)}
                          className="w-full p-2.5 rounded-lg border border-[#E5DCCB] text-xs bg-[#FAF5ED] text-[#182230]"
                        >
                          <option>Dr.</option>
                          <option>Prof.</option>
                          <option>Mr.</option>
                          <option>Ms.</option>
                        </select>
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-xs text-[#556070] mb-1">Full Name of Presenting Author *</label>
                        <input
                          type="text"
                          required
                          value={presentingAuthorName}
                          onChange={(e) => setPresentingAuthorName(e.target.value)}
                          placeholder="e.g. Ananya Sarma"
                          className="w-full p-2.5 rounded-lg border border-[#E5DCCB] text-xs bg-[#FAF5ED] text-[#182230] focus:border-[#003399]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-[#556070] mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={presentingAuthorEmail}
                          onChange={(e) => setPresentingAuthorEmail(e.target.value)}
                          placeholder="presenter@hospital.org"
                          className="w-full p-2.5 rounded-lg border border-[#E5DCCB] text-xs bg-[#FAF5ED] text-[#182230] focus:border-[#003399]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-[#556070] mb-1">Mobile / WhatsApp Number *</label>
                        <input
                          type="tel"
                          required
                          value={presentingAuthorPhone}
                          onChange={(e) => setPresentingAuthorPhone(e.target.value)}
                          placeholder="+91 98490 12345"
                          className="w-full p-2.5 rounded-lg border border-[#E5DCCB] text-xs bg-[#FAF5ED] text-[#182230] focus:border-[#003399]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-[#556070] mb-1">Institution / Medical College / Hospital *</label>
                        <input
                          type="text"
                          required
                          value={presentingAuthorInstitution}
                          onChange={(e) => setPresentingAuthorInstitution(e.target.value)}
                          placeholder="e.g. Nizam's Institute of Medical Sciences, Hyderabad"
                          className="w-full p-2.5 rounded-lg border border-[#E5DCCB] text-xs bg-[#FAF5ED] text-[#182230] focus:border-[#003399]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-[#556070] mb-1">Co-Authors (comma-separated)</label>
                        <input
                          type="text"
                          value={coAuthors}
                          onChange={(e) => setCoAuthors(e.target.value)}
                          placeholder="Dr. K. Rao, Dr. S. Naik, etc."
                          className="w-full p-2.5 rounded-lg border border-[#E5DCCB] text-xs bg-[#FAF5ED] text-[#182230] focus:border-[#003399]"
                        />
                      </div>
                    </div>

                    {/* Resident Checkbox */}
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="isResidentCheckbox"
                        checked={isResident}
                        onChange={(e) => setIsResident(e.target.checked)}
                        className="w-4 h-4 text-[#003399] rounded cursor-pointer accent-[#003399]"
                      />
                      <label htmlFor="isResidentCheckbox" className="text-xs text-[#182230] font-medium cursor-pointer">
                        Presenting author is a Post-Graduate Resident / Trainee (Mandatory for Award Paper)
                      </label>
                    </div>
                  </div>

                  {/* Structured Abstract Fields */}
                  <div className="space-y-4 pt-4 border-t border-[#E5DCCB]">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-[#003399] uppercase tracking-wider">
                          6. Structured Abstract Body
                        </h3>
                        <p className="text-[11px] text-[#556070]">
                          Do not include author names, hospital, or institute names in this text.
                        </p>
                      </div>

                      {/* Live Counter Badge */}
                      <div className={`px-3 py-1.5 rounded-lg font-manrope font-bold text-xs border ${
                        isWordLimitExceeded
                          ? 'bg-red-50 text-red-700 border-red-300 animate-pulse'
                          : wordCount > 220
                          ? 'bg-amber-50 text-amber-700 border-amber-300'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      }`}>
                        Word Count: {wordCount} / 250 max
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#182230] mb-1">Introduction & Objective *</label>
                        <textarea
                          rows={2}
                          required
                          value={introduction}
                          onChange={(e) => setIntroduction(e.target.value)}
                          placeholder="Brief background and the aim of the study..."
                          className="w-full p-2.5 rounded-lg border border-[#E5DCCB] text-xs focus:border-[#003399] bg-[#FAF5ED] text-[#182230]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#182230] mb-1">Methods *</label>
                        <textarea
                          rows={2}
                          required
                          value={methods}
                          onChange={(e) => setMethods(e.target.value)}
                          placeholder="Study design, patient cohort, inclusion criteria, statistical evaluation..."
                          className="w-full p-2.5 rounded-lg border border-[#E5DCCB] text-xs focus:border-[#003399] bg-[#FAF5ED] text-[#182230]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#182230] mb-1">Results *</label>
                        <textarea
                          rows={2}
                          required
                          value={results}
                          onChange={(e) => setResults(e.target.value)}
                          placeholder="Key clinical outcomes, quantitative data, complication rates..."
                          className="w-full p-2.5 rounded-lg border border-[#E5DCCB] text-xs focus:border-[#003399] bg-[#FAF5ED] text-[#182230]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#182230] mb-1">Conclusion *</label>
                        <textarea
                          rows={2}
                          required
                          value={conclusion}
                          onChange={(e) => setConclusion(e.target.value)}
                          placeholder="Clinical significance, take-home recommendation..."
                          className="w-full p-2.5 rounded-lg border border-[#E5DCCB] text-xs focus:border-[#003399] bg-[#FAF5ED] text-[#182230]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* File Uploads */}
                  <div className="space-y-4 pt-4 border-t border-[#E5DCCB]">
                    <h3 className="text-sm font-bold text-[#003399] uppercase tracking-wider">
                      7. Document Uploads (DOC / DOCX Required)
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Abstract Word File */}
                      <div className="p-4 rounded-xl border border-dashed border-[#D8CEBC] bg-[#FAF5ED] space-y-2">
                        <label className="block text-xs font-bold text-[#003399]">
                          Abstract File (.doc or .docx) *
                        </label>
                        <input
                          type="file"
                          accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          onChange={(e) => handleFileChange(e, 'abstract')}
                          className="text-xs text-[#556070] file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#003399] file:text-white hover:file:bg-[#002266]"
                        />
                        <p className="text-[10px] text-[#556070]">
                          Must not exceed 250 words. Double spaced, 12pt font.
                        </p>
                      </div>

                      {/* Resident Bonafide Certificate */}
                      <div className={`p-4 rounded-xl border border-dashed ${
                        category === 'Award Paper Presentation'
                          ? 'border-[#D49B00] bg-[#FFF8E7]'
                          : 'border-[#D8CEBC] bg-[#FAF5ED]'
                      } space-y-2`}>
                        <label className="block text-xs font-bold text-[#003399]">
                          HOD Bonafide Certificate {category === 'Award Paper Presentation' && <span className="text-red-600">*</span>}
                        </label>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange(e, 'bonafide')}
                          className="text-xs text-[#556070] file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#003399] file:text-white hover:file:bg-[#002266]"
                        />
                        <p className="text-[10px] text-[#556070]">
                          Mandatory for residents submitting Award Paper presentations.
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* Submission Error Banner */}
                  {errorMessage && (
                    <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Declaration and Submit CTA */}
                  <div className="pt-4 border-t border-[#E5DCCB] space-y-4">
                    <p className="text-xs text-[#556070] leading-relaxed">
                      By submitting, I confirm that this abstract is original, unpublished, and conforms to all scientific guidelines. I understand that all presenters must complete delegate registration by <strong>31 January 2027</strong>.
                    </p>

                    <button
                      type="submit"
                      disabled={isSubmitting || isWordLimitExceeded}
                      className={`w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                        isWordLimitExceeded || isSubmitting
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-[#003399] hover:bg-[#002266] text-white shadow-lg cursor-pointer'
                      }`}
                    >
                      <Send className="w-4 h-4 text-[#FFCC00]" />
                      <span>{isSubmitting ? 'Validating & Submitting...' : 'Submit Abstract to Scientific Committee'}</span>
                    </button>
                  </div>

                </form>
              )}

            </div>
          )}

          {/* TAB 2: GUIDELINES & TOPICS */}
          {activeTab === 'guidelines' && (
            <div className="space-y-8 max-w-4xl mx-auto text-left">
              
              {/* Category Rules Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="relative overflow-hidden bg-[#FFFDF9] p-6 rounded-2xl border border-[#E5DCCB] shadow-sm space-y-3 hover:border-[#003399] transition-all">
                  <div className="w-10 h-10 rounded-lg bg-[#001A4D] text-[#FFCC00] flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#003399]">
                    Award Paper Guidelines
                  </h3>
                  <ul className="text-xs text-[#556070] space-y-1.5 list-disc pl-4">
                    <li>Presenter must be a resident / trainee.</li>
                    <li>Must be accompanied by a bonafide letter from HOD.</li>
                    <li>Full paper submitted if selected.</li>
                    <li>Strict 250 words limit in 12pt font.</li>
                    <li>Structured: Intro, Methods, Results, Conclusion.</li>
                    <li>One author = one Award presentation.</li>
                    <li>Mandatory conference delegate registration.</li>
                  </ul>
                </div>

                <div className="relative overflow-hidden bg-[#FFFDF9] p-6 rounded-2xl border border-[#E5DCCB] shadow-sm space-y-3 hover:border-[#003399] transition-all">
                  <div className="w-10 h-10 rounded-lg bg-[#001A4D] text-[#FFCC00] flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#003399]">
                    Free Paper Guidelines
                  </h3>
                  <ul className="text-xs text-[#556070] space-y-1.5 list-disc pl-4">
                    <li>Original, unpublished work of authors.</li>
                    <li>Must not exceed 250 words.</li>
                    <li>Upload in DOC or DOCX format.</li>
                    <li>No identifying names in text.</li>
                    <li>Free papers may be converted to E-Posters by committee.</li>
                    <li>Presenters must register by 31 Jan 2027.</li>
                  </ul>
                </div>

                <div className="relative overflow-hidden bg-[#FFFDF9] p-6 rounded-2xl border border-[#E5DCCB] shadow-sm space-y-3 hover:border-[#D49B00] transition-all">
                  <div className="w-10 h-10 rounded-lg bg-[#001A4D] text-[#FFCC00] flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#003399]">
                    E-Poster Guidelines
                  </h3>
                  <ul className="text-xs text-[#556070] space-y-1.5 list-disc pl-4">
                    <li>Displayed on standard 42" LCD digital screens.</li>
                    <li>Single slide per E-poster.</li>
                    <li>Standard 16:9 ratio display (portrait orientation advisory).</li>
                    <li>File format: JPEG or PPT slide upload.</li>
                    <li>File size: 5 MB to 10 MB maximum.</li>
                    <li>Uploaded in Conference Preview Room.</li>
                  </ul>
                </div>

              </div>

              {/* Topics Grid */}
              <div className="bg-[#FFFDF9] p-8 rounded-2xl border border-[#E5DCCB] shadow-sm space-y-6">
                <h3 className="font-serif text-2xl font-bold text-[#003399]">
                  Abstract Sub-Topics
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider text-[#003399] mb-3 pb-2 border-b border-[#E5DCCB]">
                      Neurosurgery Tracks
                    </h4>
                    <ol className="text-xs text-[#182230] space-y-2 list-decimal pl-4">
                      {abstractTopics.neurosurgery.map((t) => (
                        <li key={t} className="font-medium">{t}</li>
                      ))}
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider text-[#003399] mb-3 pb-2 border-b border-[#E5DCCB]">
                      Neurology Tracks
                    </h4>
                    <ol className="text-xs text-[#182230] space-y-2 list-decimal pl-4">
                      {abstractTopics.neurology.map((t) => (
                        <li key={t} className="font-medium">{t}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: STATUS TRACKER */}
          {activeTab === 'status' && (
            <div className="bg-[#FFFDF9] rounded-2xl p-8 border border-[#E5DCCB] shadow-sm max-w-2xl mx-auto text-left space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest font-bold text-[#003399]">
                  Track Review Status
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#003399] mt-1">
                  Check Abstract Acceptance Status
                </h2>
                <p className="text-xs text-[#556070] mt-1">
                  Enter your assigned Submission ID (e.g. <code>ABS-TNS27-101</code>) or the registered Presenting Author email address.
                </p>
              </div>

              <form onSubmit={handleLookup} className="flex gap-2">
                <input
                  type="text"
                  required
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter Submission ID or Email..."
                  className="flex-1 p-3 rounded-lg border border-[#E5DCCB] text-xs focus:outline-none focus:border-[#003399] bg-[#FAF5ED] text-[#182230]"
                />
                <button
                  type="submit"
                  disabled={isTracking}
                  className="px-5 py-3 rounded-lg bg-[#003399] text-white font-bold text-xs hover:bg-[#002266] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{isTracking ? 'Searching...' : 'Track'}</span>
                </button>
              </form>

              {trackError && (
                <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs">
                  {trackError}
                </div>
              )}

              {trackedAbstract && (
                <div className="p-5 rounded-xl bg-[#FAF5ED] border border-[#E5DCCB] space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E5DCCB] pb-3">
                    <div>
                      <span className="text-[10px] text-[#556070] uppercase tracking-wider block">Submission ID</span>
                      <strong className="text-sm font-manrope text-[#003399]">{trackedAbstract.submissionId}</strong>
                    </div>
                    <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${
                      trackedAbstract.status === 'Accepted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : trackedAbstract.status === 'Rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {trackedAbstract.status}
                    </span>
                  </div>

                  <div className="text-xs space-y-1.5 text-[#182230]">
                    <p><strong>Title:</strong> {trackedAbstract.title}</p>
                    <p><strong>Author:</strong> {trackedAbstract.author}</p>
                    <p><strong>Institution:</strong> {trackedAbstract.institution}</p>
                    <p><strong>Track:</strong> {trackedAbstract.specialty} • {trackedAbstract.category}</p>
                    {trackedAbstract.reviewerNotes && (
                      <div className="mt-2 p-2.5 rounded bg-[#FFFDF9] border border-[#E5DCCB]">
                        <strong className="block text-[11px] text-[#003399]">Scientific Committee Notes:</strong>
                        <p className="text-[11px] text-[#556070] mt-0.5">{trackedAbstract.reviewerNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </section>

    </div>
  );
};

export default AbstractSubmissionPage;
