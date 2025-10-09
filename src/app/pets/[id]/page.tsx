'use client';

import * as React from 'react';
import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '@/firebase';
import { differenceInYears, differenceInMonths, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Cake, Palette, VenetianMask, Cat, Dog, Mars, Venus } from 'lucide-react';

import { getPetById } from '@/lib/data';
import HealthRecordsTabs from './_components/health-records-tabs';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


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
    // We don't want to redirect if the page is public
    // if (!isUserLoading && !user) {
    //   router.push('/login');
    // }
  }, [user, isUserLoading, router]);

  if (isUserLoading) {
     return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-8 w-48 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 xl:col-span-3">
                     <Skeleton className="h-[450px] w-full" />
                </div>
                <div className="lg:col-span-8 xl:col-span-9">
                    <Skeleton className="h-[600px] w-full" />
                </div>
            </div>
        </div>
    )
  }

  if (!pet) {
    notFound();
  }


  const petDetails = [
    { icon: pet.especie === 'Perro' ? Dog : Cat, label: 'Especie', value: pet.especie },
    { icon: VenetianMask, label: 'Raza', value: pet.raza },
    { icon: Palette, label: 'Color', value: pet.color },
  ];

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
       <h1 className="text-3xl font-headline font-bold mb-8">Perfil de Mascota</h1>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar */}
        <aside className="lg:col-span-4 xl:col-span-3 space-y-6 lg:sticky lg:top-24">
            <Card>
                <CardHeader className="items-center text-center">
                    <div className="relative h-24 w-24">
                        <Image
                            src={pet.fotoPerfil.imageUrl}
                            alt={pet.fotoPerfil.description}
                            data-ai-hint={pet.fotoPerfil.imageHint}
                            fill
                            className="object-cover rounded-full"
                        />
                    </div>
                    <CardTitle className="text-2xl font-headline pt-2">{pet.nombre}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 text-sm">
                    <div>
                        <h3 className="font-semibold text-base mb-3">Características</h3>
                        <div className="space-y-3 text-muted-foreground">
                            {petDetails.map(({ icon: Icon, label, value }) => (
                            <div key={label} className="flex items-center">
                                <Icon className="h-4 w-4 mr-3" />
                                <span className="font-medium mr-2 w-12 text-foreground">{label}:</span>
                                <span>{value}</span>
                            </div>
                            ))}
                        </div>
                    </div>
                    <Separator />
                    <div>
                        <h3 className="font-semibold text-base mb-3">Detalles</h3>
                        <div className="space-y-3 text-muted-foreground">
                           <div className="flex items-center">
                                {pet.sexo === 'Macho' ? <Mars className="h-4 w-4 mr-3" /> : <Venus className="h-4 w-4 mr-3" />}
                                <span className="font-medium mr-2 w-12 text-foreground">Sexo:</span>
                                <span>{pet.sexo}</span>
                           </div>
                           <div className="flex items-center">
                                <Cake className="h-4 w-4 mr-3" />
                                <span className="font-medium mr-2 w-12 text-foreground">Nacido:</span>
                                <span>{format(pet.fechaNacimiento, "d MMM, yyyy", { locale: es })}</span>
                           </div>
                             <div className="flex items-center">
                                <span className="font-medium mr-3 w-4" />
                                <span className="font-medium mr-2 w-12 text-foreground">Edad:</span>
                                <span>{getAge(pet.fechaNacimiento)}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-8 xl:col-span-9">
            <HealthRecordsTabs pet={pet} />
        </main>
      </div>
    </div>
  );
}