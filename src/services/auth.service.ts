import { prisma } from "../config/database";
import { google } from "googleapis";
import { getOAuthClient } from "./oAuth2.middleware";

export class AuthService {
  getGoogleAuthUrl() {
    const oauth2Client = getOAuthClient();

    return oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/calendar.events",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
      ],
    });
  }

  async handleGoogleCallback(code: string) {
    const oauth2Client = getOAuthClient();

    const { tokens } = await oauth2Client.getToken(code);
    if (!tokens) throw new Error("Missing tokens from Google");

    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ auth: oauth2Client, version: "v2" });
    const { data } = await oauth2.userinfo.get();

    if (!data.id) throw new Error("Missing Google user ID");

    const barber = await prisma.barber.upsert({
      where: { googleId: data.id },
      update: {
        name: data.name ?? undefined,
        email: data.email ?? undefined,
        googleTokens: {
          access_tokens: tokens.access_token,
          refresh_tokens: tokens.refresh_token,
        },
      },
      create: {
        name: data.name ?? "Barber",
        email: data.email!,
        googleId: data.id,
        googleTokens: {
          access_tokens: tokens.access_token,
          refresh_tokens: tokens.refresh_token,
        },
      },
    });

    return barber;
  }
}
