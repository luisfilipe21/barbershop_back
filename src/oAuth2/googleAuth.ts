import { google } from "googleapis";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const credentials = JSON.parse(fs.readFileSync("credentials.json", "utf-8"));

export const createBarberOAuthClient = () => {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:5000/oauth2callback"
  );
  return oAuth2Client;
};
