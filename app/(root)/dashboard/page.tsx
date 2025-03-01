'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

interface GoogleEvent {
  id: string;
  summary?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
}

interface TransformedEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

function transformEvents(googleEvents: GoogleEvent[]): TransformedEvent[] {
  return googleEvents.map((evt) => {
    return {
      id: evt.id,
      title: evt.summary || '(No Title)',
      start: evt.start.dateTime
        ? new Date(evt.start.dateTime)
        : new Date(evt.start.date || ''),
      end: evt.end.dateTime
        ? new Date(evt.end.dateTime)
        : new Date(evt.end.date || ''),
    };
  });
}

export default function CalendarPage() {
  const [events, setEvents] = useState<TransformedEvent[]>([]);

  const localizer = momentLocalizer(moment);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch('/api/calendar');
        if (!res.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await res.json();
        const transformed = transformEvents(data.events || []);
        setEvents(transformed);
      } catch (error) {
        console.error('Error fetching calendar events:', error);
      }
    }

    fetchEvents();
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Calendar Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold tracking-tight">
                Google Calendar
              </h1>
              <div className="flex items-center gap-2">
                <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
                  Sync Calendar
                </button>
              </div>
            </div>

            {/* Calendar Card */}
            <Card>
              <CardHeader></CardHeader>
              <CardContent>
                {/* Full Calendar View */}
                <div className="mb-8 w-full">
                  <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                  />
                </div>
                {/* Upcoming Events List */}
                <div className="space-y-2 text-sm text-muted-foreground">
                  <h2 className="font-medium">Upcoming Events</h2>
                  {events.length === 0 ? (
                    <p>No upcoming events found.</p>
                  ) : (
                    <ul className="ml-6 list-disc space-y-1">
                      {events.map((evt) => (
                        <li key={evt.id} className="">
                          <strong>{evt.title}</strong> <br />
                          <span className="text-xs">
                            {evt.start.toLocaleString()} -{' '}
                            {evt.end.toLocaleString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
