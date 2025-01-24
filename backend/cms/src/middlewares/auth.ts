import type { RequestHandler } from 'express';
import type { ParamsDictionary, Query } from 'express-serve-static-core';
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

  const response = await fetch('http://localhost:8080/me', {
    headers: {
      Cookie: `id_token=${token}`,
    },
  });
  if (!response.ok) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  res.locals.user = (await response.json()) as any;
  return next();
});

export default auth;
