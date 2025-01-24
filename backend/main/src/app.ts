import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { z } from 'zod';
import { validateRequestParams, validateRequestQuery } from 'zod-express-middleware';

import { firebaseAdmin } from './config/firebase';
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

app.get(
  '/about',
  asyncHandler(async (_req, res) => {
    const db = firebaseAdmin.firestore();

    const snapshot = await db.collection('about').get();
    if (snapshot.empty) {
      return res.status(404).json({ message: 'Not found' });
    }

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json(data);
  }),
);

app.get(
  '/info',
  auth,
  asyncHandler(async (_req, res) => {
    const db = firebaseAdmin.firestore();
    const userId = res.locals.user.uid;

    const docSnapshot = await db.collection('info').doc(userId).get();
    if (!docSnapshot.exists) {
      return res.status(404).json({ message: 'Not found' });
    }

    return res.status(200).json({ id: docSnapshot.id, ...docSnapshot.data() });
  }),
);

app.put(
  '/info',
  auth,
  asyncHandler(async (req, res) => {
    const db = firebaseAdmin.firestore();
    const userId = res.locals.user.uid;

    await db.collection('info').doc(userId).set(req.body, { merge: true });

    return res.status(204).send();
  }),
);



app.get(
  '/products',
  asyncHandler(async (_req, res) => {
    const db = firebaseAdmin.firestore();

    const snapshot = await db.collection('products').get();
    if (snapshot.empty) {
      return res.status(404).json({ message: 'Not found' });
    }

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json(data);
  }),
);

app.get(
  '/products/:id',
  validateRequestParams(
    z.object({
      id: z.string().min(1),
    }),
  ),
  asyncHandler(async (req, res) => {
    const db = firebaseAdmin.firestore();

    const docSnapshot = await db.collection('products').doc(req.params.id).get();
    if (!docSnapshot.exists) {
      return res.status(404).json({ message: 'Not found' });
    }

    return res.status(200).json({ id: docSnapshot.id, ...docSnapshot.data() });
  }),
);

app.get(
  '/feed',
  auth,
  validateRequestQuery(z.object({ date: z.string().min(8), 'meal-type': z.string() })),
  asyncHandler(async (req, res) => {
    const db = firebaseAdmin.firestore();
    const userId = res.locals.user.uid;

    const docSnapshot = await db.collection(userId).doc(`dates/${req.query.date}/${req.query['meal-type']}`).get();
    if (!docSnapshot.exists) {
      return res.status(404).json({ message: 'Not found' });
    }

    return res.status(200).json({ id: docSnapshot.id, ...docSnapshot.data() });
  }),
);

app.put(
  '/feed',
  auth,
  validateRequestQuery(z.object({ date: z.string().min(8), 'meal-type': z.string().min(1) })),
  asyncHandler(async (req, res) => {
    const db = firebaseAdmin.firestore();
    const userId = res.locals.user.uid;

    await db.collection(userId).doc(`dates/${req.query.date}/${req.query['meal-type']}`).set(req.body, { merge: true });

    return res.status(204).send();
  }),
);

app.use(errorHandlers);

export default app;
