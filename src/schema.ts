import { makeExecutableSchema } from '@graphql-tools/schema';
import { gql } from 'graphql-tag';
import { GraphQLError } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';

const typeDefs = gql`
  scalar DateTime

  type User {
    id: ID!
    email: String
    phoneNumber: String
    password: String!
    fullName: String!
    nickname: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    deletedAt: DateTime
  }

  type Task {
    id: ID!
    content: String!
    isDone: Boolean!
    user: User
    createdAt: DateTime!
    updatedAt: DateTime!
    deletedAt: DateTime
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    tasks(userId: ID!): [Task!]!
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

    createTask(userId: ID!, content: String!): Task!
    updateTask(userId: ID!, id: ID!, content: String): Task!
  }
`;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneNumberRegex = /^010\d{8}$/;

const resolvers = {
  DateTime: GraphQLDateTime,

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
    /** 태스크 전체 조회 */
    tasks: async (_parent: any, args: any, context: any) => {
      return context.prisma.task.findMany({
        where: { userId: Number(args.userId), deletedAt: null },
        include: { user: true },
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

      return context.prisma.user.create({
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
        throw new GraphQLError('해당 유저를 찾을 수 없습니다.');
      }

      return {
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        deletedAt: user.deletedAt ? user.deletedAt.toISOString() : null,
      };
    },
    createTask: async (_parent: any, args: any, context: any) => {
      const task = await context.prisma.task.create({
        data: {
          content: args.content,
          userId: Number(args.userId),
        },
      });

      return {
        id: task.id,
        content: task.content,
        isDone: task.isDone,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
        deletedAt: task.deletedAt ? task.deletedAt.toISOString() : null,
        user: task.user,
      };
    },
    updateTask: async (_parent: any, args: any, context: any) => {
      const { userId, id, content } = args;

      const task = await context.prisma.task.findFirst({
        where: { id: Number(id), userId: Number(userId), deletedAt: null },
      });

      if (!task) {
        return new GraphQLError(
          '태스크를 찾을 수 없거나 작성한 유저가 아닙니다.'
        );
      }

      const updatedTask = await context.prisma.task.update({
        where: { id: Number(id) },
        data: {
          content: content,
        },
        include: { user: true },
      });

      return {
        ...updatedTask,
        createdAt: updatedTask.createdAt.toISOString(),
        updatedAt: updatedTask.updatedAt.toISOString(),
        deletedAt: updatedTask.deletedAt
          ? updatedTask.deletedAt.toISOString()
          : null,
      };
    },
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
