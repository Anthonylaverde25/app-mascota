'use client';

import * as React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCalendarEvents, type CalendarEvent } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function CalendarPage() {
  const allEvents = React.useMemo(() => getCalendarEvents(), []);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());

  const eventsOnSelectedDate = React.useMemo(() => {
    if (!selectedDate) return [];
    return allEvents.filter(
      (event) =>
        event.date.getDate() === selectedDate.getDate() &&
        event.date.getMonth() === selectedDate.getMonth() &&
        event.date.getFullYear() === selectedDate.getFullYear()
    );
  }, [selectedDate, allEvents]);

  const eventDays = React.useMemo(() => allEvents.map((event) => event.date), [allEvents]);

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-headline font-bold mb-8">Health Calendar</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-2">
            <CardContent className="p-2 sm:p-4 flex justify-center">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    modifiers={{ event: eventDays }}
                    modifiersClassNames={{
                        event: 'bg-accent/30 text-accent-foreground rounded-full',
                    }}
                    className="p-0"
                />
            </CardContent>
        </Card>
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">
                Events for {selectedDate ? selectedDate.toLocaleDateString() : '...'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {eventsOnSelectedDate.length > 0 ? (
                eventsOnSelectedDate.map((event, index) => (
                  <Link href={`/pets/${event.petId}`} key={index}>
                    <div className="p-4 rounded-lg border hover:bg-secondary/50 transition-colors cursor-pointer">
                        <div className="flex justify-between items-center mb-2">
                            <p className="font-semibold">{event.petName}</p>
                            <Badge variant="secondary" className="capitalize">{event.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No events for this day.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
