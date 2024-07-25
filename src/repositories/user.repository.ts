import { Prisma, PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

/** 이메일 또는 휴대폰 번호로 유저 찾기 */
export const findUserByEmailOrPhone = async (
  email?: string,
  phoneNumber?: string
): Promise<User | null> => {
  return prisma.user.findFirst({
    where: {
      OR: [{ email }, { phoneNumber }],
    },
  });
};

/** 이메일 또는 휴대폰 번호 또는 닉네임으로 유저 찾기 */
export const findUserByEmailOrPhoneOrNickname = async (
  email?: string,
  phoneNumber?: string,
  nickname?: string
): Promise<User | null> => {
  return prisma.user.findFirst({
    where: {
      OR: [{ email }, { phoneNumber }, { nickname }],
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
