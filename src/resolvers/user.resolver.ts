import {
  checkExistingUser,
  login,
  signup,
  validateUserInput,
} from '../services/user.service';
import { User } from '@prisma/client';

const userResolvers = {
  Mutation: {
    /** 회원가입 */
    signup: async (_parent: any, args: any, context: any): Promise<User> => {
      validateUserInput(args.nickname, args.email, args.phoneNumber);
      await checkExistingUser(
        context,
        args.email,
        args.phoneNumber,
        args.nickname
      );
      return signup(context, args);
    },
    /** 로그인 */
    login: async (_parent: any, args: any, context: any) => {
      return login(context, args.email, args.phoneNumber);
    },
  },
};

export default userResolvers;
