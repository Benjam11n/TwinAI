import type { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 1. Create an auth client using a service account (example).
    //    If you prefer OAuth, you'd initialize with an OAuth2 client and tokens instead.
    const scopes = ["https://www.googleapis.com/auth/calendar.readonly"];

    const jwtClient = new google.auth.JWT(
      process.env.SERVICE_ACCOUNT_EMAIL,
      undefined,
      // private key must have escape sequences replaced if you're using multiline keys
      (process.env.SERVICE_ACCOUNT_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
      scopes
    );

    // 2. Create the calendar instance
    const calendar = google.calendar({ version: "v3", auth: jwtClient });

    // 3. List the events
    //    For a personal calendar, you'd share that calendar with the service account email
    const events = await calendar.events.list({
      calendarId: "primary", // or a specific calendar e.g. 'your-calendar-id@group.calendar.google.com'
      timeMin: new Date().toISOString(), // only events from now onward
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    // 4. Return the events
    res.status(200).json({ events: events.data.items || [] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch calendar events." });
  }
}