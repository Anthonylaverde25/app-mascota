import Image from 'next/image';
import { notFound } from 'next/navigation';
import { differenceInYears, differenceInMonths, format } from 'date-fns';
import { Cake, Palette, PawPrint, VenetianMask } from 'lucide-react';

import { getPetById } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import HealthRecordsTabs from './_components/health-records-tabs';
import { Separator } from '@/components/ui/separator';

function getAge(birthDate: Date) {
  const today = new Date();
  const years = differenceInYears(today, birthDate);
  const months = differenceInMonths(today, birthDate) % 12;
  
  if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''}${months > 0 ? `, ${months} month${months > 1 ? 's' : ''}` : ''}`;
  }
  return `${months} month${months > 1 ? 's' : ''}`;
}

export default function PetDetailPage({ params }: { params: { id: string } }) {
  const pet = getPetById(params.id);

  if (!pet) {
    notFound();
  }

  const petDetails = [
    { icon: PawPrint, label: 'Species', value: pet.especie },
    { icon: VenetianMask, label: 'Breed', value: pet.raza },
    { icon: Cake, label: 'Age', value: getAge(pet.fechaNacimiento) },
    { icon: Palette, label: 'Color', value: pet.color },
  ];

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader className="relative h-64 w-full p-0">
              <Image
                src={pet.fotoPerfil.imageUrl}
                alt={pet.fotoPerfil.description}
                data-ai-hint={pet.fotoPerfil.imageHint}
                fill
                className="object-cover rounded-t-lg"
              />
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-3xl font-headline mb-1">{pet.nombre}</CardTitle>
                  <p className="text-sm text-muted-foreground">Born on {format(pet.fechaNacimiento, "MMMM d, yyyy")}</p>
                </div>
                <Badge variant={pet.sexo === 'Macho' ? 'default' : 'destructive'} className='capitalize bg-accent text-accent-foreground'>{pet.sexo}</Badge>
              </div>
              <Separator className="my-4" />
              <div className="space-y-3">
                {petDetails.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center text-sm">
                    <Icon className="h-4 w-4 mr-3 text-muted-foreground" />
                    <span className="font-medium mr-2">{label}:</span>
                    <span className="text-muted-foreground">{value}</span>
                  </div>
                ))}
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
