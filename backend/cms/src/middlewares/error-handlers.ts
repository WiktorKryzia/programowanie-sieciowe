import type { ErrorRequestHandler, RequestHandler } from 'express';

const notFoundHandler: RequestHandler = (_req, res) => {
  res.sendStatus(404);
};

const internalErrorHandler: ErrorRequestHandler = (err, _req, _res, next) => {
  next(err);
};

export default [notFoundHandler, internalErrorHandler];
