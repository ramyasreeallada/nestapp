// src/auth/auth-request.interface.ts
import { Request } from 'express';

export interface AuthRequest extends Request {
  session: any;
  user?: any;
}
