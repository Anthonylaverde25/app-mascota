import Image from 'next/image';
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getPets } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function Home() {
  const pets = getPets();

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
            <Link key={pet.id} href={`/pets/${pet.id}`} className="group">
              <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-1">
                <CardHeader className="p-0">
                  <div className="relative aspect-square w-full">
                    <Image
                      src={pet.fotoPerfil.imageUrl}
                      alt={pet.fotoPerfil.description}
                      data-ai-hint={pet.fotoPerfil.imageHint}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                  <CardTitle className="text-xl font-headline mb-2">{pet.nombre}</CardTitle>
                  <p className="text-muted-foreground">{pet.raza}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Badge variant="secondary">{pet.especie}</Badge>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
