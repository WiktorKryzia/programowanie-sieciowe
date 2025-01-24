import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { z } from 'zod';
import { validateRequestBody } from 'zod-express-middleware';

import db from './database/db';
import auth from './middlewares/auth';
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
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(requestLogger);

app.get('/posts', (_req, res) => {
  try {
    const data = db.prepare('SELECT id, category, title, content as description, author_name as name, author_role as role, created_at as date FROM posts').all();

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
});

app.post(
  '/posts',
  auth,
  validateRequestBody(
    z.object({
      category: z.string().min(1).max(255),
      title: z.string().min(1).max(255),
      description: z.string().min(1),
      name: z.string().min(1).max(255),
      role: z.string().min(1).max(255),
    }),
  ),
  (req, res) => {
    try {
      const {
        category,
        title,
        description,
        name,
        role,
      } = req.body;
      const stmt = db.prepare('INSERT INTO posts (category, title, content, author_name, author_role) VALUES (?, ?, ?, ?, ?)');
      const info = stmt.run(category, title, description, name, role);

      return res.status(201).json({ id: info.lastInsertRowid });
    } catch (error) {
      console.error(error);
      return res.sendStatus(500);
    }
  },
);

app.use(errorHandlers);

export default app;
