
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect, useState } from 'react';
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
import { Briefcase, Pencil } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const serviceProfileSchema = z.object({
  serviceName: z.string().min(3, { message: 'El nombre del servicio es requerido.' }),
  category: z.enum(['Veterinario', 'Paseador', 'Tienda']),
  description: z.string().max(200, { message: 'La descripción no puede exceder los 200 caracteres.' }).optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().url({ message: 'Por favor, introduce una URL válida.' }).optional().or(z.literal('')),
});


function EditServiceForm({ closeDialog }: { closeDialog: () => void }) {
    const { toast } = useToast();
    const form = useForm<z.infer<typeof serviceProfileSchema>>({
        resolver: zodResolver(serviceProfileSchema),
        defaultValues: {
            serviceName: 'Paseos Felices con Juan',
            category: 'Paseador',
            description: 'Paseos grupales e individuales para perros de todas las razas y tamaños. Amor y dedicación garantizados.',
            location: 'Zona Residencial Norte',
            phone: '+54 9 11 3456-7890',
            website: 'https://instagram.com/paseosfelices',
        },
    });

    function onSubmit(values: z.infer<typeof serviceProfileSchema>) {
        console.log(values);
        toast({
            title: 'Perfil de Servicio Actualizado',
            description: 'Tu información pública ha sido guardada correctamente.',
        });
        closeDialog();
    }

    return (
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
                          <Input placeholder="Ej: Paseos Caninos Contentos" {...field} />
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
                        <FormLabel>Ubicación o Zona de Servicio</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Palermo, Buenos Aires" {...field} />
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
                        <Input placeholder="https://instagram.com/tu-usuario" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end pt-4">
                  <Button type="submit">Guardar Perfil</Button>
                </div>
            </form>
        </Form>
    );
}

export default function ProfilePaseadorPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);
  
  if (isUserLoading || !user) {
    return (
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-96 w-full max-w-4xl mx-auto" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={'https://images.unsplash.com/photo-1599423697969-3a42935f8263?w=400'} alt={'Paseos Felices con Juan'} />
                            <AvatarFallback><Briefcase /></AvatarFallback>
                        </Avatar>
                        <div className="flex-grow">
                            <CardTitle className="font-headline text-3xl">Paseos Felices con Juan</CardTitle>
                            <CardDescription>Esta es la información que otros usuarios verán en la sección de Comunidad.</CardDescription>
                        </div>
                    </div>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Editar Perfil</span>
                        </Button>
                    </DialogTrigger>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <h3 className="font-bold">Descripción</h3>
                <p className="text-muted-foreground text-sm">Paseos grupales e individuales para perros de todas las razas y tamaños. Amor y dedicación garantizados.</p>
                <h3 className="font-bold">Información de Contacto</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                    <li><span className="font-semibold text-foreground">Categoría:</span> Paseador</li>
                    <li><span className="font-semibold text-foreground">Ubicación:</span> Zona Residencial Norte</li>
                    <li><span className="font-semibold text-foreground">Teléfono:</span> +54 9 11 3456-7890</li>
                    <li><span className="font-semibold text-foreground">Instagram:</span> <a href="https://instagram.com/paseosfelices" target="_blank" rel="noreferrer" className="text-primary hover:underline">@paseosfelices</a></li>
                </ul>
            </CardContent>
            </Card>

            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Editar Perfil de Servicio</DialogTitle>
                </DialogHeader>
                <EditServiceForm closeDialog={() => setIsDialogOpen(false)} />
            </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
