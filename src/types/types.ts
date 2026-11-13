export interface RegistrationFormData {
  title: string;
  firstName: string;
  lastName: string;
  gender: string;
  speciality?: 'Neurosurgery' | 'Neurology' | string;
  designation: string;
  qualification: string;
  medicalCouncilNo: string;
  hospital: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  mobile: string;
  email: string;
  category: string;
  fee: number;
  includeWorkshop?: boolean;
  workshopFee?: number;
  baseFee?: number;
  subtotalFee?: number;
  gstFee?: number;
  transactionId: string;
  paymentScreenshot?: File | null;
  paymentScreenshotBase64?: string;
}

export interface RegistrationRecord {
  id: number;
  registrationId: string;
  title?: string;
  firstName: string;
  lastName?: string;
  gender?: string;
  speciality?: string;
  designation?: string;
  qualification?: string;
  medicalCouncilNo?: string;
  hospital: string;
  address?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  mobile: string;
  email: string;
  category: string;
  fee: number;
  includeWorkshop?: boolean;
  workshopFee?: number;
  baseFee?: number;
  subtotalFee?: number;
  gstFee?: number;
  transactionId: string;
  paymentScreenshot?: string;
  registrationStatus: 'Pending Verification' | 'Verified' | 'Rejected';
  paymentStatus: 'Verification Pending' | 'Verified' | 'Rejected';
  exportStatus: 'Pending' | 'Exported';
  adminNotes?: string;
  rejectionReason?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CoAuthor {
  name: string;
  institution?: string;
  email?: string;
}

export interface AbstractSubmissionData {
  category: 'Award Paper Presentation' | 'Free Paper Presentation' | 'Poster Presentation';
  specialty: 'Neurosurgery' | 'Neurology';
  subTopic: string;
  title: string;
  wordCount: number;
  presentingAuthorTitle: string;
  presentingAuthorName: string;
  presentingAuthorEmail: string;
  presentingAuthorPhone: string;
  presentingAuthorDesignation: string;
  presentingAuthorInstitution: string;
  isResident: boolean;
  coAuthors: string;
  coAuthorsList?: CoAuthor[];
  introduction: string;
  methods: string;
  results: string;
  conclusion: string;
  fullAbstractText: string;
  abstractFile?: File | null;
  bonafideFile?: File | null;
}

export interface AbstractRecord {
  id: number;
  submissionId: string;
  category: string;
  specialty: string;
  subTopic: string;
  title: string;
  wordCount: number;
  presentingAuthorTitle?: string;
  presentingAuthorName: string;
  presentingAuthorEmail: string;
  presentingAuthorPhone: string;
  presentingAuthorDesignation?: string;
  presentingAuthorInstitution: string;
  isResident: boolean;
  coAuthors?: string;
  coAuthorsList?: CoAuthor[];
  introduction?: string;
  methods?: string;
  results?: string;
  conclusion?: string;
  fullAbstractText: string;
  docFilePath?: string;
  docOriginalName?: string;
  bonafideFilePath?: string;
  status: 'Submitted' | 'Under Review' | 'Accepted' | 'Rejected' | 'Revision Requested';
  reviewerNotes?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  createdAt: string;
}

export interface RegistrationCategoryTier {
  id: string;
  name: string;
  description: string;
  fee: number;
  badge?: string;
  features: string[];
}
