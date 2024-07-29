import { User } from '@prisma/client';
import { Context } from '../context';
import { JwtToken } from '../types/user';
import { LoginInput, RefreshToken, SignupInput } from '../dto/user.dto';
import { userService } from '../services/user.service';

const userResolvers = {
  Mutation: {
    /** 회원가입 */
    signup: async (_: any, args: SignupInput): Promise<User> => {
      userService.validateUserInput(
        args.nickname,
        args.email,
        args.phoneNumber
      );
      await userService.checkExistingUser(
        args.email,
        args.phoneNumber,
        args.nickname
      );
      return userService.signup(args);
    },
    /** 로그인 */
    login: async (
      _: any,
      args: LoginInput,
      context: Context
    ): Promise<JwtToken> => {
      const { accessToken, refreshToken } = await userService.login(
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
      const { accessToken } = await userService.refreshAccessToken(
        args.refreshToken
      );

      context.res.cookie('accessToken', accessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000, // 1 hour
      });

      return { accessToken };
    },
  },
};

export default userResolvers;
