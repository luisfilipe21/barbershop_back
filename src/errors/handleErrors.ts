import { NextFunction, Request, Response } from "express";
import { AppError } from "./AppError";
import { ZodError } from "zod";

export const handleGlobalErrors = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
    console.log(error)
    
    if(error instanceof AppError){
        res.status(error.statusCode).json(error.message);
    }
    if(error instanceof ZodError){
        res.status(400).json(error.message);
    }
    

    res.status(500).json({ error: "Internal Server Error" });
};
