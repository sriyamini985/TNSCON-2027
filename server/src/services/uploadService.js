import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadBaseDir = path.resolve(process.cwd(), 'uploads');
const paymentDir = path.join(uploadBaseDir, 'payments');
const abstractDir = path.join(uploadBaseDir, 'abstracts');
const bonafideDir = path.join(uploadBaseDir, 'bonafides');

[uploadBaseDir, paymentDir, abstractDir, bonafideDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'paymentScreenshot') {
      cb(null, paymentDir);
    } else if (file.fieldname === 'bonafideFile') {
      cb(null, bonafideDir);
    } else {
      cb(null, abstractDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'paymentScreenshot') {
    const allowed = /jpeg|jpg|png|webp|pdf/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    return cb(new Error('Only image files (JPG, PNG, WEBP) or PDF are allowed for payment screenshot.'));
  }

  if (file.fieldname === 'abstractFile') {
    const allowed = /doc|docx/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    }
    return cb(new Error('Abstract must be uploaded in DOC or DOCX format.'));
  }

  if (file.fieldname === 'bonafideFile') {
    const allowed = /pdf|jpeg|jpg|png/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    }
    return cb(new Error('Bonafide certificate must be PDF, JPG, or PNG.'));
  }

  return cb(new Error(`Unauthorized or unexpected upload field: ${file.fieldname}`));
};

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter
});

export default upload;
