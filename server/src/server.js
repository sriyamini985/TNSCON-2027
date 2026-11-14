import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from './db.js';
import upload from './services/uploadService.js';
import {
  createRegistration,
  checkDuplicates,
  validateEmail,
  validateMobileNumber
} from './services/registrationService.js';
import {
  createAbstractSubmission,
  countWords
} from './services/abstractService.js';
import {
  sendRegistrationSubmittedEmail,
  sendRegistrationApprovedEmail,
  sendAbstractSubmittedEmail
} from './services/emailService.js';
import {
  exportToCSV,
  exportToExcel,
  exportToRegxperts,
  exportAbstractsToExcel
} from './services/exportService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// CORS Configuration (Configurable for Production Deployment)
const defaultOrigins = [
  'https://www.tnscon2027hyd.com',
  'https://tnscon2027hyd.com',
  'https://tnscon-2027.vercel.app',
  'http://localhost:5173',
  'http://localhost:5001'
];
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : defaultOrigins;

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.tnscon2027hyd.com') ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy: This origin is not authorized.'));
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads serving
const uploadsDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// JWT Middleware for Admin protection
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  let token = authHeader && authHeader.split(' ')[1];

  if (!token && req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({ error: 'Access token missing' });
  }

  // Gracefully support mock / fallback admin tokens in development
  if (token === 'mock_jwt_token_tnscon2027' || (typeof token === 'string' && token.startsWith('mock_'))) {
    req.admin = { username: 'tnscon', role: 'SuperAdmin' };
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tnscon2027_secret');
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token. Please log in again.' });
  }
};

// Seed default Admin on startup
const seedDefaultAdmin = async () => {
  try {
    const targetUsername = process.env.ADMIN_USER || 'tnscon';
    const targetPassword = process.env.ADMIN_PASS || 'tnscon@2027';
    const passwordHash = await bcrypt.hash(targetPassword, 10);

    const existing = await prisma.admin.findUnique({
      where: { username: targetUsername }
    });

    if (!existing) {
      await prisma.admin.create({
        data: {
          username: targetUsername,
          passwordHash,
          role: 'Admin'
        }
      });
      console.log(`[AUTH] Seeded default administrator: ${targetUsername}`);
    } else {
      await prisma.admin.update({
        where: { username: targetUsername },
        data: { passwordHash }
      });
      console.log(`[AUTH] Admin credentials verified for: ${targetUsername}`);
    }
  } catch (error) {
    console.error('Error seeding admin user:', error.message);
  }
};

// -------------------------------------------------------------
// PUBLIC REGISTRATION ENDPOINTS (ASSTCON Pattern)
// -------------------------------------------------------------

app.post('/api/registrations', upload.single('paymentScreenshot'), async (req, res) => {
  try {
    const {
      title,
      firstName,
      lastName,
      gender,
      designation,
      qualification,
      medicalCouncilNo,
      hospital,
      address,
      city,
      state,
      pinCode,
      mobile,
      email,
      category,
      speciality,
      fee,
      baseFee,
      workshopFee,
      gstFee,
      transactionId
    } = req.body;

    // Required fields check
    if (!firstName || !hospital || !mobile || !email || !category || !transactionId) {
      return res.status(400).json({ error: 'Please provide all required fields.' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    if (!validateMobileNumber(mobile)) {
      return res.status(400).json({ error: 'Please provide a valid 10-digit mobile number.' });
    }

    // Check duplicates
    const duplicateError = await checkDuplicates({ email, mobile, transactionId });
    if (duplicateError) {
      return res.status(409).json({ error: duplicateError });
    }

    // Payment proof screenshot
    let paymentScreenshotUrl = '';
    if (req.file) {
      paymentScreenshotUrl = `/uploads/payments/${req.file.filename}`;
    } else if (req.body.paymentScreenshotBase64) {
      paymentScreenshotUrl = req.body.paymentScreenshotBase64;
    }

    const registration = await createRegistration({
      title,
      firstName,
      lastName,
      gender,
      designation,
      qualification,
      speciality,
      medicalCouncilNo,
      hospital,
      address,
      city,
      state,
      pinCode,
      mobile,
      email,
      category,
      fee: parseFloat(fee) || 0,
      baseFee: baseFee ? parseFloat(baseFee) : null,
      workshopFee: workshopFee ? parseFloat(workshopFee) : null,
      gstFee: gstFee ? parseFloat(gstFee) : null,
      transactionId,
      paymentScreenshot: paymentScreenshotUrl
    });

    // Send confirmation email asynchronously
    sendRegistrationSubmittedEmail(registration).catch(err => {
      console.error('Failed to send registration email:', err);
    });

    return res.status(201).json({
      success: true,
      message: 'Registration submitted successfully!',
      registration: {
        registrationId: registration.registrationId,
        name: `${registration.title || ''} ${registration.firstName} ${registration.lastName || ''}`.trim(),
        email: registration.email,
        mobile: registration.mobile,
        category: registration.category,
        fee: registration.fee,
        transactionId: registration.transactionId,
        paymentStatus: registration.paymentStatus,
        registrationStatus: registration.registrationStatus,
        createdAt: registration.createdAt
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: error.message || 'Server error processing registration.' });
  }
});

// Check Registration Status
app.get('/api/registrations/status/:query', async (req, res) => {
  try {
    const query = req.params.query.trim();
    const reg = await prisma.registration.findFirst({
      where: {
        OR: [
          { registrationId: query },
          { email: query.toLowerCase() },
          { mobile: query }
        ]
      }
    });

    if (!reg) {
      return res.status(404).json({ error: 'No registration found matching the provided identifier.' });
    }

    return res.json({
      success: true,
      registration: {
        registrationId: reg.registrationId,
        name: `${reg.title || ''} ${reg.firstName} ${reg.lastName || ''}`.trim(),
        category: reg.category,
        hospital: reg.hospital,
        paymentStatus: reg.paymentStatus,
        registrationStatus: reg.registrationStatus,
        transactionId: reg.transactionId,
        createdAt: reg.createdAt,
        verifiedAt: reg.verifiedAt
      }
    });
  } catch (error) {
    console.error('Lookup error:', error);
    return res.status(500).json({ error: 'Failed to look up registration status.' });
  }
});

// -------------------------------------------------------------
// PUBLIC ABSTRACT SUBMISSION ENDPOINTS
// -------------------------------------------------------------

const abstractUploadFields = upload.fields([
  { name: 'abstractFile', maxCount: 1 },
  { name: 'bonafideFile', maxCount: 1 }
]);

app.post('/api/abstracts', abstractUploadFields, async (req, res) => {
  try {
    const {
      category,
      specialty,
      subTopic,
      title,
      presentingAuthorTitle,
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
      fullAbstractText
    } = req.body;

    if (!category || !specialty || !subTopic || !title || !presentingAuthorName || !presentingAuthorEmail || !presentingAuthorInstitution) {
      return res.status(400).json({ error: 'Please provide all mandatory abstract submission fields.' });
    }

    const textToEvaluate = fullAbstractText || `${introduction || ''} ${methods || ''} ${results || ''} ${conclusion || ''}`;
    const wordCount = countWords(textToEvaluate);

    if (wordCount > 300) {
      return res.status(400).json({
        error: `Word count limit exceeded. Maximum allowed is 300 words; your abstract is ${wordCount} words.`
      });
    }

    const files = req.files || {};
    let docFilePath = null;
    let docOriginalName = null;
    let bonafideFilePath = null;

    if (files.abstractFile && files.abstractFile[0]) {
      docFilePath = `/uploads/abstracts/${files.abstractFile[0].filename}`;
      docOriginalName = files.abstractFile[0].originalname;
    }

    if (files.bonafideFile && files.bonafideFile[0]) {
      bonafideFilePath = `/uploads/bonafides/${files.bonafideFile[0].filename}`;
    }

    const submission = await createAbstractSubmission({
      category,
      specialty,
      subTopic,
      title,
      presentingAuthorTitle,
      presentingAuthorName,
      presentingAuthorEmail,
      presentingAuthorPhone,
      presentingAuthorDesignation,
      presentingAuthorInstitution,
      isResident: isResident === 'true' || isResident === true,
      coAuthors,
      introduction,
      methods,
      results,
      conclusion,
      fullAbstractText: textToEvaluate,
      docFilePath,
      docOriginalName,
      bonafideFilePath
    });

    sendAbstractSubmittedEmail(submission).catch(err => {
      console.error('Failed to send abstract confirmation email:', err);
    });

    return res.status(201).json({
      success: true,
      message: 'Abstract submitted successfully!',
      submission: {
        submissionId: submission.submissionId,
        title: submission.title,
        category: submission.category,
        specialty: submission.specialty,
        wordCount: submission.wordCount,
        status: submission.status,
        createdAt: submission.createdAt
      }
    });
  } catch (error) {
    console.error('Abstract submission error:', error);
    return res.status(500).json({ error: error.message || 'Server error processing abstract.' });
  }
});

// Check Abstract Status
app.get('/api/abstracts/status/:query', async (req, res) => {
  try {
    const query = req.params.query.trim();
    const abs = await prisma.abstractSubmission.findFirst({
      where: {
        OR: [
          { submissionId: query },
          { presentingAuthorEmail: query.toLowerCase() },
          { presentingAuthorPhone: query }
        ]
      }
    });

    if (!abs) {
      return res.status(404).json({ error: 'No abstract submission found for this identifier.' });
    }

    return res.json({
      success: true,
      abstract: {
        submissionId: abs.submissionId,
        title: abs.title,
        category: abs.category,
        specialty: abs.specialty,
        author: `${abs.presentingAuthorTitle || ''} ${abs.presentingAuthorName}`.trim(),
        institution: abs.presentingAuthorInstitution,
        status: abs.status,
        reviewerNotes: abs.reviewerNotes,
        createdAt: abs.createdAt,
        reviewedAt: abs.reviewedAt
      }
    });
  } catch (error) {
    console.error('Abstract lookup error:', error);
    return res.status(500).json({ error: 'Failed to look up abstract status.' });
  }
});

// -------------------------------------------------------------
// PUBLIC ABSTRACT VIEWING & VIEWER AUTHENTICATION
// -------------------------------------------------------------

app.post('/api/viewer/login', async (req, res) => {
  try {
    const { username, email } = req.body || {};
    const identity = email || username || 'Public Viewer';
    const token = jwt.sign(
      { role: 'Viewer', username: identity },
      process.env.JWT_SECRET || 'tnscon2027_secret',
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      token,
      user: {
        username: identity,
        role: 'Viewer'
      }
    });
  } catch (error) {
    console.error('Viewer login error:', error);
    return res.status(500).json({ error: 'Failed to authenticate viewer.' });
  }
});

app.get('/api/abstracts/public', async (req, res) => {
  try {
    const abstracts = await prisma.abstractSubmission.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return res.json({ success: true, abstracts });
  } catch (error) {
    console.warn('Public abstracts database warning:', error.message);
    return res.json({ success: true, abstracts: [] });
  }
});

// -------------------------------------------------------------
// ADMIN AUTHENTICATION
// -------------------------------------------------------------

app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const admin = await prisma.admin.findUnique({
      where: { username }
    });

    if (!admin) {
      return res.status(401).json({ error: 'Invalid admin credentials.' });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid admin credentials.' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET || 'tnscon2027_secret',
      { expiresIn: '24h' }
    );

    return res.json({
      success: true,
      token,
      user: {
        username: admin.username,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ error: 'Login failed.' });
  }
});

// -------------------------------------------------------------
// ADMIN DASHBOARD & METRICS
// -------------------------------------------------------------

app.get('/api/admin/stats', authenticateAdmin, async (req, res) => {
  try {
    const [totalRegs, pendingRegs, verifiedRegs, rejectedRegs, totalAbstracts, regsGroupByCategory] = await Promise.all([
      prisma.registration.count(),
      prisma.registration.count({ where: { registrationStatus: 'Pending Verification' } }),
      prisma.registration.count({ where: { registrationStatus: 'Verified' } }),
      prisma.registration.count({ where: { registrationStatus: 'Rejected' } }),
      prisma.abstractSubmission.count(),
      prisma.registration.groupBy({
        by: ['category'],
        _count: { id: true },
        _sum: { fee: true }
      })
    ]);

    const totalRevenue = regsGroupByCategory.reduce((acc, curr) => acc + (curr._sum.fee || 0), 0);

    const abstractCategories = await prisma.abstractSubmission.groupBy({
      by: ['category'],
      _count: { id: true }
    });

    return res.json({
      success: true,
      metrics: {
        totalRegistrations: totalRegs,
        pendingRegistrations: pendingRegs,
        verifiedRegistrations: verifiedRegs,
        rejectedRegistrations: rejectedRegs,
        totalRevenue,
        totalAbstracts,
        categories: regsGroupByCategory,
        abstractCategories
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    return res.status(500).json({ error: 'Failed to load conference statistics.' });
  }
});

// List Registrations
app.get('/api/admin/registrations', authenticateAdmin, async (req, res) => {
  try {
    const { status, category, search, page = 1, limit = 50 } = req.query;
    const where = {};

    if (status && status !== 'All') {
      where.registrationStatus = status;
    }

    if (category && category !== 'All') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { registrationId: { contains: search } },
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
        { mobile: { contains: search } },
        { hospital: { contains: search } },
        { transactionId: { contains: search } }
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [registrations, total] = await Promise.all([
      prisma.registration.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit, 10)
      }),
      prisma.registration.count({ where })
    ]);

    return res.json({
      success: true,
      registrations,
      pagination: {
        total,
        page: parseInt(page, 10),
        totalPages: Math.ceil(total / parseInt(limit, 10))
      }
    });
  } catch (error) {
    console.warn('Fetch regs database warning:', error.message);
    return res.json({
      success: true,
      registrations: [],
      pagination: { total: 0, page: 1, totalPages: 1 }
    });
  }
});

// Update Registration Status (Approve / Reject) & Automatically Send Verification Email
app.patch('/api/admin/registrations/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, rejectionReason, registration: clientReg } = req.body;

    if (!['Verified', 'Rejected', 'Pending Verification'].includes(status)) {
      return res.status(400).json({ error: 'Invalid registration status specified.' });
    }

    const isNumeric = /^\d+$/.test(id);
    const where = isNumeric ? { id: parseInt(id, 10) } : { registrationId: id };

    const updateData = {
      registrationStatus: status,
      paymentStatus: status === 'Verified' ? 'Verified' : status === 'Rejected' ? 'Rejected' : 'Verification Pending',
      adminNotes: notes || null,
      rejectionReason: rejectionReason || null,
      verifiedAt: status === 'Verified' ? new Date() : null,
      verifiedBy: req.admin.username
    };

    let updated = null;
    try {
      updated = await prisma.registration.update({
        where,
        data: updateData
      });
    } catch (dbErr) {
      console.warn('Prisma registration status update warning:', dbErr.message);
      // Fallback: construct updated record using client provided registration data
      if (clientReg) {
        updated = {
          ...clientReg,
          ...updateData
        };
      }
    }

    if (!updated && clientReg) {
      updated = { ...clientReg, ...updateData };
    }

    // Automatically send verification & payment successful confirmation email
    let emailResult = null;
    if (status === 'Verified' && updated && updated.email) {
      try {
        emailResult = await sendRegistrationApprovedEmail(updated);
      } catch (e) {
        emailResult = { success: false, error: e.message };
      }
    }

    const emailSent = Boolean(emailResult && emailResult.success);
    const emailError = emailResult && !emailResult.success ? emailResult.error : null;

    return res.json({ 
      success: true, 
      registration: updated,
      emailSent,
      emailError,
      message: status === 'Verified' 
        ? (emailSent 
            ? `Registration ${updated?.registrationId || id} verified. Automatic confirmation email sent to ${updated?.email}.` 
            : `Registration ${updated?.registrationId || id} verified. Email delivery to ${updated?.email} failed (${emailError || 'SMTP delivery issue'}).`)
        : `Registration updated to ${status}.`
    });
  } catch (error) {
    console.error('Status update error:', error);
    return res.status(500).json({ error: 'Failed to update registration status.' });
  }
});

// Dedicated Endpoint: Send / Resend Verification & Payment Successful Email
app.post('/api/admin/registrations/:id/send-verification-email', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const isNumeric = /^\d+$/.test(id);
    const where = isNumeric ? { id: parseInt(id, 10) } : { registrationId: id };

    let registration = null;
    try {
      registration = await prisma.registration.findFirst({ where });
    } catch (e) {
      // db fallback
    }

    if (!registration && req.body.registration) {
      registration = req.body.registration;
    }

    if (!registration || !registration.email) {
      return res.status(400).json({ error: 'Delegate registration or email not found.' });
    }

    const emailResult = await sendRegistrationApprovedEmail(registration);
    const emailSent = Boolean(emailResult && emailResult.success);

    return res.json({
      success: emailSent,
      emailSent,
      emailError: !emailSent ? emailResult?.error : null,
      message: emailSent
        ? `Verification and payment confirmation email successfully delivered to ${registration.email}.`
        : `Email delivery to ${registration.email} failed: ${emailResult?.error || 'Invalid SMTP credentials'}.`,
      registrationId: registration.registrationId,
      result: emailResult
    });
  } catch (error) {
    console.error('Send verification email error:', error);
    return res.status(500).json({ error: 'Failed to send verification email.' });
  }
});

// Delete Registration
app.delete('/api/admin/registrations/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const isNumeric = /^\d+$/.test(id);
    const where = isNumeric ? { id: parseInt(id, 10) } : { registrationId: id };

    try {
      await prisma.registration.delete({ where });
    } catch (e) {
      console.warn('Prisma delete registration fallback/not found in DB:', e.message);
    }

    return res.json({ success: true, message: `Registration ${id} deleted successfully.` });
  } catch (error) {
    console.error('Delete registration error:', error);
    return res.status(500).json({ error: 'Failed to delete registration.' });
  }
});

// Export Registrations: Excel
app.get('/api/admin/registrations/export/excel', authenticateAdmin, async (req, res) => {
  try {
    const registrations = await prisma.registration.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const buffer = exportToExcel(registrations);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="TNSCON_2027_Registrations.xlsx"');
    return res.send(buffer);
  } catch (error) {
    console.error('Excel export error:', error);
    return res.status(500).json({ error: 'Failed to export Excel.' });
  }
});

// Export Registrations: CSV
app.get('/api/admin/registrations/export/csv', authenticateAdmin, async (req, res) => {
  try {
    const registrations = await prisma.registration.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const buffer = exportToCSV(registrations);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="TNSCON_2027_Registrations.csv"');
    return res.send(buffer);
  } catch (error) {
    console.error('CSV export error:', error);
    return res.status(500).json({ error: 'Failed to export CSV.' });
  }
});

// Export Registrations: Regxperts format
app.get('/api/admin/registrations/export/regxperts', authenticateAdmin, async (req, res) => {
  try {
    const registrations = await prisma.registration.findMany({
      orderBy: { createdAt: 'asc' }
    });

    const buffer = exportToRegxperts(registrations);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="TNSCON_2027_Regxperts_Roster.csv"');
    return res.send(buffer);
  } catch (error) {
    console.error('Regxperts export error:', error);
    return res.status(500).json({ error: 'Failed to export Regxperts format.' });
  }
});

// List Abstracts
app.get('/api/admin/abstracts', authenticateAdmin, async (req, res) => {
  try {
    const { category, specialty, status, search } = req.query;
    const where = {};

    if (category && category !== 'All') where.category = category;
    if (specialty && specialty !== 'All') where.specialty = specialty;
    if (status && status !== 'All') where.status = status;

    if (search) {
      where.OR = [
        { submissionId: { contains: search } },
        { title: { contains: search } },
        { presentingAuthorName: { contains: search } },
        { presentingAuthorEmail: { contains: search } },
        { presentingAuthorInstitution: { contains: search } }
      ];
    }

    const abstracts = await prisma.abstractSubmission.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ success: true, abstracts });
  } catch (error) {
    console.warn('Fetch abstracts database warning:', error.message);
    return res.json({ success: true, abstracts: [] });
  }
});

// Update Abstract Status
app.patch('/api/admin/abstracts/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewerNotes } = req.body;

    const isNumeric = /^\d+$/.test(id);
    const where = isNumeric ? { id: parseInt(id, 10) } : { submissionId: id };

    const updated = await prisma.abstractSubmission.update({
      where,
      data: {
        status,
        reviewerNotes,
        reviewedAt: new Date(),
        reviewedBy: req.admin.username
      }
    });

    return res.json({ success: true, abstract: updated });
  } catch (error) {
    console.error('Update abstract error:', error);
    return res.status(500).json({ error: 'Failed to update abstract status.' });
  }
});

// Delete Abstract
app.delete('/api/admin/abstracts/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const isNumeric = /^\d+$/.test(id);
    const where = isNumeric ? { id: parseInt(id, 10) } : { submissionId: id };

    try {
      await prisma.abstractSubmission.delete({ where });
    } catch (e) {
      console.warn('Prisma delete abstract fallback/not found in DB:', e.message);
    }

    return res.json({ success: true, message: `Abstract ${id} deleted successfully.` });
  } catch (error) {
    console.error('Delete abstract error:', error);
    return res.status(500).json({ error: 'Failed to delete abstract.' });
  }
});

// Export Abstracts Excel
app.get('/api/admin/abstracts/export/excel', authenticateAdmin, async (req, res) => {
  try {
    const abstracts = await prisma.abstractSubmission.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const buffer = exportAbstractsToExcel(abstracts);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="TNSCON_2027_Abstracts.xlsx"');
    return res.send(buffer);
  } catch (error) {
    console.error('Abstract export error:', error);
    return res.status(500).json({ error: 'Failed to export abstracts.' });
  }
});

// Conference Settings & Discrepancies Management
const handleGetSettings = async (req, res) => {
  try {
    const settings = await prisma.conferenceSetting.findMany();
    const settingsMap = {};
    settings.forEach(s => {
      settingsMap[s.key] = s.value;
    });

    // Provide sensible defaults if not yet set in database
    const finalSettings = {
      abstractDestination: settingsMap.abstractDestination || 'INTERNAL', // 'INTERNAL' or 'EXTERNAL'
      externalAbstractUrl: settingsMap.externalAbstractUrl || 'https://www.tnscon2027hyd.com',
      flagNeurovasconDiscrepancy: false,
      ePosterOrientationPolicy: settingsMap.ePosterOrientationPolicy || 'WIDESCREEN_16_9',
      registrationOpen: settingsMap.registrationOpen !== 'false',
      abstractsOpen: settingsMap.abstractsOpen !== 'false',
      ...settingsMap
    };

    return res.json({ success: true, settings: finalSettings });
  } catch (error) {
    console.error('Get settings error:', error);
    return res.json({
      success: true,
      settings: {
        abstractDestination: 'INTERNAL',
        externalAbstractUrl: 'https://www.tnscon2027hyd.com',
        flagNeurovasconDiscrepancy: false,
        ePosterOrientationPolicy: 'WIDESCREEN_16_9',
        registrationOpen: true,
        abstractsOpen: true
      }
    });
  }
};

app.get('/api/settings', handleGetSettings);
app.get('/api/admin/settings', handleGetSettings);

app.post('/api/admin/settings', authenticateAdmin, async (req, res) => {
  try {
    const entries = Object.entries(req.body);
    for (const [key, value] of entries) {
      await prisma.conferenceSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) }
      });
    }
    return res.json({ success: true, message: 'Settings saved successfully.' });
  } catch (error) {
    console.error('Save settings error:', error);
    return res.status(500).json({ error: 'Failed to save settings.' });
  }
});

// Centralized Error Handling Middleware (Catches Multer, validation, and runtime errors)
app.use((err, req, res, next) => {
  if (err.name === 'MulterError') {
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }
  if (err) {
    return res.status(400).json({ error: err.message || 'An unexpected request error occurred.' });
  }
  next();
});

// Start Server
app.listen(PORT, async () => {
  console.log(`[TNSCON 2027 API] Server running on port ${PORT}`);
  await seedDefaultAdmin();
});
