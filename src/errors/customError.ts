import { GraphQLError, GraphQLErrorExtensions } from 'graphql';

interface CustomErrorExtensions extends GraphQLErrorExtensions {
  code: number;
}

export class CustomError extends GraphQLError {
  constructor(message: string, code: number) {
    super(message, {
      extensions: {
        code,
      } as CustomErrorExtensions,
    });
  }
}
