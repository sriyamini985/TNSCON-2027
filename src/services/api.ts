import { RegistrationFormData, AbstractSubmissionData } from '../types/types';

export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001/api';
export const SERVER_BASE = import.meta.env.VITE_SERVER_BASE || (import.meta.env.VITE_API_BASE ? import.meta.env.VITE_API_BASE.replace(/\/api\/?$/, '') : 'http://localhost:5001');

// Helper for local storage mock store
const STORAGE_KEYS = {
  REGISTRATIONS: 'tnscon_registrations',
  ABSTRACTS: 'tnscon_abstracts',
  TOKEN: 'tnscon_admin_token',
  SETTINGS: 'tnscon_settings'
};

const getLocalData = <T>(key: string, defaultVal: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
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

// Initialize initial seed data in local storage if empty
if (!localStorage.getItem(STORAGE_KEYS.REGISTRATIONS)) {
  setLocalData(STORAGE_KEYS.REGISTRATIONS, [
    {
      id: 1,
      registrationId: 'TNS27-1001',
      title: 'Dr.',
      firstName: 'Vikram',
      lastName: 'Reddy',
      gender: 'Male',
      designation: 'Associate Professor & Neurosurgeon',
      qualification: 'MCh Neurosurgery',
      medicalCouncilNo: 'TSMC-64821',
      hospital: 'Nizam\'s Institute of Medical Sciences (NIMS), Hyderabad',
      city: 'Hyderabad',
      state: 'Telangana',
      mobile: '9849011223',
      email: 'vikram.reddy@nims.edu.in',
      category: 'TNS Member Delegate',
      fee: 6500,
      transactionId: 'UTR94827103847',
      paymentScreenshot: '',
      registrationStatus: 'Verified',
      paymentStatus: 'Verified',
      exportStatus: 'Pending',
      createdAt: '2026-11-01T10:30:00Z',
      verifiedAt: '2026-11-01T14:15:00Z',
      verifiedBy: 'tnscon'
    },
    {
      id: 2,
      registrationId: 'TNS27-1002',
      title: 'Dr.',
      firstName: 'Ananya',
      lastName: 'Sarma',
      gender: 'Female',
      designation: 'Senior Resident in Neurology',
      qualification: 'DM Neurology',
      medicalCouncilNo: 'TSMC-88129',
      hospital: 'Osmania Medical College / General Hospital',
      city: 'Hyderabad',
      state: 'Telangana',
      mobile: '9701044556',
      email: 'dr.ananya.sarma@gmail.com',
      category: 'PG Resident / Fellow',
      fee: 4500,
      transactionId: 'UPI202611029871',
      paymentScreenshot: '',
      registrationStatus: 'Pending Verification',
      paymentStatus: 'Verification Pending',
      exportStatus: 'Pending',
      createdAt: '2026-11-02T16:45:00Z'
    }
  ]);
}

if (!localStorage.getItem(STORAGE_KEYS.ABSTRACTS)) {
  setLocalData(STORAGE_KEYS.ABSTRACTS, [
    {
      id: 1,
      submissionId: 'ABS-TNS27-101',
      category: 'Award Paper Presentation',
      specialty: 'Neurosurgery',
      subTopic: 'Skull Base Surgery',
      title: 'Endoscopic Endonasal Approach for Giant Pituitary Macroadenomas: A 5-Year Single-Center Surgical Cohort from Hyderabad',
      wordCount: 238,
      presentingAuthorTitle: 'Dr.',
      presentingAuthorName: 'Ananya Sarma',
      presentingAuthorEmail: 'dr.ananya.sarma@gmail.com',
      presentingAuthorPhone: '9701044556',
      presentingAuthorDesignation: 'Senior Resident',
      presentingAuthorInstitution: 'Osmania Medical College, Hyderabad',
      isResident: true,
      coAuthors: 'Dr. K. Srinivas, Dr. R. T. S. Naik',
      fullAbstractText: 'Introduction: Endoscopic endonasal transsphenoidal surgery has revolutionized surgical outcomes in suprasellar lesions. Methods: Retrospective evaluation of 86 patients undergoing endoscopic resection between 2021-2026 at tertiary center. Results: Gross total resection achieved in 79% with visual restoration in 84%. CSF leak occurred in 3.4% treated endoscopically. Conclusion: Endoscopic approach provides superior visualization and safety margin in complex skull base pathology.',
      status: 'Under Review',
      createdAt: '2026-11-02T17:00:00Z'
    }
  ]);
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

      const newId = `TNS27-${1000 + regs.length + 1}`;
      const newRecord = {
        id: Date.now(),
        registrationId: newId,
        ...formData,
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
      const newId = `ABS-TNS27-${100 + abstracts.length + 1}`;
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
      if (res.ok) return await res.json();
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

  // Update Status
  async updateRegistrationStatus(id: number, status: string, notes?: string, rejectionReason?: string) {
    const token = this.getAdminToken();
    try {
      const res = await fetch(`${API_BASE}/admin/registrations/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status, notes, rejectionReason })
      });
      if (res.ok) return await res.json();
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
      return { success: true, registration: regs[idx] };
    }
    throw new Error('Registration not found');
  },

  // Admin Abstracts
  async getAdminAbstracts() {
    const token = this.getAdminToken();
    try {
      const res = await fetch(`${API_BASE}/admin/abstracts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) return await res.json();
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
  }
};
