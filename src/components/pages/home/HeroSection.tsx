'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Search, Stethoscope, Footprints, Store, MapPin } from 'lucide-react'
import { PlaceHolderImages } from '@/lib/placeholder-images'
import { useAuthStore } from '@/zustand/authStore'
import useSyncAuth from '@/@features/auth/hook/useSyncAuth'

export function HeroSection() {
    // const { data, isLoading, error } = useSyncAuth()
    // console.log('user desde el store', data?.authUser.name)
    const { user } = useAuthStore()

    const router = useRouter()
    const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-main')

    const handleSearch = () => {
        router.push('/community')
    }

    console.log('USUARIO SETENADO ', user)

    // console.log('data del user', data)
    return (
        <section className="relative w-full h-[calc(100vh-80px)] flex items-center justify-center">
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
                <div className="flex flex-col  items-center">
                    <div className="flex p-1.5">
                        <p className="font-bold ">{`¡Bienvenido de vuelta ${
                            user?.name ?? ''
                        }`}</p>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-headline font-bold drop-shadow-md">
                        El cuidado que tu mascota merece
                    </h1>
                </div>
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
                </Card>
            </div>
        </section>
    )
}
