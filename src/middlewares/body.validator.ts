import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: error.message });
      }
      console.log(error);
      return next();
    }
  };
};

