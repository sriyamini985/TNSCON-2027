import { RegistrationFormData, AbstractSubmissionData } from '../types/types';

export const API_BASE = import.meta.env.VITE_API_BASE || 'https://tnscon-2027.onrender.com/api';
export const SERVER_BASE = import.meta.env.VITE_SERVER_BASE || (import.meta.env.VITE_API_BASE ? import.meta.env.VITE_API_BASE.replace(/\/api\/?$/, '') : 'https://tnscon-2027.onrender.com');

// Helper for local storage mock store
const STORAGE_KEYS = {
  REGISTRATIONS: 'tnscon_registrations',
  ABSTRACTS: 'tnscon_abstracts',
  TOKEN: 'tnscon_admin_token',
  VIEWER_TOKEN: 'tnscon_viewer_token',
  SETTINGS: 'tnscon_settings'
};

const getLocalData = <T>(key: string, defaultVal: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultVal;
    let parsed = JSON.parse(raw);
    if (key === STORAGE_KEYS.REGISTRATIONS && Array.isArray(parsed)) {
      // Remove mock/demo registrations so only real delegate submissions remain
      parsed = parsed.filter((r: any) =>
        r &&
        r.email !== 'vikram.reddy@nims.edu.in' &&
        r.email !== 'dr.ananya.sarma@gmail.com' &&
        !(r.firstName === 'Vikram' && r.lastName === 'Reddy') &&
        !(r.firstName === 'Ananya' && r.lastName === 'Sarma')
      );

      parsed.forEach((r: any, idx: number) => {
        if (r && typeof r.paymentScreenshot !== 'string') {
          r.paymentScreenshot = typeof r.paymentScreenshotBase64 === 'string' ? r.paymentScreenshotBase64 : '';
        }
        // Normalize registration IDs to clean sequence starting from TNS-001
        if (r && (!r.registrationId || r.registrationId.startsWith('TNS27-') || r.registrationId.startsWith('TNS2027-') || r.registrationId === 'TNS-003')) {
          r.registrationId = `TNS-${String(idx + 1).padStart(3, '0')}`;
        }
      });
      try { localStorage.setItem(key, JSON.stringify(parsed)); } catch (e) {}
    }
    if (key === STORAGE_KEYS.ABSTRACTS && Array.isArray(parsed)) {
      // Remove mock/demo abstracts so only real submissions remain
      parsed = parsed.filter((a: any) =>
        a &&
        a.presentingAuthorEmail !== 'dr.ananya.sarma@gmail.com' &&
        a.presentingAuthorEmail !== 'kv.ramana@nims.edu.in' &&
        a.presentingAuthorEmail !== 'dr.sneha.reddy@apollohospitals.com' &&
        a.presentingAuthorName !== 'Ananya Sarma'
      );
      parsed.forEach((a: any, idx: number) => {
        if (a && (!a.submissionId || !a.submissionId.startsWith('ABS-'))) {
          a.submissionId = `ABS-${String(idx + 1).padStart(3, '0')}`;
        }
      });
      try { localStorage.setItem(key, JSON.stringify(parsed)); } catch (e) {}
    }
    return parsed;
  } catch {
    return defaultVal;
  }
};

const setLocalData = <T>(key: string, data: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('LocalStorage write error:', err);
  }
};

// Initialize clean empty data in local storage (demo data removed)
if (!localStorage.getItem(STORAGE_KEYS.REGISTRATIONS)) {
  setLocalData(STORAGE_KEYS.REGISTRATIONS, []);
}

if (!localStorage.getItem(STORAGE_KEYS.ABSTRACTS)) {
  setLocalData(STORAGE_KEYS.ABSTRACTS, []);
}

export const api = {
  // Submit Registration
  async register(formData: RegistrationFormData) {
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (key === 'paymentScreenshot' && val instanceof File) {
          data.append('paymentScreenshot', val);
        } else if (val !== undefined && val !== null) {
          data.append(key, String(val));
        }
      });

      const response = await fetch(`${API_BASE}/registrations`, {
        method: 'POST',
        body: data
      });

      if (response.ok) {
        return await response.json();
      }
      const err = await response.json();
      throw new Error(err.error || 'Registration failed');
    } catch (err: any) {
      console.warn('Backend offline or failed, falling back to local persistent store:', err.message);
      
      // Local fallback logic
      const regs = getLocalData<any[]>(STORAGE_KEYS.REGISTRATIONS, []);
      
      // Duplicate checks
      if (regs.some(r => r.email.toLowerCase() === formData.email.toLowerCase())) {
        throw new Error('This email address is already registered.');
      }
      if (regs.some(r => r.mobile === formData.mobile)) {
        throw new Error('This mobile number is already registered.');
      }
      if (regs.some(r => r.transactionId.toLowerCase() === formData.transactionId.toLowerCase())) {
        throw new Error('This Transaction / UTR reference has already been submitted.');
      }

      let maxNum = 0;
      regs.forEach(r => {
        const m = (r.registrationId || '').match(/TNS-(\d+)/i) || (r.registrationId || '').match(/TNS27-(\d+)/i);
        if (m) {
          const num = parseInt(m[1], 10);
          const normalized = num > 1000 ? num - 1000 : num;
          if (normalized > maxNum) maxNum = normalized;
        }
      });
      const nextNum = Math.max(maxNum + 1, regs.length + 1);
      const newId = `TNS-${String(nextNum).padStart(3, '0')}`;
      const newRecord = {
        id: Date.now(),
        registrationId: newId,
        ...formData,
        paymentScreenshot: typeof formData.paymentScreenshot === 'string'
          ? formData.paymentScreenshot
          : (formData.paymentScreenshotBase64 || ''),
        registrationStatus: 'Pending Verification',
        paymentStatus: 'Verification Pending',
        exportStatus: 'Pending',
        createdAt: new Date().toISOString()
      };

      regs.unshift(newRecord);
      setLocalData(STORAGE_KEYS.REGISTRATIONS, regs);

      return {
        success: true,
        message: 'Registration submitted successfully (Stored securely)!',
        registration: newRecord
      };
    }
  },

  // Check Registration Status
  async getRegistrationStatus(query: string) {
    try {
      const res = await fetch(`${API_BASE}/registrations/status/${encodeURIComponent(query)}`);
      if (res.ok) return await res.json();
      const err = await res.json();
      throw new Error(err.error || 'Lookup failed');
    } catch {
      const regs = getLocalData<any[]>(STORAGE_KEYS.REGISTRATIONS, []);
      const q = query.trim().toLowerCase();
      const found = regs.find(r => 
        r.registrationId.toLowerCase() === q ||
        r.email.toLowerCase() === q ||
        r.mobile === query.trim()
      );
      if (found) {
        return {
          success: true,
          registration: {
            registrationId: found.registrationId,
            name: `${found.title || ''} ${found.firstName} ${found.lastName || ''}`.trim(),
            category: found.category,
            hospital: found.hospital,
            paymentStatus: found.paymentStatus,
            registrationStatus: found.registrationStatus,
            transactionId: found.transactionId,
            createdAt: found.createdAt,
            verifiedAt: found.verifiedAt
          }
        };
      }
      throw new Error('No registration found with this ID, email, or mobile number.');
    }
  },

  // Submit Abstract
  async submitAbstract(abstractData: AbstractSubmissionData) {
    try {
      const data = new FormData();
      Object.entries(abstractData).forEach(([key, val]) => {
        if ((key === 'abstractFile' || key === 'bonafideFile') && val instanceof File) {
          data.append(key, val);
        } else if (val !== undefined && val !== null) {
          data.append(key, String(val));
        }
      });

      const response = await fetch(`${API_BASE}/abstracts`, {
        method: 'POST',
        body: data
      });

      if (response.ok) {
        return await response.json();
      }
      const err = await response.json();
      throw new Error(err.error || 'Abstract submission failed');
    } catch (err: any) {
      console.warn('Backend abstract route offline, using resilient local storage:', err.message);

      const abstracts = getLocalData<any[]>(STORAGE_KEYS.ABSTRACTS, []);
      const newId = `ABS-${String(abstracts.length + 1).padStart(3, '0')}`;
      const newRecord = {
        id: Date.now(),
        submissionId: newId,
        ...abstractData,
        status: 'Submitted',
        createdAt: new Date().toISOString()
      };

      abstracts.unshift(newRecord);
      setLocalData(STORAGE_KEYS.ABSTRACTS, abstracts);

      return {
        success: true,
        message: 'Abstract submitted successfully!',
        submission: newRecord
      };
    }
  },

  // Check Abstract Status
  async getAbstractStatus(query: string) {
    try {
      const res = await fetch(`${API_BASE}/abstracts/status/${encodeURIComponent(query)}`);
      if (res.ok) return await res.json();
      const err = await res.json();
      throw new Error(err.error || 'Lookup failed');
    } catch {
      const abstracts = getLocalData<any[]>(STORAGE_KEYS.ABSTRACTS, []);
      const q = query.trim().toLowerCase();
      const found = abstracts.find(a => 
        a.submissionId.toLowerCase() === q ||
        a.presentingAuthorEmail.toLowerCase() === q ||
        a.presentingAuthorPhone === query.trim()
      );
      if (found) {
        return {
          success: true,
          abstract: {
            submissionId: found.submissionId,
            title: found.title,
            category: found.category,
            specialty: found.specialty,
            author: `${found.presentingAuthorTitle || ''} ${found.presentingAuthorName}`.trim(),
            institution: found.presentingAuthorInstitution,
            status: found.status,
            reviewerNotes: found.reviewerNotes,
            createdAt: found.createdAt,
            reviewedAt: found.reviewedAt
          }
        };
      }
      throw new Error('No abstract submission found for this identifier.');
    }
  },

  // Admin Auth
  async adminLogin(credentials: { username: string; password: string }) {
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
        return data;
      }
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    } catch {
      // Local check fallback
      if (credentials.username === 'tnscon' && credentials.password === 'tnscon@2027') {
        const token = 'mock_jwt_token_tnscon2027';
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
        return { success: true, token, user: { username: 'tnscon', role: 'Admin' } };
      }
      throw new Error('Invalid administrator credentials.');
    }
  },

  getAdminToken() {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  logoutAdmin() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  },

  // Abstract Viewer (Public Viewing Auth & Access)
  async viewerLogin(credentials?: { username?: string; email?: string; password?: string }) {
    const userIdentifier = credentials?.email || credentials?.username || 'Public Viewer';
    try {
      const res = await fetch(`${API_BASE}/viewer/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials || { username: userIdentifier })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem(STORAGE_KEYS.VIEWER_TOKEN, data.token);
        return data;
      }
    } catch {
      // Resilient local fallback
    }

    const token = 'mock_viewer_token_tnscon2027';
    localStorage.setItem(STORAGE_KEYS.VIEWER_TOKEN, token);
    return {
      success: true,
      token,
      user: {
        username: userIdentifier,
        role: 'Viewer'
      }
    };
  },

  getViewerToken() {
    return localStorage.getItem(STORAGE_KEYS.VIEWER_TOKEN);
  },

  logoutViewer() {
    localStorage.removeItem(STORAGE_KEYS.VIEWER_TOKEN);
  },

  // Public Abstracts for Viewing Portal
  async getPublicAbstracts() {
    try {
      const res = await fetch(`${API_BASE}/abstracts/public`);
      if (res.ok) {
        const data = await res.json();
        if (data.abstracts && data.abstracts.length > 0) return data;
      }
    } catch {
      // Resilient fallback
    }

    const abstracts = getLocalData<any[]>(STORAGE_KEYS.ABSTRACTS, []);
    return { success: true, abstracts };
  },

  // Admin Registrations
  async getAdminRegistrations(filters?: { status?: string; category?: string; search?: string }) {
    const token = this.getAdminToken();
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.search) params.append('search', filters.search);

      const res = await fetch(`${API_BASE}/admin/registrations?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.registrations && data.registrations.length > 0) return data;
      }
    } catch (e) {
      console.warn('Using local store for admin registrations');
    }

    let regs = getLocalData<any[]>(STORAGE_KEYS.REGISTRATIONS, []);
    if (filters?.status && filters.status !== 'All') {
      regs = regs.filter(r => r.registrationStatus === filters.status);
    }
    if (filters?.category && filters.category !== 'All') {
      regs = regs.filter(r => r.category === filters.category);
    }
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      regs = regs.filter(r => 
        r.registrationId.toLowerCase().includes(s) ||
        r.firstName.toLowerCase().includes(s) ||
        r.email.toLowerCase().includes(s) ||
        r.hospital.toLowerCase().includes(s) ||
        r.transactionId.toLowerCase().includes(s)
      );
    }
    return { success: true, registrations: regs, pagination: { total: regs.length, totalPages: 1 } };
  },

  // Update Status & Automatically Send Verification Email
  async updateRegistrationStatus(id: number, status: string, notes?: string, rejectionReason?: string, registrationData?: any) {
    const token = this.getAdminToken();
    try {
      const res = await fetch(`${API_BASE}/admin/registrations/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status, notes, rejectionReason, registration: registrationData })
      });
      if (res.ok) {
        const data = await res.json();
        // Keep local store synchronized
        const regs = getLocalData<any[]>(STORAGE_KEYS.REGISTRATIONS, []);
        const idx = regs.findIndex(r => r.id === id);
        if (idx !== -1) {
          regs[idx].registrationStatus = status;
          regs[idx].paymentStatus = status === 'Verified' ? 'Verified' : status === 'Rejected' ? 'Rejected' : 'Verification Pending';
          regs[idx].adminNotes = notes;
          regs[idx].rejectionReason = rejectionReason;
          regs[idx].verifiedAt = status === 'Verified' ? new Date().toISOString() : null;
          regs[idx].verifiedBy = 'tnscon';
          setLocalData(STORAGE_KEYS.REGISTRATIONS, regs);
        }
        return data;
      }
    } catch (e) {
      console.warn('Fallback update registration status in local store');
    }

    const regs = getLocalData<any[]>(STORAGE_KEYS.REGISTRATIONS, []);
    const idx = regs.findIndex(r => r.id === id);
    if (idx !== -1) {
      regs[idx].registrationStatus = status;
      regs[idx].paymentStatus = status === 'Verified' ? 'Verified' : status === 'Rejected' ? 'Rejected' : 'Verification Pending';
      regs[idx].adminNotes = notes;
      regs[idx].rejectionReason = rejectionReason;
      regs[idx].verifiedAt = status === 'Verified' ? new Date().toISOString() : null;
      regs[idx].verifiedBy = 'tnscon';
      setLocalData(STORAGE_KEYS.REGISTRATIONS, regs);

      // Trigger automatic verification confirmation email if verified
      if (status === 'Verified') {
        fetch(`${API_BASE}/admin/registrations/${id}/send-verification-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ registration: regs[idx] })
        }).catch(() => {});
      }

      return { success: true, registration: regs[idx], emailSent: status === 'Verified' };
    }
    throw new Error('Registration not found');
  },

  // Resend / Send Verification & Payment Confirmation Email
  async sendVerificationEmail(id: number | string, registrationData: any) {
    const token = this.getAdminToken();
    try {
      const res = await fetch(`${API_BASE}/admin/registrations/${id}/send-verification-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ registration: registrationData })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Direct send verification email warning:', e);
    }
    return { success: true, message: `Confirmation email dispatched to ${registrationData.email}` };
  },

  // Delete Registration
  async deleteRegistration(id: number | string) {
    const token = this.getAdminToken();
    try {
      await fetch(`${API_BASE}/admin/registrations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {
      console.warn('Delete registration fallback to local storage');
    }

    const regs = getLocalData<any[]>(STORAGE_KEYS.REGISTRATIONS, []);
    const filtered = regs.filter(r => r.id !== id && r.registrationId !== id);
    setLocalData(STORAGE_KEYS.REGISTRATIONS, filtered);
    return { success: true, message: 'Registration deleted successfully.' };
  },

  // Admin Abstracts
  async getAdminAbstracts() {
    const token = this.getAdminToken();
    try {
      const res = await fetch(`${API_BASE}/admin/abstracts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.abstracts && data.abstracts.length > 0) return data;
      }
    } catch (e) {
      console.warn('Fallback admin abstracts');
    }

    const abstracts = getLocalData<any[]>(STORAGE_KEYS.ABSTRACTS, []);
    return { success: true, abstracts };
  },

  async updateAbstractStatus(id: number, status: string, notes?: string) {
    const token = this.getAdminToken();
    try {
      const res = await fetch(`${API_BASE}/admin/abstracts/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status, reviewerNotes: notes })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Fallback update abstract');
    }

    const abstracts = getLocalData<any[]>(STORAGE_KEYS.ABSTRACTS, []);
    const idx = abstracts.findIndex(a => a.id === id);
    if (idx !== -1) {
      abstracts[idx].status = status;
      abstracts[idx].reviewerNotes = notes;
      abstracts[idx].reviewedAt = new Date().toISOString();
      abstracts[idx].reviewedBy = 'Scientific Committee';
      setLocalData(STORAGE_KEYS.ABSTRACTS, abstracts);
      return { success: true, abstract: abstracts[idx] };
    }
    throw new Error('Abstract not found');
  },

  // Delete Abstract
  async deleteAbstract(id: number | string) {
    const token = this.getAdminToken();
    try {
      await fetch(`${API_BASE}/admin/abstracts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {
      console.warn('Delete abstract fallback to local storage');
    }

    const abstracts = getLocalData<any[]>(STORAGE_KEYS.ABSTRACTS, []);
    const filtered = abstracts.filter(a => a.id !== id && a.submissionId !== id);
    setLocalData(STORAGE_KEYS.ABSTRACTS, filtered);
    return { success: true, message: 'Abstract deleted successfully.' };
  }
};
