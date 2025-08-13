import { NextFunction, Request, Response } from "express";
import { AppError } from "./AppError";
import { ZodError } from "zod";
import { JsonWebTokenError } from "jsonwebtoken";

export const handleGlobalErrors = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
    
    if(error instanceof AppError){
        res.status(error.statusCode).json(error.message);
    }
    if(error instanceof ZodError){
        res.status(400).json(error.message);
    }
    
    if (error instanceof JsonWebTokenError){
        res.status(401).json({ error: "Unauthorized" });
    }

    res.status(500).json({ error: "Internal Server Error" });
};
