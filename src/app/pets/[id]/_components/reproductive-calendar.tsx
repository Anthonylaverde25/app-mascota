'use client';

import * as React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { ReproductiveEvent } from '@/lib/data';

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

export function ReproductiveCalendar() {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date());
  
  return (
    <div className="flex flex-col items-center w-full">
       <Calendar
        mode="single"
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        locale={es}
        className="p-0 rounded-md border w-full"
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
