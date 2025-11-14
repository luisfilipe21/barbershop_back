import { Request, Response } from "express";
import { LoginService } from "../services/login.service";
import { verifyToken } from "../config/jwt.config";
import { AppError } from "../errors/AppError";
export class LoginController {
  private loginServices = new LoginService();

  login = async (req: Request, res: Response) => {
    const token = await this.loginServices.login(req.body);
    res.json({ token });
  };

  autoLogin = async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError(401, "Unauthorized");
    }

    const [, token] = authHeader!.split(" ");
    const decoded = verifyToken(token);

    if (!decoded) {
      throw new AppError(401, "Expired Token");
    }
    const user = await this.loginServices.getUser(Number(decoded.sub));

    res.status(200).json(user);
  };
}
