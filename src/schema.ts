import { makeExecutableSchema } from '@graphql-tools/schema';
import { gql } from 'graphql-tag';
import { GraphQLError } from 'graphql';

const typeDefs = gql`
  type User {
    id: ID!
    email: String
    phoneNumber: String
    password: String!
    fullName: String!
    nickname: String!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    createUser(
      email: String
      phoneNumber: String
      password: String!
      fullName: String!
      nickname: String!
    ): User!
    loginUser(email: String, phoneNumber: String, password: String!): User
  }
`;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneNumberRegex = /^010\d{8}$/;

const resolvers = {
  Query: {
    // FIXME: any 타입 수정
    users: async (_parent: any, _args: any, context: any) => {
      return context.prisma.user.findMany();
    },
    user: async (_parent: any, args: any, context: any) => {
      return context.prisma.user.findUnique({
        where: { id: Number(args.id) },
      });
    },
  },

  Mutation: {
    createUser: async (_parent: any, args: any, context: any) => {
      if (!args.email && !args.phoneNumber) {
        throw new GraphQLError(
          '이메일 또는 휴대폰 번호가 제공되지 않았습니다.'
        );
      }

      if (args.email && !emailRegex.test(args.email)) {
        throw new GraphQLError('유효한 이메일 형식이 아닙니다.');
      }

      if (args.phoneNumber && !phoneNumberRegex.test(args.phoneNumber)) {
        throw new GraphQLError('유효한 휴대폰 번호 형식이 아닙니다.');
      }

      const existingUser = await context.prisma.user.findFirst({
        where: {
          OR: [
            { email: args.email },
            { phoneNumber: args.phoneNumber },
            { nickname: args.nickname },
          ],
        },
      });

      if (existingUser) {
        if (existingUser.email === args.email) {
          throw new GraphQLError('이미 가입한 이메일입니다.');
        }
        if (existingUser.phone_number === args.phoneNumber) {
          throw new GraphQLError('이미 가입한 휴대폰 번호입니다.');
        }
        if (existingUser.nickname === args.nickname) {
          throw new GraphQLError('이미 사용 중인 닉네임입니다.');
        }
      }

      return await context.prisma.user.create({
        data: {
          email: args.email || undefined,
          phoneNumber: args.phoneNumber || undefined,
          password: args.password,
          fullName: args.fullName,
          nickname: args.nickname,
        },
      });
    },
    loginUser: async (_parent: any, args: any, context: any) => {
      const user = await context.prisma.user.findFirst({
        where: {
          OR: [{ email: args.email }, { phoneNumber: args.phoneNumber }],
        },
      });

      if (!user) {
        throw new Error('해당 유저를 찾을 수 없습니다.');
      }

      return user;
    },
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
