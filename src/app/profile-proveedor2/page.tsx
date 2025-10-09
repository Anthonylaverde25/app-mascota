'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
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
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Briefcase, Plus, MapPin, Phone, Mail, Calendar, IdCard, Star, Footprints, MoreHorizontal } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

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

const clientsData = [
  {
    name: 'Buddy',
    owner: 'Ana García',
    breed: 'Golden Retriever',
    lastWalk: 'Hoy, 10:00 AM',
    avatar: 'https://images.unsplash.com/photo-1518606091957-4c24907bc6ed?w=100'
  },
  {
    name: 'Rocky',
    owner: 'Carlos Pérez',
    breed: 'Bulldog Francés',
    lastWalk: 'Ayer, 4:30 PM',
    avatar: 'https://images.unsplash.com/photo-1521907236370-15adf2297445?w=100'
  },
  {
    name: 'Lola',
    owner: 'María Fernández',
    breed: 'Beagle',
    lastWalk: 'Ayer, 9:00 AM',
    avatar: 'https://images.unsplash.com/photo-1594273012142-335a20d4f135?w=100'
  },
];

const reviewsData = [
  {
    author: 'Ana García',
    pet: 'Buddy',
    rating: 5,
    comment: '¡Juan es increíble! Buddy vuelve feliz y cansado de cada paseo. Totalmente recomendado.',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  },
  {
    author: 'Carlos Pérez',
    pet: 'Rocky',
    rating: 5,
    comment: 'Muy profesional y cariñoso con los perritos. Rocky lo adora. Siempre puntual.',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d',
  },
];

export default function ProfilePaseadorPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-secondary/30 dark:bg-background">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold font-headline">Perfil del Proveedor</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
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

        <Tabs defaultValue="overview" className="mb-6">
          <TabsList className="bg-transparent border-b rounded-none h-auto p-0 w-full justify-start">
            <TabsTrigger 
              value="overview" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
            >
              Vista General
            </TabsTrigger>
            <TabsTrigger 
              value="clients"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
            >
              Clientes
            </TabsTrigger>
            <TabsTrigger 
              value="reviews"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
            >
              Reseñas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-3 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center mb-6">
                      <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage src="https://images.unsplash.com/photo-1599423697969-3a42935f8263?w=400" />
                        <AvatarFallback className="bg-primary/10">
                          <Footprints className="h-12 w-12 text-primary" />
                        </AvatarFallback>
                      </Avatar>
                      <h2 className="text-xl font-bold mb-1">Paseos Felices con Juan</h2>
                      <p className="text-sm text-muted-foreground">#PAW-58392</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-semibold mb-3">Contacto</h3>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-muted-foreground text-xs">Teléfono</p>
                              <p className="font-medium">+54 9 11 3456-7890</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-muted-foreground text-xs">Email</p>
                              <p className="font-medium text-xs break-all">juan.paseos@example.com</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h3 className="text-sm font-semibold mb-3">Zona de Servicio</h3>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-muted-foreground text-xs">Área Principal</p>
                              <p className="font-medium">Zona Residencial Norte</p>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="col-span-12 lg:col-span-9 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Mis Clientes Peludos</h3>
                      <Button variant="link" className="text-primary hover:text-primary/80 p-0">
                        + Agregar Cliente
                      </Button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b text-left text-xs text-muted-foreground uppercase">
                            <th className="pb-3 font-medium">Mascota</th>
                            <th className="pb-3 font-medium">Dueño</th>
                            <th className="pb-3 font-medium">Raza</th>
                            <th className="pb-3 font-medium">Último Paseo</th>
                            <th className="pb-3 font-medium"></th>
                          </tr>
                        </thead>
                        <tbody className="text-sm">
                          {clientsData.map((client, index) => (
                            <tr key={index} className="border-b last:border-0">
                              <td className="py-3 flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={client.avatar} />
                                  <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                {client.name}
                              </td>
                              <td className="py-3">{client.owner}</td>
                              <td className="py-3">{client.breed}</td>
                              <td className="py-3">{client.lastWalk}</td>
                              <td className="py-3 text-right">
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Últimas Reseñas</h3>
                    <div className="space-y-4">
                      {reviewsData.map((review, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={review.avatar} />
                            <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                             <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-sm">{review.author} <span className="text-muted-foreground font-normal">(Dueño/a de {review.pet})</span></p>
                                    <div className="flex items-center gap-0.5">
                                        {[...Array(review.rating)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 italic">&quot;{review.comment}&quot;</p>
                          </div>
                        </div>
                      ))}
                      <Button variant="link" className="text-primary hover:text-primary/80 p-0 text-sm">
                        Ver todas las reseñas
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
