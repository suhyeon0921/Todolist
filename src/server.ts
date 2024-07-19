import { createYoga } from 'graphql-yoga';
import { schema } from './schema';
import { context } from './context';
import { createServer } from 'http';

const yoga = createYoga({ schema, context });

const server = createServer(yoga);

server.listen(4000, () => {
  console.log('GraphQL server: http://localhost:4000');
});
