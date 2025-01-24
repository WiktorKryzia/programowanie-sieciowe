import type { RequestHandler } from 'express';
import type { ParamsDictionary, Query } from 'express-serve-static-core';

export default <
    TParams = ParamsDictionary,
    TBody = any,
    TQuery = Query,
    TLocals extends Record<string, any> = Record<string, any>,
  >(
    fn: RequestHandler<TParams, any, TBody, TQuery, TLocals>,
  ): RequestHandler<TParams, any, TBody, TQuery, TLocals> =>
  (req, res, next) => {
    // eslint-disable-next-line promise/no-callback-in-promise
    Promise.resolve(fn(req, res, next)).catch(next);
  };
