'use client';

import * as React from 'react';
import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '@/firebase';
import { differenceInYears, differenceInMonths, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Cake, Palette, VenetianMask, Cat, Dog } from 'lucide-react';

import { getPetById } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import HealthRecordsTabs from './_components/health-records-tabs';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

function getAge(birthDate: Date) {
  const today = new Date();
  const years = differenceInYears(today, birthDate);
  const months = differenceInMonths(today, birthDate) % 12;
  
  if (years > 0) {
    return `${years} año${years > 1 ? 's' : ''}${months > 0 ? `, ${months} mes${months > 1 ? 'es' : ''}` : ''}`;
  }
  return `${months} mes${months > 1 ? 'es' : ''}`;
}

export default function PetDetailPage({ params }: { params: { id: string } }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pet = getPetById(params.id);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (!pet) {
    notFound();
  }

  if (isUserLoading || !user) {
    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <Card className="sticky top-20">
                        <Skeleton className="h-64 w-full rounded-t-lg" />
                        <CardContent className="p-6 space-y-4">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Separator />
                            <Skeleton className="h-6 w-1/3" />
                            <div className="space-y-3">
                                <Skeleton className="h-5 w-full" />
                                <Skeleton className="h-5 w-full" />
                                <Skeleton className="h-5 w-full" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-2">
                    <Skeleton className="h-[500px] w-full" />
                </div>
            </div>
        </div>
    )
  }

  const petDetails = [
    { icon: pet.especie === 'Perro' ? Dog : Cat, label: 'Especie', value: pet.especie },
    { icon: VenetianMask, label: 'Raza', value: pet.raza },
    { icon: Palette, label: 'Color', value: pet.color },
  ];

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <div className="relative h-64 w-full">
              <Image
                src={pet.fotoPerfil.imageUrl}
                alt={pet.fotoPerfil.description}
                data-ai-hint={pet.fotoPerfil.imageHint}
                fill
                className="object-cover rounded-t-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-t-lg" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-headline font-bold">{pet.nombre}</h2>
                    <Badge 
                        variant={pet.sexo === 'Macho' ? 'default' : 'secondary'} 
                        className="capitalize text-xs"
                    >
                        {pet.sexo}
                    </Badge>
                </div>
              </div>
            </div>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Nacimiento</h3>
                 <div className="flex items-center text-sm">
                    <Cake className="h-4 w-4 mr-3 text-muted-foreground" />
                    <span className="text-muted-foreground">{format(pet.fechaNacimiento, "d 'de' MMMM 'de' yyyy", { locale: es })}</span>
                </div>
                <div className="flex items-center text-sm mt-2">
                    <span className="font-medium mr-2 w-[52px]">Edad:</span>
                    <span className="text-muted-foreground">{getAge(pet.fechaNacimiento)}</span>
                </div>
              </div>
              <Separator />
               <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Características</h3>
                <div className="space-y-3">
                    {petDetails.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center text-sm">
                        <Icon className="h-4 w-4 mr-3 text-muted-foreground" />
                        <span className="font-medium mr-2 w-12">{label}:</span>
                        <span className="text-muted-foreground">{value}</span>
                    </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
            <HealthRecordsTabs pet={pet} />
        </div>
      </div>
    </div>
  );
}
