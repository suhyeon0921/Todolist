import express from 'express';
import 'express-async-errors';
import { createYoga, YogaInitialContext } from 'graphql-yoga';
import { schema } from './schema';
import { createContext } from './context';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { authenticateJWT } from './middleware/auth';

const app = express();

app.use(cookieParser());
app.use(bodyParser.json()); // body-parser 미들웨어 추가

interface CustomYogaInitialContext extends YogaInitialContext {
  req: express.Request;
  res: express.Response;
}

const yoga = createYoga<CustomYogaInitialContext>({
  schema,
  context: ({ req, res }) => createContext({ req, res }),
  graphqlEndpoint: '/graphql',
});

// 회원가입과 로그인을 제외한 모든 api에 인증 미들웨어 적용
app.use('/graphql', (req, res, next) => {
  if (
    req.body.query &&
    (req.body.query.includes('signup') || req.body.query.includes('login'))
  ) {
    return next();
  }
  authenticateJWT(req, res, next);
});

app.use('/graphql', yoga.requestListener);

app.listen(4000, () => {
  console.log('GraphQL server: http://localhost:4000/graphql');
});
