import { ErrorResponseDto } from '../dtos/common.dto.js';

export const errorHandler = (err, req, res, next) => {
  const status = err?.statusCode || 500;
  const message = err?.message || 'Internal Server Error';

  res.status(status).json(ErrorResponseDto({ message }));
};