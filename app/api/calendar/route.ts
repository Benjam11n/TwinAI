import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET() {
  try {
    // 1. Create an auth client using a service account.
    const scopes = ['https://www.googleapis.com/auth/calendar.readonly'];

    const jwtClient = new google.auth.JWT(
      process.env.SERVICE_ACCOUNT_EMAIL,
      undefined,
      (process.env.SERVICE_ACCOUNT_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      scopes,
    );

    // 2. Create the calendar instance
    const calendar = google.calendar({ version: 'v3', auth: jwtClient });

    // 3. List the events
    const events = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    // 4. Return the events
    return NextResponse.json({ events: events.data.items || [] });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch calendar events.' }, { status: 500 });
  }
}
