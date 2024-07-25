import express from 'express';
import 'express-async-errors';
import { createYoga } from 'graphql-yoga';
import { schema } from './schema';
import { context } from './context';

const app = express();

const yoga = createYoga({
  schema,
  context,
  graphqlEndpoint: '/graphql',
});

app.use('/graphql', yoga);

app.listen(4000, () => {
  console.log('GraphQL server: http://localhost:4000/graphql');
});
