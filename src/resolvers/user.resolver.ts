import { User } from '@prisma/client';
import {
  checkExistingUser,
  login,
  refreshAccessToken,
  signup,
  validateUserInput,
} from '../services/user.service';
import { JwtToken } from '../types/user';
import { Context } from '../context';
import { LoginInput, RefreshToken, SignupInput } from '../dto/user.dto';

const userResolvers = {
  Mutation: {
    /** 회원가입 */
    signup: async (_: any, args: SignupInput): Promise<User> => {
      validateUserInput(args.nickname, args.email, args.phoneNumber);
      await checkExistingUser(args.email, args.phoneNumber, args.nickname);
      return signup(args);
    },
    /** 로그인 */
    login: async (
      _: any,
      args: LoginInput,
      context: Context
    ): Promise<JwtToken> => {
      const { accessToken, refreshToken } = await login(
        args.password,
        args.email,
        args.phoneNumber
      );

      // 쿠키에 JWT 토큰 저장
      context.res.cookie('accessToken', accessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000, // 1 hour
      });

      context.res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return { accessToken, refreshToken };
    },
    /** 리프레시 토큰으로 새로운 액세스 토큰 발급 */
    refresh: async (
      _: any,
      args: RefreshToken,
      context: Context
    ): Promise<JwtToken> => {
      const { accessToken } = await refreshAccessToken(args.refreshToken);

      context.res.cookie('accessToken', accessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000, // 1 hour
      });

      return { accessToken };
    },
  },
};

export default userResolvers;
