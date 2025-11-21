import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class OAuthController {
  private authService = new AuthService();

  redirectToGoogle = async (req: Request, res: Response) => {
    const url = this.authService.getGoogleAuthUrl;
    res.json({ url });
  };

  googleCallback = async (req: Request, res: Response): Promise<void> => {
    try {
      const code = String(req.query.code) || "";
      if (!code) res.status(400).send("Missing code");

      await this.authService.handleGoogleCallback(code);

      res.send("Google Calendar connected successfully.");
    } catch (err) {
      console.error(err);
      res.status(500).send("Auth callback error");
    }
  };
}
