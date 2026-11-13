import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  CheckCircle2,
  AlertCircle,
  Download,
  Building,
  ArrowRight,
  ShieldCheck,
  Search,
  Sparkles
} from 'lucide-react';
import { conferenceInfo, registrationCategories, registrationTariffGrid } from '../../data/conferenceData';
import { InteractiveHoverButton } from '../../components/ui/InteractiveHoverButton';
import { api } from '../../services/api';
import { generateRegistrationReceiptPDF } from '../../services/receiptGenerator';
import { RegistrationFormData } from '../../types/types';

export const RegistrationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preselectedCategory = searchParams.get('category');

  const [activeTab, setActiveTab] = useState<'register' | 'fees' | 'lookup'>('register');
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [formData, setFormData] = useState<RegistrationFormData>({
    title: 'Dr.',
    firstName: '',
    lastName: '',
    gender: 'Male',
    designation: 'Consultant',
    qualification: 'MCh / DM / DNB',
    medicalCouncilNo: '',
    hospital: '',
    address: '',
    city: 'Hyderabad',
    state: 'Telangana',
    pinCode: '',
    mobile: '',
    email: '',
    category: preselectedCategory || registrationCategories[0].name,
    fee: registrationCategories[0].fee,
    baseFee: registrationCategories[0].fee,
    includeWorkshop: false,
    workshopFee: 0,
    transactionId: '',
    paymentScreenshot: null
  });

  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedRegistration, setCompletedRegistration] = useState<any | null>(null);

  // Status Lookup State
  const [lookupQuery, setLookupQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [lookupResult, setLookupResult] = useState<any | null>(null);
  const [lookupError, setLookupError] = useState('');

  // Synchronize category fee and workshop add-on
  useEffect(() => {
    const found = registrationCategories.find(c => c.name === formData.category) || registrationCategories[0];
    const base = found.fee;
    const workshop = (formData.includeWorkshop && found.workshopAvailable) ? 5500 : 0;
    setFormData(prev => ({
      ...prev,
      baseFee: base,
      workshopFee: workshop,
      fee: base + workshop
    }));
  }, [formData.category, formData.includeWorkshop]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds the 5MB maximum limit.');
        return;
      }
      setFormData(prev => ({ ...prev, paymentScreenshot: file }));

      const reader = new FileReader();
      reader.onload = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!formData.firstName.trim() || !formData.hospital.trim() || !formData.mobile.trim() || !formData.email.trim()) {
      setErrorMessage('Please fill in all mandatory delegate contact and hospital details.');
      return;
    }
    setCurrentStep(2);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.transactionId.trim()) {
      setErrorMessage('Please enter your Bank UTR or Transaction Reference number.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.register({
        ...formData,
        paymentScreenshotBase64: screenshotPreview || undefined
      });

      setCompletedRegistration(res.registration);
      setCurrentStep(3);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPDF = () => {
    if (completedRegistration) {
      generateRegistrationReceiptPDF({
        registrationId: completedRegistration.registrationId,
        formData: {
          ...formData,
          fee: completedRegistration.fee
        },
        submittedAt: completedRegistration.createdAt
      });
    }
  };

  const handleLookupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupQuery.trim()) return;
    setLookupError('');
    setLookupResult(null);
    try {
      setIsSearching(true);
      const res = await api.getRegistrationStatus(lookupQuery.trim());
      setLookupResult(res.registration);
    } catch (err: any) {
      setLookupError(err.message || 'No registration record found matching this query.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-[#182230]">
      
      {/* Banner */}
      <section className="bg-[#001A4D] border-b border-[#003399]/40 text-white py-14 sm:py-16 text-left relative overflow-hidden">
        <div 
          className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-[#D49B00]/15 blur-3xl pointer-events-none" 
          aria-hidden="true" 
        />
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#FFCC00] font-bold px-3 py-1 rounded-full bg-white/10 border border-white/15">
              Official Conference Registration
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-white font-bold tracking-tight">
              Delegate Registration Portal
            </h1>
            <p className="text-sm sm:text-base text-[#FAF5ED]/85 font-light leading-relaxed">
              Secure your delegate credentials for TNSCON 2027. Early Bird tariffs are currently in effect through 15th January 2027.
            </p>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <section className="py-10 sm:py-12">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          
          {/* Top Tabs */}
          <div className="flex overflow-x-auto no-scrollbar border-b border-[#E5DCCB] mb-8 gap-1 whitespace-nowrap">
            <button
              onClick={() => setActiveTab('register')}
              className={`py-3 px-4 sm:px-6 font-bold text-xs sm:text-sm border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
                activeTab === 'register'
                  ? 'border-[#003399] text-[#003399] bg-[#FFFDF9] rounded-t-lg'
                  : 'border-transparent text-[#556070] hover:text-[#003399]'
              }`}
            >
              Registration Workflow
            </button>
            <button
              onClick={() => setActiveTab('fees')}
              className={`py-3 px-4 sm:px-6 font-bold text-xs sm:text-sm border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
                activeTab === 'fees'
                  ? 'border-[#003399] text-[#003399] bg-[#FFFDF9] rounded-t-lg'
                  : 'border-transparent text-[#556070] hover:text-[#003399]'
              }`}
            >
              Fee Structure & Tariff Grid
            </button>
            <button
              onClick={() => setActiveTab('lookup')}
              className={`py-3 px-4 sm:px-6 font-bold text-xs sm:text-sm border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
                activeTab === 'lookup'
                  ? 'border-[#003399] text-[#003399] bg-[#FFFDF9] rounded-t-lg'
                  : 'border-transparent text-[#556070] hover:text-[#003399]'
              }`}
            >
              Track Registration Status
            </button>
          </div>

          {/* TAB 1: REGISTRATION WORKFLOW */}
          {activeTab === 'register' && (
            <div className="max-w-4xl mx-auto bg-[#FFFDF9] rounded-2xl p-6 sm:p-10 border border-[#E5DCCB] shadow-sm text-left">
              
              {/* Stepper Header */}
              {currentStep < 3 && (
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#E5DCCB]">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      currentStep === 1 ? 'bg-[#003399] text-white' : 'bg-emerald-600 text-white'
                    }`}>
                      {currentStep > 1 ? '✓' : '1'}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#003399] block">Step 1</span>
                      <span className="text-xs text-[#556070]">Delegate Particulars</span>
                    </div>
                  </div>

                  <div className="w-16 h-0.5 bg-[#E5DCCB]" />

                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      currentStep === 2 ? 'bg-[#003399] text-white' : 'bg-[#FAF5ED] text-[#556070] border border-[#E5DCCB]'
                    }`}>
                      2
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#182230] block">Step 2</span>
                      <span className="text-xs text-[#556070]">Payment & Proof</span>
                    </div>
                  </div>

                  <div className="w-16 h-0.5 bg-[#E5DCCB]" />

                  <div className="flex items-center gap-3 opacity-60">
                    <div className="w-8 h-8 rounded-full bg-[#FAF5ED] text-[#556070] border border-[#E5DCCB] flex items-center justify-center font-bold text-xs">
                      3
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#556070] block">Step 3</span>
                      <span className="text-xs text-[#556070]">Receipt</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 1: FORM */}
              {currentStep === 1 && (
                <form onSubmit={handleStep1Next} className="space-y-6">
                  
                  {/* Category Selection */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs uppercase font-bold tracking-wider text-[#182230]">
                        1. Select Registration Category *
                      </label>
                      <span className="text-[10.5px] font-bold text-[#D49B00] bg-[#D49B00]/10 border border-[#D49B00]/30 px-2.5 py-0.5 rounded-full">
                        🟢 Early Bird Active (Till 15th Jan 2027)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {registrationCategories.map((c) => (
                        <div
                          key={c.id}
                          onClick={() => setFormData(prev => ({ ...prev, category: c.name }))}
                          className={`relative overflow-hidden p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                            formData.category === c.name
                              ? 'border-[#003399] bg-[#EBF1FA]/80 shadow-xs ring-1 ring-[#003399]'
                              : 'border-[#E5DCCB] hover:border-[#003399] bg-[#FFFDF9]'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#003399]/10 text-[#003399]">
                                {c.badge}
                              </span>
                              <span className="font-manrope font-extrabold text-base text-[#003399]">
                                ₹{c.fee.toLocaleString('en-IN')}
                              </span>
                            </div>
                            <span className="text-sm font-bold text-[#182230] block">{c.name}</span>
                            <span className="text-[11px] text-[#556070] mt-1 block leading-snug">{c.description}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pre-Conference Workshop Option (Available for Delegate & Resident) */}
                    {formData.category !== 'Accompany Person' && (
                      <div 
                        onClick={() => setFormData(prev => ({ ...prev, includeWorkshop: !prev.includeWorkshop }))}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between mt-3 ${
                          formData.includeWorkshop 
                            ? 'border-[#D49B00] bg-[#FFF8E7] shadow-xs' 
                            : 'border-[#E5DCCB] hover:border-[#003399] bg-[#FFFDF9]'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            id="workshopAddon"
                            checked={formData.includeWorkshop}
                            onChange={(e) => setFormData(prev => ({ ...prev, includeWorkshop: e.target.checked }))}
                            className="w-4 h-4 text-[#003399] rounded mt-0.5 cursor-pointer accent-[#003399]"
                          />
                          <div>
                            <label htmlFor="workshopAddon" className="block text-xs font-bold text-[#182230] cursor-pointer">
                              Add Pre-Conference Hands-on Workshop (+ ₹5,500)
                            </label>
                            <span className="block text-[11px] text-[#556070] mt-0.5">
                              Hands-on masterclasses in surgical corridors & neuro-navigation (12 March 2027).
                            </span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-3">
                          <span className="font-manrope font-extrabold text-sm text-[#D49B00] block">
                            + ₹5,500
                          </span>
                          <span className="text-[9.5px] uppercase font-bold tracking-wider text-[#556070] block">
                            Workshop Add-on
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Live Tariff Summary Banner */}
                    <div className="p-3.5 bg-[#FAF5ED] border border-[#E5DCCB] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#182230]">
                      <span>
                        Slab: <strong>Early Bird</strong> · {formData.category} (₹{(formData.baseFee || formData.fee).toLocaleString('en-IN')})
                        {formData.includeWorkshop ? ' + Workshop (₹5,500)' : ''}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[#556070]">Total Payable:</span>
                        <strong className="font-manrope text-base text-[#003399] font-extrabold">₹{formData.fee.toLocaleString('en-IN')}/-</strong>
                      </div>
                    </div>
                  </div>

                  {/* Personal & Clinical Details */}
                  <div className="pt-4 border-t border-[#E5DCCB] space-y-4">
                    <h3 className="text-xs uppercase font-bold tracking-wider text-[#182230]">
                      Delegate Details
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs text-[#556070] mb-1">Title</label>
                        <select
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className="w-full p-2.5 rounded-lg border border-[#E5DCCB] text-xs bg-[#FAF5ED] text-[#182230] focus:outline-none focus:ring-2 focus:ring-[#003399]/20 focus:border-[#003399] transition-all"
                        >
                          <option>Dr.</option>
                          <option>Prof.</option>
                          <option>Mr.</option>
                          <option>Ms.</option>
                        </select>
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-xs text-[#556070] mb-1">First Name *</label>
                        <input
                          type="text"
                          required
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="e.g. Ramesh"
                          className="w-full p-2.5 rounded-lg border border-[#E5DCCB] text-xs bg-[#FAF5ED] text-[#182230] focus:outline-none focus:ring-2 focus:ring-[#003399]/20 focus:border-[#003399] transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-[#556070] mb-1">Last Name / Surname</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="e.g. Rao"
                          className="w-full p-2.5 rounded-lg border border-[#E5DCCB] text-xs bg-[#FAF5ED] text-[#182230] focus:outline-none focus:ring-2 focus:ring-[#003399]/20 focus:border-[#003399] transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-[#556070] mb-1">Gender</label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full p-2.5 rounded-lg border border-[#E5DCCB] text-xs bg-[#FAF5ED] text-[#182230] focus:outline-none focus:ring-2 focus:ring-[#003399]/20 focus:border-[#003399] transition-all"
                        >
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-[#556070] mb-1">Designation</label>
                        <input
                          type="text"
                          name="designation"
                          value={formData.designation}
                          onChange={handleInputChange}
                          placeholder="e.g. Consultant Neurosurgeon / Senior Resident"
                          className="w-full p-2.5 rounded-lg border border-[#E5DCCB] text-xs bg-[#FAF5ED] text-[#182230] focus:outline-none focus:ring-2 focus:ring-[#003399]/20 focus:border-[#003399] transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-[#556070] mb-1">Medical Council Registration No.</label>
                        <input
                          type="text"
                          name="medicalCouncilNo"
                          value={formData.medicalCouncilNo}
                          onChange={handleInputChange}
                          placeholder="e.g. TSMC-54321"
                          className="w-full p-2.5 rounded-lg border border-[#E5DCCB] text-xs bg-[#FAF5ED] text-[#182230] focus:outline-none focus:ring-2 focus:ring-[#003399]/20 focus:border-[#003399] transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-[#556070] mb-1">Hospital / Medical College / Institute *</label>
                      <input
                        type="text"
                        required
                        name="hospital"
                        value={formData.hospital}
                        onChange={handleInputChange}
                        placeholder="e.g. Nizam's Institute of Medical Sciences (NIMS), Hyderabad"
                        className="w-full p-2.5 rounded-lg border border-[#E5DCCB] text-xs bg-[#FAF5ED] text-[#182230] focus:outline-none focus:ring-2 focus:ring-[#003399]/20 focus:border-[#003399] transition-all"
                      />
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="pt-4 border-t border-[#E5DCCB] space-y-4">
                    <h3 className="text-xs uppercase font-bold tracking-wider text-[#182230]">
                      Contact Coordinates
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-[#556070] mb-1">Mobile / WhatsApp Number *</label>
                        <input
                          type="tel"
                          required
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleInputChange}
                          placeholder="9849012345"
                          className="w-full p-2.5 rounded-lg border border-[#E5DCCB] text-xs bg-[#FAF5ED] text-[#182230] focus:outline-none focus:ring-2 focus:ring-[#003399]/20 focus:border-[#003399] transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-[#556070] mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="doctor@hospital.org"
                          className="w-full p-2.5 rounded-lg border border-[#E5DCCB] text-xs bg-[#FAF5ED] text-[#182230] focus:outline-none focus:ring-2 focus:ring-[#003399]/20 focus:border-[#003399] transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-[#556070] mb-1">City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full p-2.5 rounded-lg border border-[#E5DCCB] text-xs bg-[#FAF5ED] text-[#182230] focus:outline-none focus:ring-2 focus:ring-[#003399]/20 focus:border-[#003399] transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-[#556070] mb-1">State</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full p-2.5 rounded-lg border border-[#E5DCCB] text-xs bg-[#FAF5ED] text-[#182230] focus:outline-none focus:ring-2 focus:ring-[#003399]/20 focus:border-[#003399] transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-[#556070] mb-1">PIN Code</label>
                        <input
                          type="text"
                          name="pinCode"
                          value={formData.pinCode}
                          onChange={handleInputChange}
                          placeholder="500016"
                          className="w-full p-2.5 rounded-lg border border-[#E5DCCB] text-xs bg-[#FAF5ED] text-[#182230] focus:outline-none focus:ring-2 focus:ring-[#003399]/20 focus:border-[#003399] transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="pt-4 border-t border-[#E5DCCB]">
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-[#003399] hover:bg-[#002266] text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Proceed to Payment & Bank Particulars</span>
                      <ArrowRight className="w-4 h-4 text-[#FFCC00]" />
                    </button>
                  </div>

                </form>
              )}

              {/* STEP 2: PAYMENT & PROOF UPLOAD */}
              {currentStep === 2 && (
                <form onSubmit={handleFinalSubmit} className="space-y-6">
                  
                  {/* Summary Bar */}
                  <div className="p-4 rounded-xl bg-[#EBF1FA] border border-[#D49B00]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs text-[#556070] block">Registration Particulars:</span>
                      <strong className="text-sm text-[#003399] block">{formData.category} Registration (Early Bird)</strong>
                      {formData.includeWorkshop && (
                        <span className="text-xs text-[#D49B00] font-medium block mt-0.5">
                          + Hands-on Pre-Conference Workshop Included (₹5,500)
                        </span>
                      )}
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-xs text-[#556070] block">Total Amount Payable:</span>
                      <strong className="font-manrope text-2xl text-[#003399] font-extrabold">₹{formData.fee.toLocaleString('en-IN')}/-</strong>
                    </div>
                  </div>

                  {/* Official Bank Account Details */}
                  <div className="p-5 rounded-xl bg-[#FAF5ED] border border-[#E5DCCB] space-y-4">
                    <div className="flex items-center gap-2 border-b border-[#E5DCCB] pb-3">
                      <Building className="w-5 h-5 text-[#003399]" />
                      <h4 className="font-bold text-sm text-[#182230]">
                        Official Society Bank Details (NEFT / RTGS / IMPS)
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[#556070] block">Account Name:</span>
                        <strong className="text-[#182230]">{conferenceInfo.bankDetails.accountName}</strong>
                      </div>
                      <div>
                        <span className="text-[#556070] block">Bank Name:</span>
                        <strong className="text-[#182230]">{conferenceInfo.bankDetails.bankName}</strong>
                      </div>
                      <div>
                        <span className="text-[#556070] block">Account Number:</span>
                        <strong className="text-[#003399] font-manrope font-bold text-sm">{conferenceInfo.bankDetails.accountNumber}</strong>
                      </div>
                      <div>
                        <span className="text-[#556070] block">IFSC Code:</span>
                        <strong className="text-[#003399] font-manrope font-bold text-sm">{conferenceInfo.bankDetails.ifscCode}</strong>
                      </div>
                      <div>
                        <span className="text-[#556070] block">Branch:</span>
                        <strong className="text-[#182230]">{conferenceInfo.bankDetails.branch}</strong>
                      </div>
                      <div>
                        <span className="text-[#556070] block">UPI ID:</span>
                        <strong className="text-[#D49B00] font-manrope font-bold">{conferenceInfo.bankDetails.upiId}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Transaction ID & Screenshot Upload */}
                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-xs uppercase font-bold tracking-wider text-[#182230] mb-1">
                        Bank Transaction / UTR / Reference Number *
                      </label>
                      <input
                        type="text"
                        required
                        name="transactionId"
                        value={formData.transactionId}
                        onChange={handleInputChange}
                        placeholder="e.g. UTR1234567890 or UPI Ref ID"
                        className="w-full p-3 rounded-lg border border-[#E5DCCB] text-xs font-manrope font-semibold focus:outline-none focus:ring-2 focus:ring-[#003399]/20 focus:border-[#003399] bg-[#FAF5ED] text-[#182230] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-bold tracking-wider text-[#182230] mb-1">
                        Upload Payment Screenshot / Counterfoil *
                      </label>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, application/pdf"
                        onChange={handleFileChange}
                        className="text-xs text-[#556070] file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#003399] file:text-white hover:file:bg-[#002266]"
                      />
                      <p className="text-[10px] text-[#556070] mt-1">
                        Accepted formats: JPG, PNG, PDF. Maximum file size: 5MB.
                      </p>

                      {screenshotPreview && (
                        <div className="mt-3 p-2 bg-[#FAF5ED] rounded border border-[#E5DCCB] inline-block">
                          <img src={screenshotPreview} alt="Screenshot Preview" className="h-28 object-contain rounded" />
                        </div>
                      )}
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="flex gap-4 pt-4 border-t border-[#E5DCCB]">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="py-3 px-5 rounded-xl border border-[#E5DCCB] text-[#556070] text-xs font-semibold hover:bg-[#FAF5ED]"
                    >
                      Back to Step 1
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3.5 rounded-xl bg-[#003399] hover:bg-[#002266] text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#FFCC00]" />
                      <span>{isSubmitting ? 'Verifying & Generating ID...' : 'Submit Registration & Generate Receipt'}</span>
                    </button>
                  </div>

                </form>
              )}

              {/* STEP 3: SUCCESS & RECEIPT DOWNLOAD */}
              {currentStep === 3 && completedRegistration && (
                <div className="text-center py-8 space-y-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-bold text-[#D49B00] uppercase tracking-wider">
                      Registration Received
                    </span>
                    <h2 className="font-serif text-3xl font-bold text-[#003399]">
                      Welcome to TNSCON 2027!
                    </h2>
                    <p className="text-xs text-[#556070] max-w-md mx-auto">
                      Your provisional registration has been logged in the Telangana Neurosciences Society secretariat roster.
                    </p>
                  </div>

                  {/* Summary Card */}
                  <div className="p-6 rounded-2xl bg-[#EBF1FA] border border-[#D49B00] max-w-md mx-auto text-left space-y-3">
                    <div className="flex items-center justify-between border-b border-[#E5DCCB] pb-2">
                      <span className="text-xs text-[#556070]">Registration ID:</span>
                      <strong className="text-base text-[#003399] font-manrope font-bold">
                        {completedRegistration.registrationId}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between border-b border-[#E5DCCB] pb-2">
                      <span className="text-xs text-[#556070]">Delegate Name:</span>
                      <span className="text-xs font-bold text-[#182230]">
                        {completedRegistration.name || `${formData.title} ${formData.firstName} ${formData.lastName}`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-[#E5DCCB] pb-2">
                      <span className="text-xs text-[#556070]">Category:</span>
                      <span className="text-xs font-semibold text-[#003399]">
                        {completedRegistration.category}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-[#E5DCCB] pb-2">
                      <span className="text-xs text-[#556070]">UTR Reference:</span>
                      <span className="text-xs font-manrope font-semibold text-[#182230]">
                        {completedRegistration.transactionId}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#556070]">Payment Status:</span>
                      <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                        Pending Verification
                      </span>
                    </div>
                  </div>

                  {/* Download Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                    <button
                      onClick={handleDownloadPDF}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#003399] hover:bg-[#002266] text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <Download className="w-4 h-4 text-[#FFCC00]" />
                      <span>Download Official Acknowledgement Receipt (PDF)</span>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentStep(1);
                        setCompletedRegistration(null);
                        setFormData({
                          title: 'Dr.',
                          firstName: '',
                          lastName: '',
                          gender: 'Male',
                          designation: 'Consultant',
                          qualification: '',
                          medicalCouncilNo: '',
                          hospital: '',
                          address: '',
                          city: 'Hyderabad',
                          state: 'Telangana',
                          pinCode: '',
                          mobile: '',
                          email: '',
                          category: registrationCategories[0].name,
                          fee: registrationCategories[0].fee,
                          transactionId: '',
                          paymentScreenshot: null
                        });
                      }}
                      className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-[#E5DCCB] text-[#182230] font-semibold text-xs hover:bg-[#FAF5ED]"
                    >
                      Register Another Delegate
                    </button>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* TAB 2: FEES TABLE */}
          {activeTab === 'fees' && (
            <div className="max-w-4xl mx-auto space-y-8">
              
              {/* Official Registration Tariff Matrix (CSV Grid Uploaded) */}
              <div className="bg-[#FFFDF9] rounded-2xl border border-[#E5DCCB] shadow-sm overflow-hidden text-left">
                <div className="p-6 bg-[#001A4D] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#FFCC00] text-xs font-semibold mb-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Official Conference Tariffs</span>
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-white tracking-tight">
                      TNSCON 2027 Registration Grid
                    </h3>
                    <p className="text-[#FAF5ED]/75 text-xs mt-1">
                      Certified conference tariff structure for the 11th Annual Conference of the Telangana Neurosciences Society.
                    </p>
                  </div>
                  <div className="bg-[#D49B00]/20 border border-[#D49B00]/40 px-3.5 py-2 rounded-xl text-xs text-white flex-shrink-0">
                    <span className="block text-[10px] uppercase font-bold text-[#FFCC00]">Current Active Slab</span>
                    <strong className="font-bold text-sm block">Early Bird Tariff</strong>
                  </div>
                </div>

                {/* The Tariff Grid Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-[#FAF5ED] border-b border-[#E5DCCB] text-[#182230]">
                        <th className="py-4 px-6 font-bold uppercase tracking-wider text-xs">
                          Category
                        </th>
                        <th className="py-4 px-6 font-bold uppercase tracking-wider text-xs bg-[#EBF1FA] border-x border-[#E5DCCB] text-[#003399]">
                          <div className="flex items-center gap-1.5">
                            <span>Early Bird</span>
                            <span className="px-1.5 py-0.5 rounded text-[9.5px] font-extrabold bg-[#D49B00] text-[#001A4D]">
                              ACTIVE
                            </span>
                          </div>
                          <span className="block text-[11px] font-normal text-[#556070] lowercase mt-0.5">
                            till 15th jan
                          </span>
                        </th>
                        <th className="py-4 px-6 font-bold uppercase tracking-wider text-xs text-[#182230]">
                          Regular
                          <span className="block text-[11px] font-normal text-[#556070] lowercase mt-0.5">
                            till 25th feb
                          </span>
                        </th>
                        <th className="py-4 px-6 font-bold uppercase tracking-wider text-xs text-[#182230]">
                          Spot
                          <span className="block text-[11px] font-normal text-[#556070] lowercase mt-0.5">
                            from 26th feb
                          </span>
                        </th>
                        <th className="py-4 px-6 font-bold uppercase tracking-wider text-xs text-[#003399] bg-[#FFF8E7]">
                          Workshop
                          <span className="block text-[11px] font-normal text-[#556070] lowercase mt-0.5">
                            pre-conference
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5DCCB]">
                      {registrationTariffGrid.rows.map((row) => (
                        <tr key={row.category} className="hover:bg-[#FAF5ED]/60 transition-colors">
                          <td className="py-4 px-6 font-bold text-[#182230]">
                            {row.category}
                          </td>
                          <td className="py-4 px-6 font-manrope font-extrabold text-base text-[#003399] bg-[#EBF1FA]/60 border-x border-[#E5DCCB]">
                            ₹{row.earlyBird.toLocaleString('en-IN')}
                          </td>
                          <td className="py-4 px-6 font-manrope font-bold text-sm text-[#556070]">
                            ₹{row.regular.toLocaleString('en-IN')}
                          </td>
                          <td className="py-4 px-6 font-manrope font-bold text-sm text-[#556070]">
                            ₹{row.spot.toLocaleString('en-IN')}
                          </td>
                          <td className="py-4 px-6 font-manrope font-bold text-sm text-[#D49B00] bg-[#FFF8E7]/60">
                            {row.workshop ? `₹${row.workshop.toLocaleString('en-IN')}` : <span className="text-gray-400 font-normal">—</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-[#FAF5ED] border-t border-[#E5DCCB] text-[11.5px] text-[#556070] flex flex-wrap items-center justify-between gap-2">
                  <span>* All tariffs listed in Indian Rupees (INR). Early Bird rate valid till 15th January 2027.</span>
                  <span className="font-semibold text-[#003399]">Workshop fee: ₹5,500 per delegate / resident.</span>
                </div>
              </div>

              {/* Category Detail Cards with Feature List */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {registrationCategories.map((c) => (
                  <div
                    key={c.id}
                    className="relative overflow-hidden bg-[#FFFDF9] p-6 rounded-2xl border border-[#E5DCCB] shadow-sm flex flex-col justify-between hover:border-[#003399] transition-all text-left"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#003399]/10 text-[#003399]">
                          {c.badge}
                        </span>
                        <span className="text-xl font-manrope font-extrabold text-[#003399]">
                          ₹{c.fee.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <h3 className="font-serif text-lg font-bold text-[#182230] mb-1">
                        {c.name}
                      </h3>
                      <p className="text-xs text-[#556070] mb-4 leading-relaxed">
                        {c.description}
                      </p>

                      <ul className="space-y-2 text-xs text-[#182230] border-t border-[#E5DCCB] pt-4">
                        {c.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <InteractiveHoverButton
                      onClick={() => {
                        setFormData(prev => ({ ...prev, category: c.name, fee: c.fee }));
                        setActiveTab('register');
                      }}
                      text={`Register as ${c.name}`}
                      variant="blue"
                      className="mt-6 w-full py-2.5 text-xs font-bold"
                    />
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 3: STATUS LOOKUP */}
          {activeTab === 'lookup' && (
            <div className="max-w-2xl mx-auto bg-[#FFFDF9] p-8 rounded-2xl border border-[#E5DCCB] shadow-sm text-left space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest font-bold text-[#003399]">
                  Check Payment & Verification Status
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#182230] mt-1">
                  Delegate Pass Verification Lookup
                </h2>
                <p className="text-xs text-[#556070] mt-1">
                  Enter your assigned Registration ID (e.g. <code>TNS27-1001</code>), registered email, or mobile number.
                </p>
              </div>

              <form onSubmit={handleLookupSubmit} className="flex gap-2">
                <input
                  type="text"
                  required
                  value={lookupQuery}
                  onChange={(e) => setLookupQuery(e.target.value)}
                  placeholder="Enter Registration ID, Email, or Mobile..."
                  className="flex-1 p-3 rounded-lg border border-[#E5DCCB] text-xs focus:outline-none focus:ring-2 focus:ring-[#003399]/20 focus:border-[#003399] bg-[#FAF5ED] text-[#182230] transition-all"
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="px-5 py-3 rounded-lg bg-[#003399] text-white font-bold text-xs hover:bg-[#002266] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{isSearching ? 'Checking...' : 'Check Status'}</span>
                </button>
              </form>

              {lookupError && (
                <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs">
                  {lookupError}
                </div>
              )}

              {lookupResult && (
                <div className="p-5 rounded-xl bg-[#FAF5ED] border border-[#E5DCCB] space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E5DCCB] pb-3">
                    <div>
                      <span className="text-[10px] text-[#556070] uppercase tracking-wider block">Registration ID</span>
                      <strong className="text-base font-manrope text-[#003399]">{lookupResult.registrationId}</strong>
                    </div>
                    <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${
                      lookupResult.registrationStatus === 'Verified'
                        ? 'bg-emerald-100 text-emerald-800'
                        : lookupResult.registrationStatus === 'Rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {lookupResult.registrationStatus}
                    </span>
                  </div>

                  <div className="text-xs space-y-1.5 text-[#182230]">
                    <p><strong>Name:</strong> {lookupResult.name}</p>
                    <p><strong>Category:</strong> {lookupResult.category}</p>
                    <p><strong>Hospital / College:</strong> {lookupResult.hospital}</p>
                    <p><strong>Payment Reference (UTR):</strong> {lookupResult.transactionId}</p>
                    {lookupResult.verifiedAt && (
                      <p className="text-emerald-700 font-semibold">
                        ✓ Verified on {new Date(lookupResult.verifiedAt).toLocaleDateString()}
                      </p>
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

export default RegistrationPage;
