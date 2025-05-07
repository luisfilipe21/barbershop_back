import { Request, Response } from "express";
import { LoginService } from "../services/login.service";

export class LoginController {
  private loginServices = new LoginService();

  login = async (req: Request, res: Response) => {
    const token = await this.loginServices.login(req.body);
    res.json({ token });
  };
}
