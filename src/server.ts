import express from 'express';
import 'express-async-errors';
import { createYoga, YogaInitialContext } from 'graphql-yoga';
import { schema } from './schema';
import { context as baseContext } from './context';

const app = express();

const yoga = createYoga<
  YogaInitialContext & { req: express.Request; res: express.Response }
>({
  schema,
  context: ({ req, res }) => ({
    ...baseContext,
    req,
    res,
  }),
  graphqlEndpoint: '/graphql',
});

app.use('/graphql', yoga.requestListener);

app.listen(4000, () => {
  console.log('GraphQL server: http://localhost:4000/graphql');
});
