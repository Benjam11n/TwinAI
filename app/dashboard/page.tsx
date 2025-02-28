"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Example of using react-big-calendar:
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Convert Google events to React Big Calendar format
function transformEvents(googleEvents) {
  return googleEvents.map((evt) => {
    return {
      id: evt.id,
      title: evt.summary || "(No Title)",
      start: evt.start.dateTime ? new Date(evt.start.dateTime) : new Date(evt.start.date),
      end: evt.end.dateTime ? new Date(evt.end.dateTime) : new Date(evt.end.date),
    };
  });
}

export default function CalendarPage() {
  const [searchQuery, setSearchQuery] = useState("");
  // State to store the fetched events
  const [events, setEvents] = useState([]);

  // For react-big-calendar:
  const localizer = momentLocalizer(moment);

  useEffect(() => {
    // Example fetch from an API route (pages/api/calendar)
    // or direct to Google if you have credentials on the client.
    async function fetchEvents() {
      try {
        const res = await fetch("/api/calendar"); // Adjust if needed
        if (!res.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await res.json();
        const transformed = transformEvents(data.events || []);
        setEvents(transformed);
      } catch (error) {
        console.error("Error fetching calendar events:", error);
      }
    }

    fetchEvents();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-14 items-center border-b bg-white px-4 dark:bg-gray-800 lg:px-6">
          <div className="ml-auto flex items-center gap-2">
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium">
              <span className="sr-only">Toggle theme</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-6"
              >
                <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                <path d="M12 8a2.83 2.83 0 0 0 1.24-.24" />
                <path d="M12 8a2.83 2.83 0 0 0-1.24-.24" />
                <path d="M12 16a2.83 2.83 0 0 1 1.24.24" />
                <path d="M12 16a2.83 2.83 0 0 1-1.24.24" />
                <path d="m15 12 .93-.93" />
                <path d="M8.07 12.93 9 12" />
                <path d="m15 12-.93.93" />
                <path d="M8.07 11.07 9 12" />
                <path d="M12 9v.01" />
                <path d="M12 15v.01" />
                <path d="M12 12v.01" />
                <path d="M12 1v2" />
                <path d="M12 21v2" />
                <path d="M1 12h2" />
                <path d="M21 12h2" />
              </svg>
            </button>
            <div className="rounded-full bg-gray-100 p-1 dark:bg-gray-800">
              <img
                src="/api/placeholder/24/24"
                width="24"
                height="24"
                className="rounded-full"
                alt="User avatar"
              />
            </div>
          </div>
        </header>

        {/* Calendar Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold tracking-tight">Google Calendar</h1>
              <div className="flex items-center gap-2">
                <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
                  Sync Calendar
                </button>
              </div>
            </div>

            {/* Calendar Card */}
            <Card>
              <CardHeader>
                <CardTitle>Your Google Calendar</CardTitle>
                <CardDescription>
                  Below is a React Big Calendar view and an upcoming events list.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Full Calendar View */}
                <div className="w-full mb-8">
                  <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                  />
                </div>
                {/* Upcoming Events List */}
                <div className="text-sm text-muted-foreground space-y-2">
                  <h2 className="font-medium">Upcoming Events</h2>
                  {events.length === 0 ? (
                    <p>No upcoming events found.</p>
                  ) : (
                    <ul className="list-disc ml-6 space-y-1">
                      {events.map((evt) => (
                        <li key={evt.id} className="">
                          <strong>{evt.title}</strong> <br />
                          <span className="text-xs text-gray-500">
                            {evt.start.toLocaleString()} - {evt.end.toLocaleString()}
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