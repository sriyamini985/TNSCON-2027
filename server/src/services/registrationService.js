import prisma from '../db.js';

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validateMobileNumber = (mobile) => {
  const cleanMobile = String(mobile).replace(/\D/g, '');
  return cleanMobile.length >= 10 && cleanMobile.length <= 13;
};

export const checkDuplicates = async ({ email, mobile, transactionId, excludeId = null }) => {
  const conditions = [];
  if (email) conditions.push({ email });
  if (mobile) conditions.push({ mobile });
  if (transactionId) conditions.push({ transactionId });

  if (conditions.length === 0) return null;

  const whereClause = {
    OR: conditions
  };

  if (excludeId) {
    whereClause.NOT = { id: excludeId };
  }

  const existing = await prisma.registration.findFirst({
    where: whereClause
  });

  if (!existing) return null;

  if (existing.email.toLowerCase() === (email || '').toLowerCase()) {
    return 'This email address is already registered.';
  }
  if (existing.mobile === mobile) {
    return 'This mobile number is already registered.';
  }
  if (existing.transactionId.toLowerCase() === (transactionId || '').toLowerCase()) {
    return 'This Transaction / UTR reference number has already been submitted.';
  }

  return 'A duplicate registration record already exists.';
};

export const generateRegistrationId = async () => {
  const highest = await prisma.registration.findFirst({
    orderBy: { id: 'desc' },
    select: { id: true }
  });
  let nextNum = (highest ? highest.id : 0) + 1;
  let formatted = `TNS-${String(nextNum).padStart(3, '0')}`;
  while (await prisma.registration.findUnique({ where: { registrationId: formatted } })) {
    nextNum++;
    formatted = `TNS-${String(nextNum).padStart(3, '0')}`;
  }
  return formatted;
};

export const createRegistration = async (data) => {
  const regId = await generateRegistrationId();
  return prisma.registration.create({
    data: {
      registrationId: regId,
      title: data.title || 'Dr.',
      firstName: data.firstName.trim(),
      lastName: data.lastName ? data.lastName.trim() : '',
      gender: data.gender || 'Male',
      designation: data.designation || 'Consultant',
      qualification: data.qualification || '',
      speciality: data.speciality || 'Neurosurgery',
      medicalCouncilNo: data.medicalCouncilNo || '',
      hospital: data.hospital.trim(),
      address: data.address || '',
      city: data.city || '',
      state: data.state || '',
      pinCode: data.pinCode || '',
      mobile: data.mobile.trim(),
      email: data.email.trim().toLowerCase(),
      category: data.category,
      fee: parseFloat(data.fee) || 0,
      baseFee: data.baseFee ? parseFloat(data.baseFee) : null,
      workshopFee: data.workshopFee ? parseFloat(data.workshopFee) : null,
      gstFee: data.gstFee ? parseFloat(data.gstFee) : null,
      transactionId: data.transactionId.trim(),
      paymentScreenshot: data.paymentScreenshot || '',
      registrationStatus: 'Pending Verification',
      paymentStatus: 'Verification Pending',
      exportStatus: 'Pending'
    }
  });
};
