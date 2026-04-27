import type { ROLE } from '@prisma/client';

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      role: ROLE;
    }

    interface Request {
      file?: Multer.File;
    }
  }
}

export {};
