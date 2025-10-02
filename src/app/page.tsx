'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '@/firebase';

import { getPets } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
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
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-headline font-bold">Tus Mascotas</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Mascota
        </Button>
      </div>
      
      {pets.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">Aún no has añadido ninguna mascota.</p>
          <Button variant="link" className="text-primary">Añade tu primera mascota</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {pets.map((pet) => (
            <Link key={pet.id} href={`/pets/${pet.id}`} className="group relative block">
              <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                <Image
                  src={pet.fotoPerfil.imageUrl}
                  alt={pet.fotoPerfil.description}
                  data-ai-hint={pet.fotoPerfil.imageHint}
                  fill
                  className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-xl font-headline font-bold">{pet.nombre}</h3>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out mt-1">
                      <p className="text-sm text-gray-200">{pet.raza}</p>
                      <Badge variant="secondary" className="mt-2 text-xs">{pet.especie}</Badge>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
