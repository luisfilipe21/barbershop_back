import { Request, Response } from "express";
import { LoginService } from "../services/login.service";
import jwt from "jsonwebtoken";
import { verifyToken } from "../config/jwt.config";
export class LoginController {
  private loginServices = new LoginService();

  login = async (req: Request, res: Response) => {
    const token = await this.loginServices.login(req.body);
    
    res.json({ token });

  };

  autoLogin = async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;

    if(!authHeader){
      res.status(401).json({ error: "Unauthorized" });
    }

     const [, token] = authHeader!.split(' ');

    const decoded = verifyToken(token);

    if(!decoded){
      res.status(401).json({ error: "Unauthorized" });
    }
    res.status(200).json(decoded);
  }
}
