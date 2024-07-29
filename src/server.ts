import express from 'express';
import 'express-async-errors';
import { createYoga, YogaInitialContext } from 'graphql-yoga';
import { schema } from './schema';
import { createContext } from './context';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());

interface CustomYogaInitialContext extends YogaInitialContext {
  req: express.Request;
  res: express.Response;
}

const yoga = createYoga<CustomYogaInitialContext>({
  schema,
  context: ({ req, res }) => createContext({ req, res }),
  graphqlEndpoint: '/graphql',
});

app.use('/graphql', yoga.requestListener);

app.listen(4000, () => {
  console.log('GraphQL server: http://localhost:4000/graphql');
});
