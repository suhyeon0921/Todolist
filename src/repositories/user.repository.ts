import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

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

export const createUser = async (data: {
  email?: string;
  phoneNumber?: string;
  password: string;
  fullName: string;
  nickname: string;
}): Promise<User> => {
  return prisma.user.create({
    data: {
      email: data.email || undefined,
      phoneNumber: data.phoneNumber || undefined,
      password: data.password,
      fullName: data.fullName,
      nickname: data.nickname,
    },
  });
};
