import { makeExecutableSchema } from '@graphql-tools/schema';
import { gql } from 'graphql-tag';
import { GraphQLDateTime } from 'graphql-iso-date';
import userResolvers from './resolvers/user.resolver';
import taskResolvers from './resolvers/task.resolver';

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
    tasks(userId: ID!): [Task!]!
    taskCount(userId: ID!): TaskCount!
  }

  type Mutation {
    signup(
      email: String
      phoneNumber: String
      password: String!
      fullName: String!
      nickname: String!
    ): User
    login(email: String, phoneNumber: String, password: String!): User

    createTask(userId: ID!, content: String!): Task!
    updateTask(userId: ID!, id: ID!, content: String): Task!
    deleteTask(userId: ID!, id: ID!): Task!
    completeTask(userId: ID!, id: ID!): Task!
    uncompleteTask(userId: ID!, id: ID!): Task!
  }

  type TaskCount {
    completedTaskCount: Int!
    totalTaskCount: Int!
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

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
