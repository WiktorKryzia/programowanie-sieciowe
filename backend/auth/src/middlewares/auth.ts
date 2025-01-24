import type { RequestHandler } from 'express';
import type { ParamsDictionary, Query } from 'express-serve-static-core';
import firebaseAdmin from 'firebase-admin';
import type { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

import asyncHandler from '@/utils/async-handler';

const auth: RequestHandler<
  ParamsDictionary,
  any,
  any,
  Query,
  {
    user: DecodedIdToken;
  }
> = asyncHandler(async (req, res, next) => {
  const token = req.cookies.id_token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    res.locals.user = decodedToken;
    return next();
  } catch {
    res.clearCookie('id_token');
    return res.status(401).json({ message: 'Unauthorized' });
  }
});

export default auth;
