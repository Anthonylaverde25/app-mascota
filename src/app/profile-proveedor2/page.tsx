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
import { Briefcase, Pencil, MapPin, Phone, Globe } from 'lucide-react';
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
       <div className="min-h-screen bg-secondary/30 dark:bg-background">
            <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
                 <div className="flex justify-between items-center mb-6">
                    <Skeleton className="h-9 w-48" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="max-w-4xl mx-auto">
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
       </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30 dark:bg-background">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
         <div className="flex justify-between items-center mb-6">
             <h1 className="text-3xl font-bold font-headline">Perfil de Servicio</h1>
             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <Pencil className="h-4 w-4 mr-2" />
                        Editar Perfil
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                        <DialogTitle>Editar Perfil de Servicio</DialogTitle>
                    </DialogHeader>
                    <EditServiceForm closeDialog={() => setIsDialogOpen(false)} />
                </DialogContent>
            </Dialog>
        </div>
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
                <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={'https://images.unsplash.com/photo-1599423697969-3a42935f8263?w=400'} alt={'Paseos Felices con Juan'} />
                        <AvatarFallback className="bg-primary/10"><Briefcase className="text-primary" /></AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                        <CardTitle className="font-headline text-2xl">Paseos Felices con Juan</CardTitle>
                        <CardDescription>Paseador</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-semibold text-sm mb-2">Acerca de</h3>
                    <p className="text-muted-foreground text-sm">Paseos grupales e individuales para perros de todas las razas y tamaños. Amor y dedicación garantizados.</p>
                </div>
                <div>
                    <h3 className="font-semibold text-sm mb-2">Información de Contacto</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-3">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>Zona Residencial Norte</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>+54 9 11 3456-7890</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <a href="https://instagram.com/paseosfelices" target="_blank" rel="noreferrer" className="text-primary hover:underline">
                                @paseosfelices
                            </a>
                        </div>
                    </div>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
