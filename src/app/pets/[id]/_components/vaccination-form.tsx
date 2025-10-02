'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CalendarIcon } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VACCINE_TYPES, type Pet } from '@/lib/data';

const formSchema = z.object({
  tipoVacuna: z.string().min(2, 'El tipo de vacuna es requerido.'),
  fechaAplicacion: z.date({ required_error: 'La fecha de aplicación es requerida.' }),
  fechaProximaDosis: z.date({ required_error: 'La fecha de la próxima dosis es requerida.' }),
  veterinario: z.string().min(2, 'El nombre del veterinario es requerido.'),
  dosisAplicadas: z.coerce.number().positive('Debe ser un número positivo.').optional(),
  dosisTotales: z.coerce.number().positive('Debe ser un número positivo.').optional(),
  lote: z.string().optional(),
  etiquetaUrl: z.string().url('Debe ser una URL válida.').optional().or(z.literal('')),
});

type VaccinationFormProps = {
  petSpecies: Pet['especie'];
  closeDialog: () => void;
};

export function VaccinationForm({ petSpecies, closeDialog }: VaccinationFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { tipoVacuna: '', veterinario: '', lote: '', etiquetaUrl: '' },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: '¡Éxito!',
      description: 'El registro de vacunación ha sido añadido.',
    });
    closeDialog();
  }

  const availableVaccines = VACCINE_TYPES[petSpecies as keyof typeof VACCINE_TYPES] || [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="tipoVacuna"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Vacuna</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una vacuna" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableVaccines.map((vaccine) => (
                    <SelectItem key={vaccine.name} value={vaccine.name}>
                      {vaccine.name} {vaccine.mandatory && '(Obligatoria)'}
                    </SelectItem>
                  ))}
                   <SelectItem value="Otra">Otra</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dosisAplicadas"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dosis Aplicada</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="ej., 1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dosisTotales"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dosis Totales</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="ej., 3" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fechaAplicacion"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de Aplicación</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                      >
                        {field.value ? formatDate(field.value) : <span>Elige una fecha</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fechaProximaDosis"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha Próxima Dosis</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                      >
                        {field.value ? formatDate(field.value) : <span>Elige una fecha</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="veterinario"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Veterinario</FormLabel>
              <FormControl>
                <Input placeholder="Dr. Pérez" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lote"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Lote (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="ABC12345" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="etiquetaUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de la Etiqueta (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="https://ejemplo.com/imagen.png" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4">
          <Button type="submit">Guardar Registro</Button>
        </div>
      </form>
    </Form>
  );
}
