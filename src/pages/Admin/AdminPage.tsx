import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  FileText,
  DollarSign,
  Download,
  Search,
  CheckCircle2,
  XCircle,
  LogOut,
  AlertTriangle,
  RefreshCw,
  BookOpen,
  ShieldCheck,
  Eye,
  ArrowRight,
  Mail
} from 'lucide-react';
import { api, API_BASE, SERVER_BASE } from '../../services/api';
import { generateRegistrationReceiptPDF } from '../../services/receiptGenerator';
import { RegistrationRecord, AbstractRecord } from '../../types/types';

export const AdminPage: React.FC = () => {
  const [token, setToken] = useState<string | null>(api.getAdminToken());
  const [username, setUsername] = useState('tnscon');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginPortal, setLoginPortal] = useState<'admin' | 'viewer'>('admin');

  // Active Dashboard Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'registrations' | 'abstracts'>('overview');

  // Dashboard Data
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [abstracts, setAbstracts] = useState<AbstractRecord[]>([]);

  // Filters & Search
  const [regSearch, setRegSearch] = useState('');
  const [regStatusFilter, setRegStatusFilter] = useState('All');
  const [regCategoryFilter, setRegCategoryFilter] = useState('All');

  const [absCategoryFilter, setAbsCategoryFilter] = useState('All');
  const [absStatusFilter, setAbsStatusFilter] = useState('All');

  // Selected Detail Modal
  const [selectedReg, setSelectedReg] = useState<RegistrationRecord | null>(null);
  const [selectedAbs, setSelectedAbs] = useState<AbstractRecord | null>(null);

  // Rejection reason prompt state
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  const loadData = async () => {
    try {
      const [regRes, absRes] = await Promise.all([
        api.getAdminRegistrations(),
        api.getAdminAbstracts()
      ]);
      setRegistrations(regRes.registrations || []);
      setAbstracts(absRes.abstracts || []);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const res = await api.adminLogin({ username, password });
      setToken(res.token);
    } catch (err: any) {
      setLoginError(err.message || 'Invalid credentials');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    api.logoutAdmin();
    setToken(null);
  };

  const handleUpdateRegStatus = async (id: number, status: 'Verified' | 'Rejected') => {
    try {
      const targetReg = selectedReg || registrations.find(r => r.id === id);
      const res = await api.updateRegistrationStatus(
        id,
        status,
        status === 'Verified' ? 'Verified by secretariat' : 'Rejected after verification review',
        status === 'Rejected' ? rejectionReason || 'Payment reference could not be reconciled' : undefined,
        targetReg
      );

      const recipientEmail = targetReg?.email || 'the registered delegate';
      const regId = targetReg?.registrationId || '';

      if (status === 'Verified') {
        if (res.emailSent) {
          alert(`✅ Registration Verified & Payment Successful!\n\nAn automated confirmation email has been successfully delivered to ${recipientEmail} with:\n• Registration ID: ${regId}\n• Payment Status: Successful & Verified\n• Amount: ₹${targetReg?.fee}\n• UTR: ${targetReg?.transactionId}`);
        } else {
          alert(`⚠️ Registration Verified as Successful!\n\nHowever, the real confirmation email could not be delivered to ${recipientEmail}.\nReason: ${res.emailError || 'SMTP server rejected login'}\n\nNote: Please configure valid SMTP mail credentials in server/.env (e.g. Gmail App Password) so emails can reach real inboxes.`);
        }
      }

      setSelectedReg(null);
      setRejectionReason('');
      await loadData();
    } catch (err: any) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleResendVerificationEmail = async (reg: RegistrationRecord) => {
    try {
      const res = await api.sendVerificationEmail(reg.id, reg);
      if (res.emailSent || res.result?.success) {
        alert(`📧 Verification Email Delivered!\n\nConfirmation email with Registration ID (${reg.registrationId}) and Payment Successful status was successfully delivered to ${reg.email}.`);
      } else {
        alert(`⚠️ Email Failed to Deliver!\n\nCould not send email to ${reg.email}.\nReason: ${res.emailError || res.result?.error || 'Invalid SMTP credentials'}.\n\nPlease provide valid SMTP mail credentials in server/.env.`);
      }
    } catch (err: any) {
      alert('Failed to send verification email: ' + err.message);
    }
  };

  const handleUpdateAbsStatus = async (id: number, status: any, notes?: string) => {
    try {
      await api.updateAbstractStatus(id, status, notes);
      setSelectedAbs(null);
      await loadData();
    } catch (err: any) {
      alert('Failed to update abstract: ' + err.message);
    }
  };

  // Metrics Calculation
  const totalRegs = registrations.length;
  const pendingRegs = registrations.filter(r => r.registrationStatus === 'Pending Verification').length;
  const verifiedRegs = registrations.filter(r => r.registrationStatus === 'Verified').length;
  const totalRevenue = registrations
    .filter(r => r.registrationStatus === 'Verified')
    .reduce((sum, r) => sum + r.fee, 0);

  // Filtered Registrations
  const filteredRegs = registrations.filter(r => {
    if (regStatusFilter !== 'All' && r.registrationStatus !== regStatusFilter) return false;
    if (regCategoryFilter !== 'All' && r.category !== regCategoryFilter) return false;
    if (regSearch) {
      const q = regSearch.toLowerCase();
      const match =
        r.registrationId.toLowerCase().includes(q) ||
        r.firstName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.mobile.includes(q) ||
        r.transactionId.toLowerCase().includes(q) ||
        r.hospital.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Filtered Abstracts
  const filteredAbs = abstracts.filter(a => {
    if (absCategoryFilter !== 'All' && a.category !== absCategoryFilter) return false;
    if (absStatusFilter !== 'All' && a.status !== absStatusFilter) return false;
    return true;
  });

  // Export handlers
  const handleExportCSV = () => {
    window.open(`${API_BASE}/admin/registrations/export/csv?token=${token}`, '_blank');
  };

  const handleExportExcel = () => {
    window.open(`${API_BASE}/admin/registrations/export/excel?token=${token}`, '_blank');
  };

  const handleExportRegxperts = () => {
    window.open(`${API_BASE}/admin/registrations/export/regxperts?token=${token}`, '_blank');
  };

  // If Not Authenticated, render Dual Portal Login Card
  if (!token) {
    return (
      <div className="min-h-screen bg-[#FAF5ED] flex items-center justify-center p-4">
        <div className="bg-[#FFFDF9] rounded-2xl p-6 sm:p-10 border border-[#E5DCCB] shadow-xl max-w-lg w-full text-left space-y-6">
          <div className="text-center space-y-2">
            <img
              src="/assets/images/tnscon_logo.png"
              alt="TNSCON 2027 Logo"
              className="h-14 w-auto mx-auto object-contain mb-2"
            />
            <h2 className="font-serif text-2xl font-bold text-[#003399]">
              TNSCON 2027 Portal Access
            </h2>
            <p className="text-xs text-[#556070]">
              Select your destination portal below to sign in or view proceedings.
            </p>
          </div>

          {/* Portal Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-[#FAF5ED] border border-[#E5DCCB]">
            <button
              type="button"
              onClick={() => setLoginPortal('admin')}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                loginPortal === 'admin'
                  ? 'bg-[#003399] text-white shadow-xs'
                  : 'text-[#556070] hover:text-[#003399]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
            <button
              type="button"
              onClick={() => setLoginPortal('viewer')}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                loginPortal === 'viewer'
                  ? 'bg-[#003399] text-white shadow-xs'
                  : 'text-[#556070] hover:text-[#003399]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Abstract Viewer</span>
            </button>
          </div>

          {loginPortal === 'admin' ? (
            /* ADMIN LOGIN FORM */
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="p-3 rounded-lg bg-[#EBF1FA] border border-[#003399]/20 text-[11px] text-[#003399]">
                <strong>Secretariat Admin:</strong> For organizing committee members to manage delegate registrations, verify payments, and oversee scientific reviews.
              </div>

              <div>
                <label className="block text-xs font-bold text-[#003399] mb-1">
                  Admin Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="tnscon"
                  className="w-full p-2.5 rounded-lg border border-[#E5DCCB] text-xs font-medium bg-[#FAF5ED] text-[#182230] focus:border-[#003399]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#003399] mb-1">
                  Security Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full p-2.5 rounded-lg border border-[#E5DCCB] text-xs font-medium bg-[#FAF5ED] text-[#182230] focus:border-[#003399]"
                />
                <p className="text-[10px] text-[#556070] mt-1">
                  Default credentials seeded: <code>tnscon</code> / <code>tnscon@2027</code>
                </p>
              </div>

              {loginError && (
                <div className="p-2.5 rounded bg-red-50 border border-red-200 text-red-700 text-xs">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 rounded-xl bg-[#003399] hover:bg-[#002266] text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                {isLoggingIn ? 'Authenticating...' : 'Sign In to Admin Portal'}
              </button>
            </form>
          ) : (
            /* PUBLIC ABSTRACT VIEWER CARD */
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-left space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 block">
                  Public Viewing Access
                </span>
                <p className="text-xs text-emerald-950 leading-relaxed">
                  Browse accepted research papers, oral presentations, and scientific e-posters. No administrative privileges required.
                </p>
              </div>

              <Link
                to="/abstract-viewer"
                className="w-full py-3.5 px-4 rounded-xl bg-[#003399] hover:bg-[#002266] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-[#FFCC00]" />
                <span>Open Public Abstract Viewer</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between text-xs text-[#556070] border-t border-[#E5DCCB]">
            <a href="/" className="hover:text-[#003399] underline">
              ← Conference Homepage
            </a>
            <Link to="/abstract-viewer" className="hover:text-[#003399] text-[#003399] font-medium">
              Direct Abstract Viewer →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF5ED]">
      
      {/* Top Admin Header */}
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
              <h1 className="font-serif text-lg font-bold">
                TNSCON 2027 Conference Secretariat Management
              </h1>
              <p className="text-[11px] text-[#FAF5ED]/80">
                Telangana Neurosciences Society • Begumpet Airport, Hyderabad
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/abstract-viewer"
              className="flex items-center gap-1.5 text-xs text-[#FAF5ED] hover:text-[#FFCC00] px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#FFCC00]" />
              <span className="hidden sm:inline">Public Abstract Viewer</span>
            </Link>
            <button
              onClick={loadData}
              className="flex items-center gap-1.5 text-xs text-[#FAF5ED] hover:text-white px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Data</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-red-200 hover:text-white px-3 py-1.5 rounded-lg bg-red-900/40 border border-red-400/30 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Admin Navigation Bar */}
      <div className="bg-[#FFFDF9] border-b border-[#E5DCCB] px-4 sm:px-6">
        <div className="max-w-[1240px] mx-auto flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar whitespace-nowrap">
          {[
            { id: 'overview', label: 'Executive Overview', icon: Users },
            { id: 'registrations', label: `Registrations (${totalRegs})`, icon: DollarSign },
            { id: 'abstracts', label: `Abstracts (${abstracts.length})`, icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3.5 px-2 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-[#003399] text-[#003399]'
                    : 'border-transparent text-[#556070] hover:text-[#003399]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* TAB 1: OVERVIEW METRICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8 text-left">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-[#FFFDF9] p-5 rounded-xl border border-[#E5DCCB] shadow-sm">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#556070] block">
                  Total Registrations
                </span>
                <span className="font-manrope font-extrabold text-3xl text-[#003399] mt-1 block">
                  {totalRegs}
                </span>
                <span className="text-[11px] text-[#556070]">Delegates & Guests</span>
              </div>

              <div className="bg-[#FFFDF9] p-5 rounded-xl border border-[#E5DCCB] shadow-sm">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 block">
                  Pending Verification
                </span>
                <span className="font-manrope font-extrabold text-3xl text-amber-600 mt-1 block">
                  {pendingRegs}
                </span>
                <span className="text-[11px] text-[#556070]">Awaiting bank check</span>
              </div>

              <div className="bg-[#FFFDF9] p-5 rounded-xl border border-[#E5DCCB] shadow-sm">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 block">
                  Verified Registrations
                </span>
                <span className="font-manrope font-extrabold text-3xl text-emerald-600 mt-1 block">
                  {verifiedRegs}
                </span>
                <span className="text-[11px] text-[#556070]">Confirmed Badges</span>
              </div>

              <div className="bg-[#FFFDF9] p-5 rounded-xl border border-[#E5DCCB] shadow-sm">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#003399] block">
                  Total Revenue Verified
                </span>
                <span className="font-manrope font-extrabold text-2xl text-[#003399] mt-1 block">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-[#556070]">Reconciled in bank</span>
              </div>

              <div className="bg-[#FFFDF9] p-5 rounded-xl border border-[#E5DCCB] shadow-sm">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#003399] block">
                  Abstract Submissions
                </span>
                <span className="font-manrope font-extrabold text-3xl text-[#003399] mt-1 block">
                  {abstracts.length}
                </span>
                <span className="text-[11px] text-[#556070]">Award, Free & Posters</span>
              </div>
            </div>

            {/* Quick Export Shortcuts */}
            <div className="bg-[#FFFDF9] p-6 rounded-2xl border border-[#E5DCCB] shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#003399]">
                Roster Exports & On-Site Data Transfers
              </h3>
              <p className="text-xs text-[#556070]">
                Export live delegate data for on-site registration desks, badge printing, or Regxperts scan kiosks.
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleExportExcel}
                  className="px-4 py-2.5 rounded-lg bg-[#003399] text-white text-xs font-bold flex items-center gap-2 hover:bg-[#002266] transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#FFCC00]" />
                  <span>Export Registrations to Excel (.xlsx)</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2.5 rounded-lg bg-[#FFFDF9] border border-[#003399] text-[#003399] text-xs font-bold flex items-center gap-2 hover:bg-[#EBF1FA] transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Registrations to CSV (.csv)</span>
                </button>

                <button
                  onClick={handleExportRegxperts}
                  className="px-4 py-2.5 rounded-lg bg-[#EBF1FA] border border-[#D49B00] text-[#003399] text-xs font-bold flex items-center gap-2 hover:bg-[#D49B00] hover:text-[#001A4D] transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#003399]" />
                  <span>Export Regxperts Format Roster (RegID, Kitbag, FoodLogs)</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: REGISTRATIONS MANAGEMENT */}
        {activeTab === 'registrations' && (
          <div className="space-y-6 text-left">
            
            {/* Filter Bar */}
            <div className="bg-[#FFFDF9] p-4 rounded-xl border border-[#E5DCCB] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-[280px]">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#556070] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={regSearch}
                    onChange={(e) => setRegSearch(e.target.value)}
                    placeholder="Search by ID, name, email, UTR, hospital..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#E5DCCB] bg-[#FAF5ED] text-[#182230] focus:border-[#003399]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={regStatusFilter}
                  onChange={(e) => setRegStatusFilter(e.target.value)}
                  className="p-2 text-xs rounded-lg border border-[#E5DCCB] bg-[#FAF5ED] text-[#182230] font-medium"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending Verification">Pending Verification</option>
                  <option value="Verified">Verified</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <select
                  value={regCategoryFilter}
                  onChange={(e) => setRegCategoryFilter(e.target.value)}
                  className="p-2 text-xs rounded-lg border border-[#E5DCCB] bg-[#FAF5ED] text-[#182230] font-medium"
                >
                  <option value="All">All Categories</option>
                  <option value="TNS Member Delegate">TNS Member Delegate</option>
                  <option value="Non-Member Delegate">Non-Member Delegate</option>
                  <option value="PG Resident / Fellow">PG Resident / Fellow</option>
                  <option value="Accompanying Person">Accompanying Person</option>
                </select>
              </div>
            </div>

            {/* Registrations Table */}
            <div className="bg-[#FFFDF9] rounded-xl border border-[#E5DCCB] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF5ED] border-b border-[#E5DCCB] text-[#556070] uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4">Reg ID</th>
                      <th className="py-3 px-4">Delegate Name</th>
                      <th className="py-3 px-4">Hospital / College</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Fee (INR)</th>
                      <th className="py-3 px-4">UTR Reference</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5DCCB]">
                    {filteredRegs.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-[#556070]">
                          No registration records match the current filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredRegs.map((reg) => (
                        <tr key={reg.id} className="hover:bg-[#FAF5ED]/60 transition-colors">
                          <td className="py-3 px-4 font-manrope font-bold text-[#003399]">
                            {reg.registrationId}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-[#182230] block">
                              {reg.title || ''} {reg.firstName} {reg.lastName || ''}
                            </span>
                            <span className="text-[11px] text-[#556070]">{reg.email} • {reg.mobile}</span>
                          </td>
                          <td className="py-3 px-4 text-[#556070] max-w-xs truncate">
                            {reg.hospital}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded bg-[#FAF5ED] text-[#182230] border border-[#E5DCCB] text-[11px] font-medium">
                              {reg.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-manrope font-semibold text-[#003399]">
                            ₹{reg.fee.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-4 font-manrope text-xs text-[#182230]">
                            {reg.transactionId}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              reg.registrationStatus === 'Verified'
                                ? 'bg-emerald-100 text-emerald-800'
                                : reg.registrationStatus === 'Rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {reg.registrationStatus}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setSelectedReg(reg)}
                              className="px-2.5 py-1 rounded bg-[#EBF1FA] text-[#003399] hover:bg-[#D49B00] hover:text-[#001A4D] font-bold text-[11px] border border-[#D49B00] transition-colors cursor-pointer"
                            >
                              Review & Verify
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: ABSTRACTS MANAGEMENT */}
        {activeTab === 'abstracts' && (
          <div className="space-y-6 text-left">
            <div className="bg-[#FFFDF9] p-4 rounded-xl border border-[#E5DCCB] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <select
                  value={absCategoryFilter}
                  onChange={(e) => setAbsCategoryFilter(e.target.value)}
                  className="p-2 text-xs rounded-lg border border-[#E5DCCB] bg-[#FAF5ED] text-[#182230] font-medium"
                >
                  <option value="All">All Categories</option>
                  <option value="Award Paper Presentation">Award Paper Presentation</option>
                  <option value="Free Paper Presentation">Free Paper Presentation</option>
                  <option value="Poster Presentation">Poster Presentation</option>
                </select>

                <select
                  value={absStatusFilter}
                  onChange={(e) => setAbsStatusFilter(e.target.value)}
                  className="p-2 text-xs rounded-lg border border-[#E5DCCB] bg-[#FAF5ED] text-[#182230] font-medium"
                >
                  <option value="All">All Review Statuses</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Revision Requested">Revision Requested</option>
                </select>
              </div>

              <span className="text-xs text-[#556070]">
                Total Abstracts: <strong>{filteredAbs.length}</strong>
              </span>
            </div>

            <div className="space-y-3">
              {filteredAbs.map((abs) => (
                <div
                  key={abs.id}
                  className="bg-[#FFFDF9] p-5 rounded-xl border border-[#E5DCCB] shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-manrope font-bold text-xs text-[#003399] px-2 py-0.5 rounded bg-[#EBF1FA] border border-[#D49B00]/40">
                        {abs.submissionId}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#EBF1FA] text-[#003399]">
                        {abs.category}
                      </span>
                      <span className="text-xs text-[#556070]">
                        {abs.specialty} • {abs.subTopic}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-base text-[#182230]">
                      {abs.title}
                    </h4>

                    <p className="text-xs text-[#556070]">
                      Presenter: <strong>{abs.presentingAuthorTitle || ''} {abs.presentingAuthorName}</strong> ({abs.presentingAuthorInstitution}) • Word Count: {abs.wordCount} words
                    </p>

                    {abs.coAuthors && (
                      <p className="text-xs text-[#556070]">
                        Co-Authors: <span className="text-[#003399] font-medium">{abs.coAuthors}</span>
                      </p>
                    )}

                    <div className="pt-2 text-xs text-[#182230]/85 line-clamp-2">
                      {abs.fullAbstractText}
                    </div>
                  </div>

                  <div className="md:w-48 flex-shrink-0 flex flex-col items-end gap-2">
                    <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase ${
                      abs.status === 'Accepted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : abs.status === 'Rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {abs.status}
                    </span>

                    <button
                      onClick={() => setSelectedAbs(abs)}
                      className="px-3 py-1.5 rounded bg-[#003399] text-white text-xs font-semibold hover:bg-[#002266] cursor-pointer"
                    >
                      Scientific Review
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>

      {/* REGISTRATION DETAIL & VERIFY MODAL */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 bg-[#001A4D]/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] rounded-2xl max-w-xl w-full p-6 text-left space-y-5 max-h-[90vh] overflow-y-auto border border-[#E5DCCB]">
            <div className="flex items-center justify-between border-b border-[#E5DCCB] pb-3">
              <div>
                <span className="text-[10px] text-[#556070] uppercase tracking-wider block">Registration Review</span>
                <h3 className="font-serif text-xl font-bold text-[#003399]">
                  {selectedReg.registrationId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReg(null)}
                className="text-[#556070] hover:text-[#182230] font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-[#FAF5ED] p-3 rounded-lg border border-[#E5DCCB]">
                <div>
                  <span className="text-[#556070] block">Delegate Name:</span>
                  <strong className="text-sm text-[#182230]">{selectedReg.title} {selectedReg.firstName} {selectedReg.lastName}</strong>
                </div>
                <div>
                  <span className="text-[#556070] block">Category:</span>
                  <strong className="text-sm text-[#003399]">{selectedReg.category}</strong>
                </div>
                <div>
                  <span className="text-[#556070] block">Institution:</span>
                  <span className="text-[#182230]">{selectedReg.hospital}</span>
                </div>
                <div>
                  <span className="text-[#556070] block">Contact Mobile / Email:</span>
                  <span className="text-[#182230]">{selectedReg.mobile} • {selectedReg.email}</span>
                </div>
                <div>
                  <span className="text-[#556070] block">UTR Reference:</span>
                  <strong className="font-manrope text-[#182230]">{selectedReg.transactionId}</strong>
                </div>
                <div>
                  <span className="text-[#556070] block">Amount Paid:</span>
                  <strong className="font-manrope text-base text-emerald-700">₹{selectedReg.fee}</strong>
                </div>
              </div>

              {(() => {
                const raw = selectedReg.paymentScreenshot;
                const rawBase64 = (selectedReg as any).paymentScreenshotBase64;
                const src = (typeof raw === 'string' && raw.trim() !== '')
                  ? (raw.startsWith('http') || raw.startsWith('data:') ? raw : `${SERVER_BASE}${raw}`)
                  : (typeof rawBase64 === 'string' && rawBase64.trim() !== '' ? rawBase64 : null);

                if (!src) return null;

                return (
                  <div>
                    <span className="font-bold text-[#003399] block mb-1">Attached Payment Proof:</span>
                    <div className="p-2 bg-[#FAF5ED] rounded border border-[#E5DCCB] text-center">
                      <img
                        src={src}
                        alt="Payment Proof"
                        className="max-h-56 mx-auto object-contain rounded"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                );
              })()}

              <div>
                <label className="block font-semibold text-[#182230] mb-1">Rejection Reason (if rejecting):</label>
                <input
                  type="text"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. UTR number does not match bank deposit..."
                  className="w-full p-2 rounded border border-[#E5DCCB] text-xs bg-[#FAF5ED] text-[#182230]"
                />
              </div>
            </div>

            {/* Status & Automated Email Notification Banner */}
            {selectedReg.registrationStatus === 'Verified' && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs text-emerald-900">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>
                    Payment Verified! Confirmation email containing Registration ID <strong>({selectedReg.registrationId})</strong> sent to <strong>{selectedReg.email}</strong>.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleResendVerificationEmail(selectedReg)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer flex-shrink-0 shadow-2xs"
                  title="Resend verification and payment confirmation email"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Resend Confirmation Email</span>
                </button>
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-3 border-t border-[#E5DCCB]">
              {selectedReg.registrationStatus !== 'Verified' && (
                <button
                  onClick={() => handleUpdateRegStatus(selectedReg.id, 'Verified')}
                  className="flex-1 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-w-[170px] shadow-xs"
                  title="Approve registration and automatically send confirmation email with Registration ID & Payment Successful"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify Payment & Send Email</span>
                </button>
              )}

              <button
                onClick={() => {
                  generateRegistrationReceiptPDF({
                    registrationId: selectedReg.registrationId,
                    formData: {
                      title: selectedReg.title || 'Dr.',
                      firstName: selectedReg.firstName,
                      lastName: selectedReg.lastName || '',
                      gender: selectedReg.gender || 'Male',
                      designation: selectedReg.designation || 'Consultant',
                      qualification: selectedReg.qualification || '',
                      medicalCouncilNo: selectedReg.medicalCouncilNo || '',
                      hospital: selectedReg.hospital,
                      address: selectedReg.address || '',
                      city: selectedReg.city || '',
                      state: selectedReg.state || '',
                      pinCode: selectedReg.pinCode || '',
                      mobile: selectedReg.mobile,
                      email: selectedReg.email,
                      category: selectedReg.category,
                      fee: selectedReg.fee,
                      includeWorkshop: false,
                      transactionId: selectedReg.transactionId,
                      paymentScreenshotBase64: ''
                    },
                    submittedAt: new Date(selectedReg.createdAt).toLocaleDateString('en-IN')
                  });
                }}
                className="py-2.5 px-4 rounded-lg bg-[#003399] hover:bg-[#002266] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Download Delegate Pass / Receipt PDF"
              >
                <Download className="w-4 h-4 text-[#FFCC00]" />
                <span>Print Badge</span>
              </button>

              {selectedReg.registrationStatus !== 'Rejected' && (
                <button
                  onClick={() => handleUpdateRegStatus(selectedReg.id, 'Rejected')}
                  className="py-2.5 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ABSTRACT SCIENTIFIC REVIEW MODAL */}
      {selectedAbs && (
        <div className="fixed inset-0 z-50 bg-[#001A4D]/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] rounded-2xl max-w-2xl w-full p-6 text-left space-y-4 max-h-[90vh] overflow-y-auto border border-[#E5DCCB]">
            <div className="flex items-center justify-between border-b border-[#E5DCCB] pb-3">
              <div>
                <span className="text-[10px] text-[#556070] uppercase tracking-wider block">Scientific Review</span>
                <h3 className="font-serif text-xl font-bold text-[#003399]">
                  {selectedAbs.submissionId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAbs(null)}
                className="text-[#556070] hover:text-[#182230] font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <h4 className="font-serif text-lg font-bold text-[#182230]">
                {selectedAbs.title}
              </h4>
              <p className="text-[#556070]">
                {selectedAbs.category} • {selectedAbs.specialty} ({selectedAbs.subTopic})
              </p>

              <div className="p-4 bg-[#FAF5ED] rounded-xl border border-[#E5DCCB] text-xs leading-relaxed space-y-2">
                <strong className="block text-[#003399]">Abstract Text ({selectedAbs.wordCount} words):</strong>
                <p className="text-[#182230]">{selectedAbs.fullAbstractText}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[#556070] block">Author:</span>
                  <strong className="text-[#182230]">{selectedAbs.presentingAuthorTitle} {selectedAbs.presentingAuthorName}</strong>
                </div>
                <div>
                  <span className="text-[#556070] block">Institution:</span>
                  <strong className="text-[#182230]">{selectedAbs.presentingAuthorInstitution}</strong>
                </div>
              </div>

              {selectedAbs.coAuthors && (
                <div className="text-xs pt-1 border-t border-[#E5DCCB]/60">
                  <span className="text-[#556070] block">Co-Authors / Co-Investigators:</span>
                  <strong className="text-[#003399] font-medium">{selectedAbs.coAuthors}</strong>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 pt-3 border-t border-[#E5DCCB]">
              <button
                onClick={() => handleUpdateAbsStatus(selectedAbs.id, 'Accepted', 'Accepted for Oral presentation by Scientific Committee')}
                className="px-4 py-2 rounded bg-emerald-600 text-white font-bold text-xs cursor-pointer"
              >
                Accept Abstract
              </button>
              <button
                onClick={() => handleUpdateAbsStatus(selectedAbs.id, 'Under Review', 'Currently under peer reviewer allocation')}
                className="px-4 py-2 rounded bg-[#003399] text-white font-bold text-xs cursor-pointer"
              >
                Mark Under Review
              </button>
              <button
                onClick={() => handleUpdateAbsStatus(selectedAbs.id, 'Revision Requested', 'Clarification on clinical numbers requested')}
                className="px-4 py-2 rounded bg-amber-600 text-white font-bold text-xs cursor-pointer"
              >
                Request Revision
              </button>
              <button
                onClick={() => handleUpdateAbsStatus(selectedAbs.id, 'Rejected', 'Does not meet conference novelty criteria')}
                className="px-4 py-2 rounded bg-red-600 text-white font-bold text-xs cursor-pointer"
              >
                Reject Abstract
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPage;
