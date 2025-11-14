import express from 'express';
import dotenv from 'dotenv';
import { OAuthController } from './oAuth.controller';
import { prisma } from '../config/database';
import { CalendarController } from './calendar.controller';

dotenv.config();
const app = express();
app.use(express.json());

const calendarController = new CalendarController();
const oAuthController = new OAuthController();
// Auth routes
app.get('/auth/google', oAuthController.redirectToGoogle);
app.get('/auth/google/callback', oAuthController.googleCallback);

// Calendar routes (protected in real app: verify barber auth/session)
app.post('/calendar/event', calendarController.createEvent);
app.put('/calendar/event', calendarController.updateEvent);
app.delete('/calendar/event', calendarController.deleteEvent);
// dsa

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
