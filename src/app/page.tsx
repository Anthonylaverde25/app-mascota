'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useUser } from '@/firebase'

import { Button } from '@/components/ui/button'
import {
    Search,
    Stethoscope,
    Footprints,
    Store,
    MapPin,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { PlaceHolderImages } from '@/lib/placeholder-images'

export default function Home() {
    const { user, isUserLoading } = useUser()
    const router = useRouter()
    const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-main')

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login')
        }
    }, [user, isUserLoading, router])

    if (isUserLoading || !user) {
        return (
            <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <Skeleton className="h-[60vh] w-full rounded-lg" />
            </div>
        )
    }

    const handleSearch = () => {
        router.push('/community')
    }

    return (
        <div className="relative w-full h-[calc(100vh-80px)] flex items-center justify-center">
            {heroImage && (
                <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    data-ai-hint={heroImage.imageHint}
                    fill
                    className="object-cover object-center"
                    priority
                />
            )}
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 flex flex-col items-center text-center text-white px-4">
                <h1 className="text-4xl md:text-6xl font-headline font-bold drop-shadow-md">
                    El cuidado que tu mascota merece
                </h1>
                <p className="mt-4 text-lg md:text-xl max-w-2xl drop-shadow">
                    Encuentra veterinarios, paseadores y tiendas cerca de ti.
                    Todo en un solo lugar.
                </p>
                <Card className="mt-8 p-4 w-full max-w-3xl bg-background/90 text-foreground shadow-2xl backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row gap-2">
                        <Select defaultValue="veterinario">
                            <SelectTrigger className="w-full md:w-[180px] text-sm">
                                <SelectValue placeholder="Tipo de servicio" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="veterinario">
                                    <div className="flex items-center">
                                        <Stethoscope className="mr-2 h-4 w-4" />
                                        Veterinario
                                    </div>
                                </SelectItem>
                                <SelectItem value="paseador">
                                    <div className="flex items-center">
                                        <Footprints className="mr-2 h-4 w-4" />
                                        Paseador
                                    </div>
                                </SelectItem>
                                <SelectItem value="tienda">
                                    <div className="flex items-center">
                                        <Store className="mr-2 h-4 w-4" />
                                        Tienda
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="relative flex-grow">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Ingresá tu ubicación"
                                className="pl-10 w-full"
                            />
                        </div>
                        <Button
                            size="lg"
                            className="w-full md:w-auto"
                            onClick={handleSearch}
                        >
                            <Search className="mr-2 h-5 w-5" />
                            Buscar
                        </Button>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-sm">
                        <span className="text-muted-foreground mr-2">
                            Búsqueda rápida:
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSearch}
                        >
                            <Stethoscope />
                            Veterinarias
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSearch}
                        >
                            <Footprints />
                            Paseadores
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSearch}
                        >
                            <Store />
                            Tiendas
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}