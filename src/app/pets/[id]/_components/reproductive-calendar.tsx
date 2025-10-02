'use client';

import * as React from 'react';
import { Calendar } from '@/components/ui/calendar';
import type { ReproductiveEvent } from '@/lib/data';
import { es } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Circle } from 'lucide-react';

type ReproductiveCalendarProps = {
  events: ReproductiveEvent[];
};

const eventColors: Record<ReproductiveEvent['tipoEvento'], string> = {
  Celo: 'bg-pink-500',
  Parto: 'bg-blue-500',
  Monta: 'bg-green-500',
};

const eventLabels: Record<ReproductiveEvent['tipoEvento'], string> = {
    Celo: 'Celo',
    Parto: 'Parto',
    Monta: 'Monta',
};

export function ReproductiveCalendar({ events }: ReproductiveCalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date());

  const eventsByDate = React.useMemo(() => {
    const map = new Map<string, ReproductiveEvent[]>();
    events.forEach((event) => {
      const dateKey = event.fecha.toISOString().split('T')[0];
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)?.push(event);
    });
    return map;
  }, [events]);

  const EventDay = (props: { date: Date }) => {
    const dateKey = props.date.toISOString().split('T')[0];
    const dayEvents = eventsByDate.get(dateKey);

    if (!dayEvents) return null;

    return (
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex space-x-0.5">
        {dayEvents.slice(0, 3).map((event) => (
          <div key={event.id} className={cn('h-1.5 w-1.5 rounded-full', eventColors[event.tipoEvento])} />
        ))}
      </div>
    );
  };
  
  return (
    <div className="flex flex-col items-center">
       <Calendar
        mode="single"
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        locale={es}
        className="p-0"
        components={{
            Day: ({ date }) => {
              const dateKey = date.toISOString().split('T')[0];
              const dayEvents = eventsByDate.get(dateKey);
              return (
                <div className="relative">
                  <DayPicker.Day date={date} />
                  {dayEvents && <EventDay date={date} />}
                </div>
              );
            },
          }}
      />
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
        {Object.entries(eventLabels).map(([type, label]) => (
            <div key={type} className="flex items-center gap-x-2">
                <div className={cn('w-3 h-3 rounded-full', eventColors[type as keyof typeof eventColors])} />
                <span>{label}</span>
            </div>
        ))}
      </div>
    </div>
  );
}
