import dotenv from "dotenv";
import { google } from "googleapis";

dotenv.config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI as string;

if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
  throw new Error(
    "Missing Google OAuth env vars. Set GOOGLE CLIENT ID, GOOGLE CLIENT SECRET and GOOGLE REDIRECT URI."
  );
}

const SCOPES = ["https://www.googleapis.com/auth/calendar", "https://www.googleapis.com/auth/calendar.events"];

export const getGoogleOAuthClient = () => {
  const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );
  return oAuth2Client;
};
