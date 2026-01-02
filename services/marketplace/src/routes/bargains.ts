import { Router } from 'express';
import * as bargainController from '../controllers/bargains.controller';

const router = Router();

router.get('/', bargainController.getAllCollectiveBargains);

export default router;
