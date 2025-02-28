// components/dashboard/calendar-view.tsx
'use client';
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, Users, Map } from 'lucide-react';

export function CalendarView() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Sample events data
  const events = [
    {
      id: 1,
      title: 'Therapy Session',
      date: new Date(2025, 1, 28),
      time: '10:00 AM',
      location: 'Online',
      type: 'therapy',
    },
    {
      id: 2,
      title: 'Mindfulness Workshop',
      date: new Date(2025, 1, 28),
      time: '2:00 PM',
      location: 'Community Center',
      type: 'workshop',
    },
    {
      id: 3,
      title: 'Group Support Meeting',
      date: new Date(2025, 2, 3),
      time: '6:00 PM',
      location: 'Wellness Center',
      type: 'group',
    },
    {
      id: 4,
      title: 'Wellness Check-in',
      date: new Date(2025, 2, 5),
      time: '11:30 AM',
      location: 'Online',
      type: 'checkup',
    },
    {
      id: 5,
      title: 'Digital Twin Review',
      date: new Date(2025, 2, 7),
      time: '3:00 PM',
      location: "Dr. Smith's Office",
      type: 'review',
    },
  ];

  // Find events for the selected date
  const selectedDateEvents = events.filter(
    (event) => date && event.date.toDateString() === date.toDateString()
  );

  // Function to check if a date has events
  const hasEvents = (day: Date | null | undefined) => {
    if (!day) return false;
    return events.some(
      (event) => event.date.toDateString() === day.toDateString()
    );
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          components={{
            Day: ({ day, ...props }) => {
              // Check if day is null or undefined
              if (!day) {
                return <div {...props} />;
              }
              return (
                <div
                  {...props}
                  className={`${props.className} relative ${
                    hasEvents(day) ? 'font-bold' : ''
                  }`}
                >
                  {day.getDate()}
                  {hasEvents(day) && (
                    <div className="absolute bottom-0 left-1/2 size-1 -translate-x-1/2 rounded-full bg-primary" />
                  )}
                </div>
              );
            },
          }}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {date
            ? date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : 'Select a date'}
        </h3>

        {selectedDateEvents.length > 0 ? (
          <div className="space-y-3">
            {selectedDateEvents.map((event) => (
              <Card key={event.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{event.title}</h4>
                      <div className="mt-1 flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 size-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-muted-foreground">
                        <Map className="mr-1 size-4" />
                        <span>{event.location}</span>
                      </div>
                      {event.type === 'group' && (
                        <div className="mt-1 flex items-center text-sm text-muted-foreground">
                          <Users className="mr-1 size-4" />
                          <span>Group Session</span>
                        </div>
                      )}
                    </div>
                    <Badge
                      variant={
                        event.type === 'therapy'
                          ? 'default'
                          : event.type === 'workshop'
                            ? 'secondary'
                            : event.type === 'group'
                              ? 'outline'
                              : event.type === 'review'
                                ? 'destructive'
                                : 'default'
                      }
                    >
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center rounded-md border bg-muted/50">
            <p className="text-muted-foreground">
              No events scheduled for this day
            </p>
          </div>
        )}

        <Separator />

        <div className="pt-2">
          <h3 className="mb-2 font-medium">Upcoming Events</h3>
          <div className="space-y-2">
            {events
              .filter((event) => new Date(event.date) >= new Date())
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .slice(0, 3)
              .map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between rounded-md p-2 hover:bg-muted"
                >
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                      • {event.time}
                    </p>
                  </div>
                  <Badge variant="outline">{event.type}</Badge>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
