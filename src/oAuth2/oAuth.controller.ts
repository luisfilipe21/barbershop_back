import { Request, Response } from "express";
import { createBarberOAuthClient } from "./googleAuth";
import { createOAuthClient, getAuthUrl } from "./oAuth2.middleware";
import { prisma } from "../config/database";
import { google } from "googleapis";

export class OAuthController {
  redirectToGoogle = async (req: Request, res: Response) => {
    const url = getAuthUrl();
    return res.redirect(url);
  };

  googleCallback = async (req: Request, res: Response) => {
    try {
      const code = req.query.code as string;
      if (!code) return res.status(400).send("Missing code");

      const createBarberOAuthClient = createOAuthClient();
      const { tokens } = await createBarberOAuthClient.getToken(code);

      if (!tokens) return res.status(500).send("Missing tokens from Google");
      createBarberOAuthClient.setCredentials(tokens);

      // Use the token to get Google profile to identify the user
      const oauth2 = google.oauth2({ auth: createBarberOAuthClient, version: "v2" });
      const { data } = await oauth2.userinfo.get();

      // Upsert barber (adjust fields you want to save)
      const barber = await prisma.barber.upser({
        where: { googleId: data.id! },
        update: {
          name: data.name ?? undefined,
          email: data.email ?? undefined,
          googleTokens: tokens,
        },
        create: {
          name: data.name ?? "Barber",
          email: data.email,
          googleId: data.id!,
          googleTokens: tokens,
        },
      });

      res.send("Google Calendar connected successfully.");
    } catch (err) {
      console.error(err);
      res.status(500).send("Auth callback error");
    }
  };
}
