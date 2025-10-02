'use client';

import * as React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { es } from 'date-fns/locale';
import { addDays, differenceInDays, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Pet, ReproductiveEvent } from '@/lib/data';

const GESTATION_PERIOD: Record<string, number> = {
  Perro: 63,
  Gato: 63,
  default: 63,
};

type CalendarProps = {
  events: ReproductiveEvent[];
  species: Pet['especie'];
};

export function ReproductiveCalendar({ events, species }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date());

  const heatEvents = events.filter((e) => e.tipoEvento === 'Celo').sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  const matingEvents = events.filter((e) => e.tipoEvento === 'Monta').sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  const modifiers: Record<string, any | any[]> = {
    heat: [],
    fertilityWindow: [],
    mating: [],
    ultrasound: [],
    dueDate: [],
    nextHeat: [],
  };
  const modifierStyles = {
    heat: { backgroundColor: 'var(--color-celo)' },
    fertilityWindow: {
      backgroundColor: 'var(--color-fertilidad-bg)',
      color: 'var(--color-fertilidad-fg)',
    },
    mating: { backgroundColor: 'var(--color-monta)' },
    ultrasound: { '--icon': "'🩺'", '::after': { content: 'var(--icon)' } },
    dueDate: { '--icon': "'🍼'", '::after': { content: 'var(--icon)' } },
    nextHeat: { '--icon': "'🔥'", '::after': { content: 'var(--icon)' } },
  };

  heatEvents.forEach((event) => {
    const heatDate = new Date(event.fecha);
    modifiers.heat.push(heatDate);
    // Fertility window: from day 2 to day 7 of heat
    for (let i = 2; i <= 7; i++) {
      modifiers.fertilityWindow.push(addDays(heatDate, i));
    }
  });

  matingEvents.forEach((event) => {
    const matingDate = new Date(event.fecha);
    const gestationDays = GESTATION_PERIOD[species] || GESTATION_PERIOD.default;
    modifiers.mating.push(matingDate);
    modifiers.ultrasound.push(addDays(matingDate, 25)); // Ultrasound reminder
    modifiers.dueDate.push(addDays(matingDate, gestationDays)); // Due date
  });

  // Calculate next estimated heat
  if (heatEvents.length >= 2) {
    const lastHeat = new Date(heatEvents[0].fecha);
    const previousHeat = new Date(heatEvents[1].fecha);
    const cycleDays = differenceInDays(lastHeat, previousHeat);
    if (cycleDays > 0) {
      const nextHeatDate = addDays(lastHeat, cycleDays);
      modifiers.nextHeat.push(nextHeatDate);
    }
  }
  
  const legendItems = [
    { label: 'Celo', color: 'bg-event-heat' },
    { label: 'Ventana Fértil', color: 'bg-event-fertility' },
    { label: 'Monta', color: 'bg-event-mating' },
    { label: 'Próx. Celo (est.)', icon: '🔥' },
    { label: 'Ecografía (25 días)', icon: '🩺' },
    { label: 'Fecha Parto (est.)', icon: '🍼' },
  ];

  return (
    <div className="flex flex-col items-center w-full">
      <style>{`
        :root {
          --color-celo: hsl(340 84% 60% / 0.3);
          --color-fertilidad-bg: hsl(340 84% 60% / 0.6);
          --color-fertilidad-fg: #fff;
          --color-monta: hsl(142 76% 36% / 0.4);
        }
        .rdp-day_nextHeat::after, .rdp-day_dueDate::after, .rdp-day_ultrasound::after {
          position: absolute;
          bottom: 2px;
          right: 2px;
          font-size: 0.75rem;
          line-height: 1;
        }
      `}</style>
      <Calendar
        mode="single"
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        locale={es}
        className="p-0 rounded-md border w-full"
        modifiers={modifiers}
        modifierStyles={modifierStyles}
      />
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm w-full max-w-md">
        {legendItems.map((item) => (
          <div key={item.label} className="flex items-center gap-x-2">
            {item.color ? (
              <div className={cn('w-3 h-3 rounded-full', item.color)} />
            ) : (
              <span className="w-3 h-3 text-center">{item.icon}</span>
            )}
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

    