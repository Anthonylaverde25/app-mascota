import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'

interface PetsHeaderProps {
    onAddPet?: () => void
}

export function PetsHeader({ onAddPet }: PetsHeaderProps) {
    return (
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-headline font-bold">Mis Mascotas</h1>
            <Button onClick={onAddPet}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Añadir Mascota
            </Button>
        </div>
    )
}
