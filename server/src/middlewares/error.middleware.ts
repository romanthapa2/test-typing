import { ErrorRequestHandler } from 'express';
import {ApiError} from '../utils/apiError.utils';

const error: ErrorRequestHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  if (err instanceof ApiError) {
    res.status(err.statusCode).json(err);
  } else {
    res.status(500).json({ message: 'Something went wrong!' });
  }
};

export default error;