import { Prisma, PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

/** 다양한 조건으로 유저 찾기 */
export const findUser = async (
  conditions: Partial<User>
): Promise<User | null> => {
  return prisma.user.findFirst({
    where: {
      OR: Object.entries(conditions).map(([key, value]) => ({ [key]: value })),
    },
  });
};

/** 유저 생성 */
export const createUser = async (
  data: Prisma.UserCreateInput
): Promise<User> => {
  return prisma.user.create({
    data,
  });
};

/** 리프레시 토큰 저장 */
export const saveRefreshToken = async (
  userId: number,
  token: string
): Promise<User> => {
  return prisma.user.update({
    where: { id: userId },
    data: { refreshToken: token },
  });
};

/** 리프레시 토큰으로 유저 찾기 */
export const findUserWithRefreshToken = async (
  userId: number,
  token: string
): Promise<User | null> => {
  return prisma.user.findFirst({
    where: {
      id: userId,
      refreshToken: token,
    },
  });
};
