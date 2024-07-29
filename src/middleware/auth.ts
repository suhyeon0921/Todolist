import { GraphQLResolveInfo } from 'graphql';
import { Context } from '../context';
import jwt from 'jsonwebtoken';
import { UserPayload } from '../types/user';
import { CustomError } from '../errors/customError';

export const authMiddleware = async (
  resolve: any,
  parent: any,
  args: any,
  context: Context,
  info: GraphQLResolveInfo
) => {
  const token = context.req.cookies.accessToken;

  if (!token) {
    throw new CustomError('접근이 거부되었습니다. 토큰이 없습니다.', 401);
  }

  try {
    context.user = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as UserPayload;
  } catch (error) {
    throw new CustomError('유효하지 않은 토큰입니다.', 403);
  }

  return resolve(parent, args, context, info);
};
