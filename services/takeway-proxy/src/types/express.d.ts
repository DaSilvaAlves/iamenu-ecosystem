// src/types/express.d.ts
import * as express from 'express';
import { Multer } from 'multer'; // Import Multer to get its types

declare global {
  namespace Express {
    interface Request {
      file?: Multer.File; // Add the 'file' property to the Request object
      files?: Multer.File[] | { [fieldname: string]: Multer.File[] }; // For .array() or .fields()
    }
  }
}
