import { Request, Response } from 'express';

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'RESOURCE_NOT_FOUND',
      message: `Route ${req.method} ${req.url} not found`,
      path: req.url,
      method: req.method
    },
    timestamp: new Date().toISOString()
  });
};
