import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { z } from 'zod';
import { validateRequestBody } from 'zod-express-middleware';

import { firebaseAuth } from './config/firebase';
import auth from './middlewares/auth';
import errorHandlers from './middlewares/error-handlers';
import requestLogger from './middlewares/request-logger';
import asyncHandler from './utils/async-handler';

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
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(requestLogger);

app.post(
  '/register',
  validateRequestBody(z.object({ email: z.string().email(), password: z.string() })),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    try {
      const userCredential = await firebaseAuth.createUserWithEmailAndPassword(firebaseAuth.getAuth(), email, password);
      const idToken = await userCredential.user.getIdToken();

      res.cookie('id_token', idToken, {
        httpOnly: true,
      });
      res.status(201).json({ uid: userCredential.user.uid });
    } catch (err: any) {
      if ('code' in err) {
        res.status(400).json({ code: err.code, message: err.message });
      } else {
        throw err;
      }
    }
  }),
);

app.post(
  '/login',
  validateRequestBody(z.object({ email: z.string().email(), password: z.string() })),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    try {
      const userCredential = await firebaseAuth.signInWithEmailAndPassword(firebaseAuth.getAuth(), email, password);
      const idToken = await userCredential.user.getIdToken();

      res.cookie('id_token', idToken, {
        httpOnly: true,
      });
      res.status(204).send();
    } catch (err: any) {
      if ('code' in err) {
        res.status(400).json({ code: err.code, message: err.message });
      } else {
        throw err;
      }
    }
  }),
);

app.post(
  '/logout',
  auth,
  asyncHandler(async (_req, res) => {
    res.clearCookie('id_token');
    return res.status(204).send();
  }),
);

app.get('/me', auth, (_req, res) => {
  return res.status(200).json(res.locals.user);
});

app.use(errorHandlers);

export default app;
