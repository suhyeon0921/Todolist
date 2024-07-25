import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
  req: Request;
  res: Response;
  user?: any;
}

export const createContext = ({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Context => ({
  prisma,
  req,
  res,
  user: (req as any).user,
});
