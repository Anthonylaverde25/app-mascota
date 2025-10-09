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
import { getPets } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';
import { PawPrint, Pencil } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const profileSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
  email: z.string().email({ message: 'Por favor, introduce un correo electrónico válido.' }),
});

function EditProfileForm({ user, closeDialog }: { user: any, closeDialog: () => void }) {
    const { toast } = useToast();
    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user.displayName || '',
            email: user.email || '',
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
                <Button type="submit" className="w-full">Guardar Cambios</Button>
            </form>
        </Form>
    );
}


export default function ProfileOwnerPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pets = getPets(); // Fetching mock pets for now
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <Skeleton className="h-96 w-full" />
          </div>
          <div className="md:col-span-2">
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-headline font-bold">Mi Perfil</h1>
                <DialogTrigger asChild>
                    <Button>
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar Perfil
                    </Button>
                </DialogTrigger>
            </div>
            
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar mi Perfil</DialogTitle>
                </DialogHeader>
                <EditProfileForm user={user} closeDialog={() => setIsDialogOpen(false)} />
            </DialogContent>
        </Dialog>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="items-center text-center">
                <Avatar className="h-24 w-24 mb-2">
                    <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'Usuario'} />
                    <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
              <CardTitle className="text-2xl">{user.displayName}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Mis Mascotas</CardTitle>
              <CardDescription>Aquí puedes ver todas tus mascotas registradas.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pets.map((pet) => (
                  <Link href={`/pets/${pet.id}`} key={pet.id}>
                    <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                      <div className="relative h-32 w-full">
                        <Image
                          src={pet.fotoPerfil.imageUrl}
                          alt={pet.fotoPerfil.description}
                          data-ai-hint={pet.fotoPerfil.imageHint}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="font-bold truncate">{pet.nombre}</h3>
                        <p className="text-sm text-muted-foreground truncate">{pet.raza}</p>
                      </div>
                    </Card>
                  </Link>
                ))}
                {pets.length === 0 && (
                   <div className="text-center py-10 border-2 border-dashed rounded-lg col-span-full">
                    <PawPrint className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">Aún no tienes mascotas registradas.</p>
                    <Button variant="link" className="mt-2">Añadir una mascota</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
