import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).send('접근이 거부되었습니다.');
  }

  try {
    (req as any).user = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as any;

    next();
  } catch (error) {
    return res.status(403).send('유효하지 않은 토큰입니다.');
  }
};
