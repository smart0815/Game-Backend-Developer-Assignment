import express, { type Express, type NextFunction, type Response, type Request } from 'express';
import morgan from 'morgan';
import router from './routes/index.js';
import { HttpError } from './classes/HttpError.js';
import { type ErrorResponse } from './types/index.js';

export const app: Express = express();

app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use('/', router);

// 404 handler - path not found
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new HttpError('Path not found', 404));
});

// Global error handler
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Received error:', err);
  
  // Handle known HttpError
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json(err.toResponse());
  }
  
  // Handle standard Error objects
  if (err instanceof Error) {
    const errorResponse: ErrorResponse = {
      error: err.message || 'Internal server error',
      statusCode: 500
    };
    return res.status(500).json(errorResponse);
  } 
  
  // Handle string errors
  if (typeof err === 'string') {
    const errorResponse: ErrorResponse = {
      error: err,
      statusCode: 500
    };
    return res.status(500).json(errorResponse);
  }
  
  // Handle unknown error types
  const errorResponse: ErrorResponse = {
    error: 'Internal server error',
    statusCode: 500
  };
  return res.status(500).json(errorResponse);
});
