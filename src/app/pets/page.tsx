'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useUser } from '@/firebase'
import { getPets } from '@/lib/data'
import {
    PetsHeader,
    PetsGrid,
    PetsLoadingSkeleton,
} from '@/components/pages/pets'

export default function MyPetsPage() {
    const { user, isUserLoading } = useUser()
    const router = useRouter()
    const pets = getPets()

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login')
        }
    }, [user, isUserLoading, router])

    const handleAddPet = () => {
        // TODO: Implementar lógica para añadir mascota
        console.log('Añadir nueva mascota')
    }

    if (isUserLoading || !user) {
        return <PetsLoadingSkeleton />
    }

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <PetsHeader onAddPet={handleAddPet} />
            <PetsGrid pets={pets} />
        </div>
    )
}
