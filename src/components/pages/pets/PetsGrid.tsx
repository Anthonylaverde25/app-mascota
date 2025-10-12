import { Pet } from '@/lib/data'
import { PetCard } from './PetCard'

interface PetsGridProps {
    pets: Pet[]
}

export function PetsGrid({ pets }: PetsGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {pets.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
            ))}
        </div>
    )
}
