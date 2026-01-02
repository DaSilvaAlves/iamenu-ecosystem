import { Request, Response } from 'express';
import * as bargainService from '../services/bargains.service';

export const getAllCollectiveBargains = async (req: Request, res: Response) => {
  try {
    const result = await bargainService.getCollectiveBargains();
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching collective bargains', error: error.message });
  }
};
