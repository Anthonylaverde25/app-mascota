'use client';

import * as React from 'react';
import { Calendar } from '@/components/ui/calendar';
import type { ReproductiveEvent } from '@/lib/data';
import { es } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';
import { add, sub } from 'date-fns';

type ReproductiveCalendarProps = {
  events: ReproductiveEvent[];
};

export function ReproductiveCalendar({ events }: ReproductiveCalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date());

  const heatRanges: DateRange[] = React.useMemo(() => {
    const heatEvents = events.filter(event => event.tipoEvento === 'Celo');
    return heatEvents.map(event => ({
      from: sub(event.fecha, { days: 2 }), // Approximate start
      to: add(event.fecha, { days: 3 }),   // Approximate end
    }));
  }, [events]);
  

  return (
    <div className="flex flex-col items-center">
       <Calendar
        mode="multiple"
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        selected={heatRanges}
        modifiers={{
            'heat-period': heatRanges,
        }}
        modifiersClassNames={{
            'heat-period': 'bg-pink-200/80 dark:bg-pink-900/80 text-foreground',
        }}
        locale={es}
        className="p-0"
      />
      <div className="mt-4 flex items-center gap-x-4 text-sm">
        <div className="flex items-center gap-x-2">
            <div className="w-4 h-4 rounded-full bg-pink-200/80 dark:bg-pink-900/80 border border-primary/20"></div>
            <span>Período de Celo (Aprox.)</span>
        </div>
      </div>
    </div>
  );
}
