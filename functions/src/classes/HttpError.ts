import { type ErrorResponse } from '../types';

export class HttpError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(message: string, statusCode: number = 500, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = 'HttpError';
  }

  /**
   * Convert to JSON response format
   */
  toResponse(): ErrorResponse {
    const response: ErrorResponse = {
      error: this.message,
      statusCode: this.statusCode,
    };
    
    if (this.details) {
      response.details = this.details;
    }
    
    return response;
  }
}
