import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../config/jwt.config";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (!authorization) throw new Error("Invalid token 1");

  const [type, token] = authorization.split(" ");
  if (type !== "Bearer") throw new Error("Invalid token 2");
  
  if(!token) throw new Error("Invalid token 3");

  const accountData = verifyToken(token);
  res.locals.decodedAccountData = accountData;
  next();
};
