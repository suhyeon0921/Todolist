import { makeExecutableSchema } from '@graphql-tools/schema';
import { gql } from 'graphql-tag';
import { GraphQLDateTime } from 'graphql-iso-date';
import { applyMiddleware } from 'graphql-middleware';
import userResolvers from './resolvers/user.resolver';
import taskResolvers from './resolvers/task.resolver';
import { authMiddleware } from './middleware/auth';

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

  type TaskCount {
    completedTaskCount: Int!
    totalTaskCount: Int!
  }

  type AuthPayload {
    accessToken: String!
    refreshToken: String!
  }

  type Query {
    tasks: [Task!]!
    taskCount: TaskCount!
  }

  type Mutation {
    signup(
      email: String
      phoneNumber: String
      password: String!
      fullName: String!
      nickname: String!
    ): User
    login(email: String, phoneNumber: String, password: String!): AuthPayload!
    refresh(refreshToken: String!): AuthPayload!

    createTask(content: String!): Task!
    updateTask(id: ID!, content: String): Task!
    deleteTask(id: ID!): Task!
    completeTask(id: ID!): Task!
    uncompleteTask(id: ID!): Task!
  }
`;

const resolvers = {
  DateTime: GraphQLDateTime,
  Query: {
    ...taskResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...taskResolvers.Mutation,
  },
};

// Task 리졸버에만 인증 미들웨어를 적용
const taskMiddleware = {
  Query: {
    tasks: authMiddleware,
    taskCount: authMiddleware,
  },
  Mutation: {
    createTask: authMiddleware,
    updateTask: authMiddleware,
    deleteTask: authMiddleware,
    completeTask: authMiddleware,
    uncompleteTask: authMiddleware,
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const schemaWithMiddleware = applyMiddleware(schema, taskMiddleware);

export { schemaWithMiddleware as schema };
