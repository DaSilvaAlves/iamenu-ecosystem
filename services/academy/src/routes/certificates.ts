import { Router } from 'express';
import * as certificatesController from '../controllers/certificates.controller';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

// ===================================
// Certificate Routes
// ===================================

// POST /certificates - Issue a certificate
router.post('/', authenticateJWT, certificatesController.issueCertificate);

// GET /certificates/users/:userId - Get user's certificates
router.get('/users/:userId', authenticateJWT, certificatesController.getUserCertificates);

// GET /certificates/verify/:code - Verify certificate (public)
router.get('/verify/:code', certificatesController.verifyCertificate);

// GET /certificates/:id - Get certificate by ID
router.get('/:id', authenticateJWT, certificatesController.getCertificateById);

export default router;
