import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { onboardingController } from '../controllers/onboarding.controller';
import { authenticateJWT, optionalAuth } from '../middleware/auth';

const router = Router();

// Multer config for Excel uploads
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'menu-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.xlsx' || ext === '.xls') {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files (.xlsx, .xls) are allowed'));
    }
  }
});

/**
 * Onboarding Routes
 * Base: /api/v1/business/onboarding
 */

// POST /setup - Setup inicial (authenticated)
router.post('/setup',
  authenticateJWT,
  upload.single('menuFile'),
  onboardingController.setup.bind(onboardingController)
);

// GET /template - Download template Excel (public)
router.get('/template',
  onboardingController.downloadTemplate.bind(onboardingController)
);

// GET /status - Ver status do onboarding (authenticated)
router.get('/status',
  authenticateJWT,
  onboardingController.getStatus.bind(onboardingController)
);

export default router;
