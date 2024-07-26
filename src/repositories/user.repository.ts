import { Prisma, User } from '@prisma/client';
import { prisma } from '../../prisma/prisma';

class UserRepository {
  private static instance: UserRepository;

  private constructor() {}

  public static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }
    return UserRepository.instance;
  }

  /** 다양한 조건으로 유저 찾기 */
  public async findUser(conditions: Partial<User>): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        OR: Object.entries(conditions).map(([key, value]) => ({
          [key]: value,
        })),
      },
    });
  }

  /** 유저 생성 */
  public async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  /** 리프레시 토큰 저장 */
  public async saveRefreshToken(userId: number, token: string): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { refreshToken: token },
    });
  }

  /** 리프레시 토큰으로 유저 찾기 */
  public async findUserWithRefreshToken(
    userId: number,
    token: string
  ): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        id: userId,
        refreshToken: token,
      },
    });
  }
}

export const userRepository = UserRepository.getInstance();
