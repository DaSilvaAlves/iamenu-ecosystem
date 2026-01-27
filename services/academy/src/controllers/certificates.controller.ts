import { Request, Response } from 'express';
import * as certificatesService from '../services/certificates.service';

// ===================================
// Issue Certificate
// ===================================

export const issueCertificate = async (req: Request, res: Response) => {
  try {
    const { userId, courseId } = req.body;

    if (!userId || !courseId) {
      return res.status(400).json({ message: 'userId and courseId are required' });
    }

    const certificate = await certificatesService.issueCertificate(userId, courseId);
    res.status(201).json(certificate);
  } catch (error: any) {
    if (error.message.includes('not enrolled')) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes('must be completed')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error issuing certificate', error: error.message });
  }
};

// ===================================
// Get User Certificates
// ===================================

export const getUserCertificates = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const certificates = await certificatesService.getUserCertificates(userId);
    res.status(200).json({ certificates, total: certificates.length });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching certificates', error: error.message });
  }
};

// ===================================
// Verify Certificate
// ===================================

export const verifyCertificate = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;

    const result = await certificatesService.verifyCertificate(code);

    if (!result) {
      return res.status(404).json({ valid: false, message: 'Certificate not found' });
    }

    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: 'Error verifying certificate', error: error.message });
  }
};

// ===================================
// Get Certificate by ID
// ===================================

export const getCertificateById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const certificate = await certificatesService.getCertificateById(id);

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    res.status(200).json(certificate);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching certificate', error: error.message });
  }
};
