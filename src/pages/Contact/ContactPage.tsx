import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Globe, ExternalLink } from 'lucide-react';
import { conferenceInfo, leadershipData } from '../../data/conferenceData';

export const ContactPage: React.FC = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Delegate Registration Query',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-transparent text-[#182230]">
      
      {/* Banner */}
      <section className="bg-[#001A4D] text-white py-12 sm:py-14 border-b border-[#003399]/40 text-left">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#FFCC00] font-bold px-3 py-1 rounded-full bg-white/10 border border-[#D49B00]/40">
              Secretariat Assistance
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-white font-bold">
              Contact Conference Secretariat
            </h1>
            <p className="text-sm text-[#FAF5ED]/85 font-light leading-relaxed">
              Have questions regarding registration, abstract submissions, or travel? The organizing team is here to support you.
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-10 sm:py-12 text-left">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Secretariat Details (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#FFFDF9] p-6 sm:p-8 rounded-2xl border border-[#E5DCCB] shadow-xs space-y-6">
                
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#003399]">
                    TNSCON 2027 Secretariat
                  </h3>
                  <p className="text-xs text-[#556070] mt-1">
                    Telangana Neurosciences Society
                  </p>
                </div>

                <div className="space-y-4 text-xs text-[#182230]">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#003399] flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#003399] font-bold">Venue Secretariat Office</strong>
                      <p className="text-[#556070] mt-0.5 leading-relaxed">
                        Conference Hall, Rajeev Gandhi Terminal, Begumpet Airport, Hyderabad, Telangana, India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-[#003399] flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#003399] font-bold">Official Email</strong>
                      <a href={`mailto:${conferenceInfo.contactEmail}`} className="text-[#003399] hover:underline font-semibold">
                        {conferenceInfo.contactEmail}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-[#003399] flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#003399] font-bold">Secretariat Desk</strong>
                      <p className="text-[#556070] font-manrope mt-0.5">
                        {conferenceInfo.contactPhone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-[#003399] flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#003399] font-bold">Official Conference Domain</strong>
                      <p className="text-[#556070] mt-0.5">
                        {conferenceInfo.domain}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <ExternalLink className="w-5 h-5 text-[#D49B00] flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#003399] font-bold">Parent Association Portal</strong>
                      <a
                        href={conferenceInfo.societyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#003399] hover:underline font-semibold mt-0.5 inline-flex items-center gap-1"
                      >
                        <span>telangananeuro.com</span>
                        <ExternalLink className="w-3 h-3 text-[#D49B00]" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Organizing Leadership Details */}
                <div className="pt-4 border-t border-[#E5DCCB] space-y-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#003399] block">
                    Leadership Secretariat
                  </span>

                  <div className="text-xs space-y-1">
                    <strong className="text-[#003399] block">{leadershipData.organizingChairman.name}</strong>
                    <p className="text-[#556070]">{leadershipData.organizingChairman.role} • {leadershipData.organizingChairman.designation}</p>
                  </div>

                  <div className="text-xs space-y-1 pt-1">
                    <strong className="text-[#003399] block">{leadershipData.organizingSecretary.name}</strong>
                    <p className="text-[#556070]">{leadershipData.organizingSecretary.role} • {leadershipData.organizingSecretary.designation}</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Contact Form (7 cols) */}
            <div className="lg:col-span-7 bg-[#FFFDF9] p-6 sm:p-10 rounded-2xl border border-[#E5DCCB] shadow-xs">
              
              {formSubmitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-blue-50 text-[#003399] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-[#003399]" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#003399]">
                    Inquiry Received
                  </h3>
                  <p className="text-xs text-[#556070] max-w-md mx-auto">
                    Thank you for reaching out. The TNSCON 2027 Secretariat desk will review your inquiry and respond to <strong>{formData.email}</strong> shortly.
                  </p>
                  <button
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        subject: 'Delegate Registration Query',
                        message: ''
                      });
                    }}
                    className="px-5 py-2.5 rounded-lg bg-[#003399] text-white text-xs font-bold hover:bg-[#002266] transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <h3 className="font-serif text-xl font-bold text-[#003399]">
                      Send an Inquiry to Secretariat
                    </h3>
                    <p className="text-xs text-[#556070]">
                      Please submit your message and our coordinating officers will assist you.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-[#556070] mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Dr. Rajesh Kumar"
                        className="w-full p-2.5 rounded-lg border border-[#E5DCCB] text-xs bg-[#FAF5ED] text-[#182230] focus:border-[#003399] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-[#556070] mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="doctor@hospital.org"
                        className="w-full p-2.5 rounded-lg border border-[#E5DCCB] text-xs bg-[#FAF5ED] text-[#182230] focus:border-[#003399] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-[#556070] mb-1">Contact Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+91 98490 12345"
                        className="w-full p-2.5 rounded-lg border border-[#E5DCCB] text-xs bg-[#FAF5ED] text-[#182230] focus:border-[#003399] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-[#556070] mb-1">Inquiry Subject *</label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                        className="w-full p-2.5 rounded-lg border border-[#E5DCCB] text-xs bg-[#FAF5ED] text-[#182230] focus:border-[#003399] focus:outline-none"
                      >
                        <option>Delegate Registration Query</option>
                        <option>Abstract Submission Guidance</option>
                        <option>Award Paper Eligibility</option>
                        <option>E-Poster Technical Specifications</option>
                        <option>Accommodation & Travel Assistance</option>
                        <option>General Secretariat Query</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-[#556070] mb-1">Your Message / Query *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Please specify your question or details..."
                      className="w-full p-2.5 rounded-lg border border-[#E5DCCB] text-xs bg-[#FAF5ED] text-[#182230] focus:border-[#003399] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#003399] hover:bg-[#002266] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-[#FFCC00]" />
                    <span>Submit Inquiry</span>
                  </button>
                </form>
              )}

            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default ContactPage;
