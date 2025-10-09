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
import { getPets, type Pet } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';
import { PawPrint, Pencil, Plus, Mail, Phone, User as UserIcon, Calendar, IdCard, Building } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { differenceInYears } from 'date-fns';

const profileSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
  email: z.string().email({ message: 'Por favor, introduce un correo electrónico válido.' }),
  phone: z.string().optional(),
});

function EditProfileForm({ user, closeDialog }: { user: any, closeDialog: () => void }) {
    const { toast } = useToast();
    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user.displayName || '',
            email: user.email || '',
            phone: user.phoneNumber || '',
        },
    });

    function onSubmit(values: z.infer<typeof profileSchema>) {
        console.log(values);
        toast({
            title: 'Perfil Actualizado',
            description: 'Tu información ha sido guardada correctamente.',
        });
        closeDialog();
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex justify-center">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'Usuario'} />
                        <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                </div>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                                <Input placeholder="Tu nombre" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="tu@email.com" {...field} disabled />
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
                            <FormLabel>Teléfono</FormLabel>
                            <FormControl>
                                <Input placeholder="Tu número de teléfono" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">Guardar Cambios</Button>
            </form>
        </Form>
    );
}

export default function ProfileOwnerPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pets = getPets();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="bg-background min-h-screen">
          <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-9 w-48 mb-6" />
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-3">
                    <Skeleton className="h-80 w-full" />
                </div>
                <div className="col-span-12 lg:col-span-9 space-y-6">
                    <Skeleton className="h-12 w-1/3" />
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
        </div>
      </div>
    );
  }
  
  const getAge = (birthDate: Date) => differenceInYears(new Date(), birthDate);
  const recentActivity = [
      { pet: 'Buddy', action: 'se añadió un nuevo registro de vacuna.', time: 'hace 2 horas' },
      { pet: 'Lucy', action: 'se actualizó el registro de peso.', time: 'hace 1 día' },
      { pet: 'Rocky', action: 'se añadió un nuevo registro de desparasitación.', time: 'hace 3 días' },
  ]

  return (
    <div className="min-h-screen bg-secondary/30 dark:bg-background">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold font-headline">Mi Perfil</h1>
           <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                  <Button>
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar Perfil
                  </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                      <DialogTitle>Editar mi Perfil</DialogTitle>
                  </DialogHeader>
                  <EditProfileForm user={user} closeDialog={() => setIsDialogOpen(false)} />
              </DialogContent>
            </Dialog>
        </div>
        
         <Tabs defaultValue="overview" className="mb-6">
            <TabsList className="bg-transparent border-b rounded-none h-auto p-0 w-full justify-start">
                <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3">
                    Resumen
                </TabsTrigger>
                <TabsTrigger value="pets" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3">
                    Mis Mascotas
                </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-6">
                <div className="grid grid-cols-12 gap-6">
                     <div className="col-span-12 lg:col-span-4 xl:col-span-3 space-y-6">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex flex-col items-center text-center mb-6">
                                    <Avatar className="h-24 w-24 mb-4">
                                        <AvatarImage src={user.photoURL ?? ''} />
                                        <AvatarFallback className="bg-primary/10">
                                            <UserIcon className="h-12 w-12 text-primary" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <h2 className="text-xl font-bold mb-1">{user.displayName}</h2>
                                    <p className="text-sm text-muted-foreground">Dueño de Mascotas</p>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold mb-3">Contacto</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3 text-sm">
                                            <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                                            <div>
                                                <p className="text-muted-foreground text-xs">Email</p>
                                                <p className="font-medium text-xs break-all">{user.email}</p>
                                            </div>
                                        </div>
                                        {user.phoneNumber && (
                                            <div className="flex items-start gap-3 text-sm">
                                                <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                                                <div>
                                                    <p className="text-muted-foreground text-xs">Teléfono</p>
                                                    <p className="font-medium">{user.phoneNumber}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="col-span-12 lg:col-span-8 xl:col-span-9 space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Actividad Reciente</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {recentActivity.map((activity, index) => (
                                            <div key={index} className="flex items-start gap-3">
                                                <div className="bg-primary/10 p-2 rounded-full">
                                                    <PawPrint className="h-4 w-4 text-primary" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm">
                                                        <span className="font-medium">{activity.pet}</span>{' '}
                                                        <span className="text-muted-foreground">{activity.action}</span>
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>Mis Mascotas</CardTitle>
                                    <Button size="sm">
                                      <Plus className="h-4 w-4 mr-2" />
                                      Añadir
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                    {pets.slice(0, 4).map(pet => (
                                        <Link href={`/pets/${pet.id}`} key={pet.id}>
                                            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={pet.fotoPerfil.imageUrl} />
                                                    <AvatarFallback>{pet.nombre.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-semibold">{pet.nombre}</p>
                                                    <p className="text-xs text-muted-foreground">{pet.raza}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="pets" className="mt-6">
                <Card>
                    <CardHeader>
                      <CardTitle>Listado de Mascotas</CardTitle>
                      <CardDescription>Aquí puedes ver y gestionar todas tus mascotas registradas.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Especie</TableHead>
                                    <TableHead>Raza</TableHead>
                                    <TableHead>Edad</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pets.map((pet) => (
                                    <TableRow key={pet.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 hidden sm:flex">
                                                    <AvatarImage src={pet.fotoPerfil.imageUrl} />
                                                    <AvatarFallback>{pet.nombre.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                {pet.nombre}
                                            </div>
                                        </TableCell>
                                        <TableCell>{pet.especie}</TableCell>
                                        <TableCell>{pet.raza}</TableCell>
                                        <TableCell>{getAge(pet.fechaNacimiento)} años</TableCell>
                                        <TableCell className="text-right">
                                            <Button asChild variant="outline">
                                                <Link href={`/pets/${pet.id}`}>Ver Perfil</Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
         </Tabs>
      </div>
    </div>
  );
}
