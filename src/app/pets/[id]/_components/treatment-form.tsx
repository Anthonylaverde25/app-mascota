'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CalendarIcon, AlertCircle, Sparkles } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { identifyMedicationSideEffects } from '@/ai/flows/medication-side-effect-identification';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  nombreMedicamento: z.string().min(2, 'El nombre del medicamento es requerido.'),
  dosificacion: z.string().min(2, 'La dosificación es requerida.'),
  duracion: z.string().min(2, 'La duración es requerida.'),
  fechaInicio: z.date({ required_error: 'La fecha de inicio es requerida.' }),
});

type TreatmentFormProps = {
  closeDialog: () => void;
};

export function TreatmentForm({ closeDialog }: TreatmentFormProps) {
  const { toast } = useToast();
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [sideEffects, setSideEffects] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombreMedicamento: '',
      dosificacion: '',
      duracion: '',
    },
  });

  const handleIdentifySideEffects = async () => {
    const { nombreMedicamento, dosificacion, duracion } = form.getValues();
    if (!nombreMedicamento || !dosificacion || !duracion) {
      toast({
        variant: 'destructive',
        title: 'Información Faltante',
        description: 'Por favor, completa Medicamento, Dosis y Duración para identificar efectos secundarios.',
      });
      return;
    }
    setIsIdentifying(true);
    setSideEffects('');
    try {
      const result = await identifyMedicationSideEffects({
        medicationName: nombreMedicamento,
        dosificacion: dosificacion,
        duracion: duracion,
      });
      setSideEffects(result.potentialSideEffects);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error de IA',
        description: 'No se pudieron identificar los efectos secundarios en este momento.',
      });
    } finally {
      setIsIdentifying(false);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: '¡Éxito!',
      description: 'El registro del tratamiento ha sido añadido.',
    });
    closeDialog();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nombreMedicamento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Medicamento</FormLabel>
              <FormControl>
                <Input placeholder="ej., Apoquel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dosificacion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dosis</FormLabel>
                <FormControl>
                  <Input placeholder="1 pastilla / 12 horas" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duracion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duración</FormLabel>
                <FormControl>
                  <Input placeholder="14 días" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
            control={form.control}
            name="fechaInicio"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de Inicio</FormLabel>
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

        <div className="space-y-2 pt-2">
          <Button type="button" variant="outline" onClick={handleIdentifySideEffects} disabled={isIdentifying} className="w-full">
            <Sparkles className="mr-2 h-4 w-4" />
            {isIdentifying ? 'Identificando...' : 'Identificar Efectos Secundarios (IA)'}
          </Button>
          {isIdentifying && (
            <div className="text-sm text-muted-foreground text-center animate-pulse">La IA está analizando...</div>
          )}
          {sideEffects && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="font-headline">Posibles Efectos Secundarios</AlertTitle>
              <AlertDescription className="whitespace-pre-wrap text-xs">{sideEffects}</AlertDescription>
            </Alert>
          )}
        </div>
        
        <div className="flex justify-end pt-4">
          <Button type="submit">Guardar Registro</Button>
        </div>
      </form>
    </Form>
  );
}
