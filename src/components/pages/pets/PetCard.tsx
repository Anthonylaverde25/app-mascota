import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pet } from '@/lib/data'

interface PetCardProps {
    pet: Pet
}

export function PetCard({ pet }: PetCardProps) {
    return (
        <Card className="overflow-hidden flex flex-col">
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
                <h3 className="text-xl font-headline font-bold">
                    {pet.nombre}
                </h3>
                <p className="text-sm text-muted-foreground">{pet.raza}</p>
            </CardContent>
            <CardFooter className="p-2 pt-0">
                <Button asChild variant="secondary" className="w-full">
                    <Link href={`/pets/${pet.id}`}>Ver Historial</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
