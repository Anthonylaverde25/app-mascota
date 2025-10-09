
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Briefcase } from 'lucide-react';

const serviceProfileSchema = z.object({
  serviceName: z.string().min(3, { message: 'El nombre del servicio es requerido.' }),
  category: z.enum(['Veterinario', 'Paseador', 'Tienda']),
  description: z.string().max(200, { message: 'La descripción no puede exceder los 200 caracteres.' }).optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().url({ message: 'Por favor, introduce una URL válida.' }).optional().or(z.literal('')),
});

export default function ProfileServicePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof serviceProfileSchema>>({
    resolver: zodResolver(serviceProfileSchema),
    defaultValues: {
      serviceName: '',
      description: '',
      location: '',
      phone: '',
      website: '',
    },
  });

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    } else if (user) {
      // Here you would fetch the service provider's data from your backend
      // and populate the form. For now, we use mock data.
      form.reset({
        serviceName: user.displayName ? `${user.displayName}'s Service` : 'Mi Servicio',
        category: 'Veterinario', // default
        description: 'Servicios profesionales para el cuidado de tu mascota.',
        location: 'Ciudad Capital',
        phone: '123-456-7890',
        website: 'https://myservice.com'
      });
    }
  }, [user, isUserLoading, router, form]);
  
  function onSubmit(values: z.infer<typeof serviceProfileSchema>) {
    console.log(values);
    toast({
      title: 'Perfil de Servicio Actualizado',
      description: 'Tu información pública ha sido guardada correctamente.',
    });
  }

  if (isUserLoading || !user) {
    return (
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'Servicio'} />
                  <AvatarFallback><Briefcase /></AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-grow">
                <CardTitle className="font-headline text-3xl">Perfil de Proveedor</CardTitle>
                <CardDescription>Esta es la información que otros usuarios verán en la sección de Comunidad.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                   <FormField
                    control={form.control}
                    name="serviceName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre del Servicio</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Veterinaria San Roque" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoría</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una categoría" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Veterinario">Veterinario</SelectItem>
                            <SelectItem value="Paseador">Paseador</SelectItem>
                            <SelectItem value="Tienda">Tienda</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción Breve</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe tu servicio en pocas palabras..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ubicación</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Av. Principal 123, Ciudad" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono de Contacto</FormLabel>
                        <FormControl>
                          <Input placeholder="(123) 456-7890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sitio Web o Red Social (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://tu-sitio.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end pt-4">
                  <Button type="submit">Guardar Perfil de Servicio</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
