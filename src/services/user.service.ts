import { GraphQLError } from 'graphql';
import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import {
  createUser,
  findUserByEmailOrPhone,
  findUserByEmailOrPhoneOrNickname,
} from '../repositories/user.repository';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneNumberRegex = /^010\d{8}$/;

/** 회원가입 시 유저 입력값 검증 */
export const validateUserInput = (
  nickname: string,
  email?: string,
  phoneNumber?: string
): void => {
  if (!nickname) {
    throw new GraphQLError('닉네임이 제공되지 않았습니다.');
  }

  if (!email && !phoneNumber) {
    throw new GraphQLError('이메일 또는 휴대폰 번호가 제공되지 않았습니다.');
  }

  if (email && !emailRegex.test(email)) {
    throw new GraphQLError('유효한 이메일 형식이 아닙니다.');
  }

  if (phoneNumber && !phoneNumberRegex.test(phoneNumber)) {
    throw new GraphQLError('유효한 휴대폰 번호 형식이 아닙니다.');
  }
};

/** 이미 가입한 유저인지 확인 */
export const checkExistingUser = async (
  context: any,
  email?: string,
  phoneNumber?: string,
  nickname?: string
): Promise<void> => {
  const existingUser = await findUserByEmailOrPhoneOrNickname(
    email,
    phoneNumber,
    nickname
  );

  if (existingUser) {
    if (existingUser.email === email) {
      throw new GraphQLError('이미 가입한 이메일입니다.');
    }
    if (existingUser.phoneNumber === phoneNumber) {
      throw new GraphQLError('이미 가입한 휴대폰 번호입니다.');
    }
    if (existingUser.nickname === nickname) {
      throw new GraphQLError('이미 사용 중인 닉네임입니다.');
    }
  }
};

/** 유저 생성 */
export const signup = async (context: any, args: any): Promise<User> => {
  const hashedPassword = await bcrypt.hash(args.password, 10);
  return createUser({
    email: args.email,
    phoneNumber: args.phoneNumber,
    password: hashedPassword,
    fullName: args.fullName,
    nickname: args.nickname,
  });
};

/** 로그인 */
export const login = async (
  context: any,
  email?: string,
  phoneNumber?: string
): Promise<User> => {
  const user = await findUserByEmailOrPhone(email, phoneNumber);

  if (!user) {
    throw new GraphQLError('해당 유저를 찾을 수 없습니다.');
  }

  return user;
};
