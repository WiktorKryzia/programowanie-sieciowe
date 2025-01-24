import cors from 'cors';
import express from 'express';

import errorHandlers from './middlewares/error-handlers';
import requestLogger from './middlewares/request-logger';

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || /^http:\/\/localhost:\d+$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }),
);
app.use(requestLogger);

app.use(express.static('public'));

app.use(errorHandlers);

export default app;
