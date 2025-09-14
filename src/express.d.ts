import 'express';
import 'express-session';
import { User } from '@/generated/prisma/client';

declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    user: User;
    userProjectRole: ProjectRole | 'NONE';
  }
}
