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
  tipoVacuna: z.string().min(2, 'Vaccine type is required.'),
  fechaAplicacion: z.date({ required_error: 'Application date is required.' }),
  fechaProximaDosis: z.date({ required_error: 'Next dose date is required.' }),
  veterinario: z.string().min(2, 'Veterinarian name is required.'),
  lote: z.string().optional(),
});

type VaccinationFormProps = {
  petSpecies: Pet['especie'];
  closeDialog: () => void;
};

export function VaccinationForm({ petSpecies, closeDialog }: VaccinationFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { tipoVacuna: '', veterinario: '' },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: 'Success!',
      description: 'Vaccination record has been added.',
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
              <FormLabel>Vaccine Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a vaccine" />
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
            name="fechaAplicacion"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Application Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                      >
                        {field.value ? formatDate(field.value) : <span>Pick a date</span>}
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
                <FormLabel>Next Dose Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                      >
                        {field.value ? formatDate(field.value) : <span>Pick a date</span>}
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
              <FormLabel>Veterinarian</FormLabel>
              <FormControl>
                <Input placeholder="Dr. Smith" {...field} />
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
              <FormLabel>Batch Number (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="ABC12345" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4">
          <Button type="submit">Save Record</Button>
        </div>
      </form>
    </Form>
  );
}
