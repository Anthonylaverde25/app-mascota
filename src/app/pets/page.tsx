'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '@/firebase';
import { getPets, type Pet } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function MyPetsPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pets = getPets();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
             <div className="flex justify-between items-center mb-8">
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-10 w-36" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <Skeleton className="h-48 w-full rounded-t-lg" />
                        <CardContent className="p-4 space-y-2">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </CardContent>
                        <CardFooter>
                           <Skeleton className="h-10 w-full" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-headline font-bold">Mis Mascotas</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Mascota
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {pets.map((pet: Pet) => (
          <Card key={pet.id} className="overflow-hidden flex flex-col">
            <Link href={`/pets/${pet.id}`} className="block group">
              <div className="relative h-48 w-full">
                <Image
                  src={pet.fotoPerfil.imageUrl}
                  alt={pet.fotoPerfil.description}
                  data-ai-hint={pet.fotoPerfil.imageHint}
                  fill
                  className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                />
              </div>
            </Link>
            <CardContent className="p-4 flex-grow">
              <h3 className="text-xl font-headline font-bold">{pet.nombre}</h3>
              <p className="text-sm text-muted-foreground">{pet.raza}</p>
            </CardContent>
            <CardFooter className="p-2 pt-0">
               <Button asChild variant="secondary" className="w-full">
                <Link href={`/pets/${pet.id}`}>
                  Ver Historial
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
